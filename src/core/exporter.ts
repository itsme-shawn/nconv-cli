import { NotionExporter } from 'notion-exporter';
import { promises as fs } from 'fs';
import path from 'path';
import type { NotionConfig } from '../config.js';

export interface ExportResult {
  markdown: string;
  imageFiles: Array<{ filename: string; sourcePath: string }>;
}

/**
 * Notion 페이지를 마크다운으로 내보내기
 */
export class NotionMarkdownExporter {
  private exporter: NotionExporter;

  constructor(config: NotionConfig) {
    this.exporter = new NotionExporter(config.tokenV2, config.fileToken);
  }

  /**
   * Notion URL에서 마크다운과 이미지 파일 가져오기
   */
  async exportWithImages(notionUrl: string, tempDir: string): Promise<ExportResult> {
    try {
      // 임시 디렉토리 생성
      await fs.mkdir(tempDir, { recursive: true });

      // getMdFiles로 마크다운과 이미지를 함께 다운로드
      await this.exporter.getMdFiles(notionUrl, tempDir);

      // 다운로드된 파일 목록 가져오기
      const files = await fs.readdir(tempDir, { withFileTypes: true });

      // 마크다운 파일 찾기
      const mdFile = files.find(f => f.isFile() && f.name.endsWith('.md'));
      if (!mdFile) {
        throw new Error('마크다운 파일을 찾을 수 없습니다.');
      }

      // 마크다운 내용 읽기
      const mdPath = path.join(tempDir, mdFile.name);
      const markdown = await fs.readFile(mdPath, 'utf-8');

      // 이미지 파일 목록 (마크다운이 아닌 파일들)
      const imageFiles = files
        .filter(f => f.isFile() && !f.name.endsWith('.md'))
        .map(f => ({
          filename: f.name,
          sourcePath: path.join(tempDir, f.name),
        }));

      // 디렉토리 내 폴더도 확인 (Notion이 폴더 구조로 저장할 수 있음)
      const dirs = files.filter(f => f.isDirectory());
      for (const dir of dirs) {
        const subFiles = await fs.readdir(path.join(tempDir, dir.name), { withFileTypes: true });
        for (const subFile of subFiles) {
          if (subFile.isFile() && !subFile.name.endsWith('.md')) {
            imageFiles.push({
              filename: path.join(dir.name, subFile.name),
              sourcePath: path.join(tempDir, dir.name, subFile.name),
            });
          }
        }
      }

      return { markdown, imageFiles };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Notion 페이지를 가져올 수 없습니다: ${error.message}`);
      }
      throw new Error('Notion 페이지를 가져올 수 없습니다.');
    }
  }
}
