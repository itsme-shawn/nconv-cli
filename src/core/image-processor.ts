import axios from 'axios';
import { createWriteStream, promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface ImageProcessResult {
  markdown: string;
  downloadedImages: string[];
  failedImages: string[];
}

export interface ProcessorOptions {
  outputDir: string;
  imageDir: string;
  verbose: boolean;
}

/**
 * 이미지 다운로드 및 마크다운 경로 변환 처리
 */
export class ImageProcessor {
  private options: ProcessorOptions;
  private imageOutputDir: string;

  constructor(options: ProcessorOptions) {
    this.options = options;
    this.imageOutputDir = path.join(options.outputDir, options.imageDir);
  }

  /**
   * 이미지 디렉토리 생성
   */
  async ensureImageDirectory(): Promise<void> {
    await fs.mkdir(this.imageOutputDir, { recursive: true });
  }

  /**
   * 단일 이미지 다운로드
   */
  private async downloadImage(url: string): Promise<string> {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000, // 30초 타임아웃
    });

    const extension = response.headers['content-type']?.split('/')[1] || 'png';
    const fileName = `${uuidv4().slice(0, 8)}.${extension}`;
    const filePath = path.join(this.imageOutputDir, fileName);

    const writer = response.data.pipe(createWriteStream(filePath));

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(fileName));
      writer.on('error', reject);
    });
  }

  /**
   * 마크다운에서 이미지 URL 추출
   */
  private extractImageUrls(markdown: string): string[] {
    const imageUrlRegex = /!\[.*?\]\((https:\/\/[^)]+)\)/g;
    const matches = [...markdown.matchAll(imageUrlRegex)];
    return matches.map(match => match[1]);
  }

  /**
   * 마크다운 내 이미지 처리
   */
  async processMarkdown(markdown: string): Promise<ImageProcessResult> {
    await this.ensureImageDirectory();

    const imageUrls = this.extractImageUrls(markdown);

    if (this.options.verbose) {
      console.log(`\n총 ${imageUrls.length}개의 이미지 발견`);
      console.log(`이미지 다운로드 시작...\n`);
    }

    let processedMarkdown = markdown;
    const downloadedImages: string[] = [];
    const failedImages: string[] = [];

    // 이미지 다운로드 (순차 처리)
    for (const url of imageUrls) {
      try {
        if (this.options.verbose) {
          console.log(`다운로드 중: ${url}`);
        }

        const fileName = await this.downloadImage(url);
        const relativePath = `./${this.options.imageDir}/${fileName}`;

        // 마크다운 내 URL 교체
        processedMarkdown = processedMarkdown.replaceAll(url, relativePath);
        downloadedImages.push(fileName);

        if (this.options.verbose) {
          console.log(`✓ 저장됨: ${relativePath}\n`);
        }
      } catch (error) {
        failedImages.push(url);
        if (this.options.verbose) {
          const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
          console.error(`✗ 실패: ${url}\n  ${errorMsg}\n`);
        }
      }
    }

    return {
      markdown: processedMarkdown,
      downloadedImages,
      failedImages,
    };
  }
}
