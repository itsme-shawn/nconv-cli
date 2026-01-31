import { ConverterOptions, createConfig } from '../config.js';
import { NotionMarkdownExporter } from '../core/exporter.js';
import { generateSafeFilename, extractTitleFromUrl } from '../utils/file.js';
import * as logger from '../utils/logger.js';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

/**
 * pdf 명령어 핸들러
 * Notion → Markdown → PDF 플로우로 깔끔한 PDF 생성
 */
export async function pdfCommand(notionUrl: string, options: ConverterOptions) {
  const tempDir = path.join(os.tmpdir(), `nconv-cli-${Date.now()}`);

  try {
    // 설정 생성
    const config = createConfig(options);

    if (config.verbose) {
      logger.info('Configuration loaded successfully');
      console.log(`  Output directory: ${config.output}\n`);
    }

    // 1. Notion에서 Markdown 가져오기
    const spinner = logger.spinner('Fetching Notion page as Markdown...');

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
      baseFilename = config.filename.replace(/\.pdf$/, '');
    } else {
      const title = extractTitleFromUrl(notionUrl);
      baseFilename = generateSafeFilename(title, '');
    }

    // 3. 제목별 폴더 생성 (output/제목/)
    const pageDir = path.join(config.output, baseFilename);
    await fs.mkdir(pageDir, { recursive: true });

    // 4. 이미지 폴더 생성 및 이미지 파일 이동
    const imageOutputDir = path.join(pageDir, config.imageDir);
    await fs.mkdir(imageOutputDir, { recursive: true });

    if (config.verbose && result.imageFiles.length > 0) {
      console.log(`Processing image files...\n`);
    }

    let processedMarkdown = result.markdown;
    for (const imageFile of result.imageFiles) {
      try {
        const originalFileName = path.basename(imageFile.filename);
        const safeFileName = originalFileName.replace(/\s+/g, '-');

        // 이미지 파일 복사
        const targetPath = path.join(imageOutputDir, safeFileName);
        await fs.copyFile(imageFile.sourcePath, targetPath);

        if (config.verbose) {
          console.log(`✓ ${safeFileName}`);
        }

        // PDF용: 이미지를 base64로 변환
        const imageBuffer = await fs.readFile(targetPath);
        const base64 = imageBuffer.toString('base64');

        // 파일 확장자에서 MIME 타입 결정
        const ext = path.extname(safeFileName).slice(1).toLowerCase();
        const mimeType = ext === 'jpg' ? 'jpeg' : ext;
        const dataUrl = `data:image/${mimeType};base64,${base64}`;

        // Markdown 내 경로를 처리
        const originalPath = imageFile.filename;
        const relativePath = `./${config.imageDir}/${safeFileName}`;

        const pathParts = originalPath.split('/');
        const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');

        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // PDF용 Markdown: base64 data URL 사용
        processedMarkdown = processedMarkdown
          .replace(new RegExp(`\\(${escapeRegex(originalPath)}\\)`, 'g'), `(${dataUrl})`)
          .replace(new RegExp(`\\(${escapeRegex(encodedPath)}\\)`, 'g'), `(${dataUrl})`);

      } catch (error) {
        if (config.verbose) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`✗ ${imageFile.filename}: ${errorMsg}`);
        }
      }
    }

    // 5. Markdown → PDF 변환
    const pdfSpinner = logger.spinner('Converting Markdown to PDF...');

    const filename = `${baseFilename}.pdf`;
    const pdfPath = path.join(pageDir, filename);

    try {
      await exporter.exportMarkdownToPDF(processedMarkdown, pdfPath, {
        format: 'A4',
      });
      pdfSpinner.succeed('PDF generated successfully');
    } catch (error) {
      pdfSpinner.fail('Failed to generate PDF');
      throw error;
    }

    // 6. 결과 출력
    console.log('');
    logger.success('PDF export complete!');
    console.log('');
    console.log(`📁 Folder: ${path.relative(process.cwd(), pageDir)}`);
    console.log(`📄 PDF: ${filename}`);
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
