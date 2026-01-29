import { ConverterOptions, createConfig } from '../config.js';
import { NotionMarkdownExporter } from '../core/exporter.js';
import { generateSafeFilename, extractTitleFromUrl, saveMarkdownFile } from '../utils/file.js';
import * as logger from '../utils/logger.js';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

/**
 * md 명령어 핸들러
 */
export async function mdCommand(notionUrl: string, options: ConverterOptions) {
  const tempDir = path.join(os.tmpdir(), `nconv-cli-${Date.now()}`);

  try {
    // 설정 생성
    const config = createConfig(options);

    if (config.verbose) {
      logger.info('Configuration loaded successfully');
      console.log(`  Output directory: ${config.output}\n`);
    }

    // 1. Notion에서 마크다운과 이미지 가져오기
    const spinner = logger.spinner('Fetching Notion page...');

    const exporter = new NotionMarkdownExporter({
      tokenV2: config.tokenV2,
      fileToken: config.fileToken,
    });

    let result;
    try {
      result = await exporter.exportWithImages(notionUrl, tempDir);
      spinner.succeed(`Notion page fetched (${result.imageFiles.length} images)`);
    } catch (error) {
      spinner.fail('Failed to fetch Notion page');
      throw error;
    }

    // 2. 파일명/폴더명 생성
    let baseFilename: string;
    if (config.filename) {
      baseFilename = config.filename.replace(/\.md$/, '');
    } else {
      const title = extractTitleFromUrl(notionUrl);
      baseFilename = generateSafeFilename(title, ''); // 확장자 없이 생성
    }

    // 3. 제목별 폴더 생성 (output/제목/)
    const pageDir = path.join(config.output, baseFilename);
    await fs.mkdir(pageDir, { recursive: true });

    if (config.verbose) {
      console.log(`📁 출력 폴더: ${path.relative(process.cwd(), pageDir)}\n`);
    }

    // 4. 이미지 폴더 생성 및 이미지 파일 이동
    const imageOutputDir = path.join(pageDir, config.imageDir);
    await fs.mkdir(imageOutputDir, { recursive: true });

    if (config.verbose && result.imageFiles.length > 0) {
      console.log(`Processing image files...\n`);
    }

    let processedMarkdown = result.markdown;
    for (const imageFile of result.imageFiles) {
      try {
        // 파일명에서 공백을 하이픈으로 변경 (마크다운 호환성)
        const originalFileName = path.basename(imageFile.filename);
        const safeFileName = originalFileName.replace(/\s+/g, '-');

        // 이미지 파일 복사
        const targetPath = path.join(imageOutputDir, safeFileName);
        await fs.copyFile(imageFile.sourcePath, targetPath);

        if (config.verbose) {
          console.log(`✓ ${safeFileName}`);
        }

        // 마크다운 내 경로를 상대경로로 변경
        const originalPath = imageFile.filename;
        const relativePath = `./${config.imageDir}/${safeFileName}`;

        // Notion이 URL 인코딩하는 방식: 각 경로 부분을 개별적으로 인코딩
        const pathParts = originalPath.split('/');
        const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');

        // 정규식 특수문자 이스케이프 함수
        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // 모든 가능한 형태의 경로를 교체
        processedMarkdown = processedMarkdown
          .replace(new RegExp(`\\(${escapeRegex(originalPath)}\\)`, 'g'), `(${relativePath})`)
          .replace(new RegExp(`\\(${escapeRegex(encodedPath)}\\)`, 'g'), `(${relativePath})`);

      } catch (error) {
        if (config.verbose) {
          const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
          console.error(`✗ ${imageFile.filename}: ${errorMsg}`);
        }
      }
    }

    // 5. 마크다운 파일 저장 (제목 폴더 안에)
    const filename = `${baseFilename}.md`;
    const filePath = await saveMarkdownFile(pageDir, filename, processedMarkdown);

    // 6. 결과 출력
    console.log('');
    logger.success('Conversion complete!');
    console.log('');
    console.log(`📁 Folder: ${path.relative(process.cwd(), pageDir)}`);
    console.log(`📄 Markdown: ${filename}`);

    if (result.imageFiles.length > 0) {
      console.log(`🖼️  Images: ${config.imageDir}/ (${result.imageFiles.length} files)`);
    }

    console.log('');

  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('An unknown error occurred.');
    }
    process.exit(1);
  } finally {
    // 임시 디렉토리 정리
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // 무시
    }
  }
}
