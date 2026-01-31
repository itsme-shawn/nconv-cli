import { NotionExporter } from 'notion-exporter';
import { promises as fs } from 'fs';
import path from 'path';
import { mdToPdf } from 'md-to-pdf';
import type { NotionConfig } from '../config.js';

export interface ExportResult {
  markdown: string;
  imageFiles: Array<{ filename: string; sourcePath: string }>;
}

export interface HTMLExportResult {
  html: string;
  imageFiles: Array<{ filename: string; sourcePath: string }>;
}

export interface PDFExportResult {
  pdfPath: string;
  filename: string;
}

export interface MarkdownPDFOptions {
  format?: 'A4' | 'Letter';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  stylesheet?: string | string[];
}

/**
 * Notion 페이지를 마크다운으로 내보내기
 */
export class NotionMarkdownExporter {
  private exporter: NotionExporter;

  constructor(config: NotionConfig, exportType: 'markdown' | 'html' | 'pdf' = 'markdown') {
    this.exporter = new NotionExporter(config.tokenV2, config.fileToken, {
      exportType,
    });
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
        throw new Error('Markdown file not found.');
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
        throw new Error(`Failed to fetch Notion page: ${error.message}`);
      }
      throw new Error('Failed to fetch Notion page.');
    }
  }

  /**
   * Notion URL에서 HTML과 이미지 파일 가져오기
   */
  async exportHTML(notionUrl: string, tempDir: string): Promise<HTMLExportResult> {
    try {
      // 임시 디렉토리 생성
      await fs.mkdir(tempDir, { recursive: true });

      // getMdFiles로 HTML과 이미지를 함께 다운로드
      await this.exporter.getMdFiles(notionUrl, tempDir);

      // 다운로드된 파일 목록 가져오기
      const files = await fs.readdir(tempDir, { withFileTypes: true });

      // HTML 파일 찾기
      const htmlFile = files.find(f => f.isFile() && f.name.endsWith('.html'));
      if (!htmlFile) {
        throw new Error('HTML file not found.');
      }

      // HTML 내용 읽기
      const htmlPath = path.join(tempDir, htmlFile.name);
      const html = await fs.readFile(htmlPath, 'utf-8');

      // 이미지 파일 목록 (HTML이 아닌 파일들)
      const imageFiles = files
        .filter(f => f.isFile() && !f.name.endsWith('.html'))
        .map(f => ({
          filename: f.name,
          sourcePath: path.join(tempDir, f.name),
        }));

      // 디렉토리 내 폴더도 확인 (Notion이 폴더 구조로 저장할 수 있음)
      const dirs = files.filter(f => f.isDirectory());
      for (const dir of dirs) {
        const subFiles = await fs.readdir(path.join(tempDir, dir.name), { withFileTypes: true });
        for (const subFile of subFiles) {
          if (subFile.isFile() && !subFile.name.endsWith('.html')) {
            imageFiles.push({
              filename: path.join(dir.name, subFile.name),
              sourcePath: path.join(tempDir, dir.name, subFile.name),
            });
          }
        }
      }

      return { html, imageFiles };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch Notion page as HTML: ${error.message}`);
      }
      throw new Error('Failed to fetch Notion page as HTML.');
    }
  }

  /**
   * Markdown을 PDF로 변환 (md-to-pdf 사용)
   * GitHub 스타일의 깔끔한 PDF 생성
   */
  async exportMarkdownToPDF(
    markdownContent: string,
    outputPath: string,
    options: MarkdownPDFOptions = {}
  ): Promise<void> {
    try {
      const pdfOptions = {
        content: markdownContent,
        stylesheet: options.stylesheet || [
          'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css',
        ],
        body_class: 'markdown-body',
        css: `
          .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
          }

          @media (max-width: 767px) {
            .markdown-body {
              padding: 15px;
            }
          }

          /* 코드 블록 스타일 개선 */
          .markdown-body pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
          }

          .markdown-body code {
            background-color: rgba(175, 184, 193, 0.2);
            border-radius: 6px;
            padding: 0.2em 0.4em;
          }

          /* 이미지 스타일 */
          .markdown-body img {
            max-width: 100%;
            height: auto;
          }
        `,
        pdf_options: {
          format: options.format || 'A4',
          margin: options.margin || {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm',
          },
          printBackground: true,
        },
      };

      const result = await mdToPdf(pdfOptions);

      if (result.content) {
        await fs.writeFile(outputPath, result.content);
      } else {
        throw new Error('PDF content is empty');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to convert Markdown to PDF: ${error.message}`);
      }
      throw new Error('Failed to convert Markdown to PDF.');
    }
  }
}
