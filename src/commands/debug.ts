import { ConverterOptions, createConfig } from '../config.js';
import { NotionMarkdownExporter } from '../core/exporter.js';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

/**
 * Debugging command - output raw markdown
 */
export async function debugCommand(notionUrl: string, options: ConverterOptions) {
  let tempDir: string | undefined;
  try {
    const config = createConfig(options);

    const exporter = new NotionMarkdownExporter({
      tokenV2: config.tokenV2,
      fileToken: config.fileToken,
    });

    tempDir = path.join(os.tmpdir(), `notion-debug-${Date.now()}`); // Create temporary directory

    console.log('Fetching Notion page...\n');
    const { markdown, imageFiles } = await exporter.exportWithImages(notionUrl, tempDir);

    console.log('=== Raw Markdown ===\n');
    console.log(markdown.slice(0, 3000));
    console.log('\n... (truncated) ...\n');

    console.log(`\n=== Found Images (${imageFiles.length}) ===\n`);
    imageFiles.forEach((file, i) => {
      console.log(`${i + 1}. ${file.filename} (원본 경로: ${file.sourcePath})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (tempDir) {
      // Clean up temporary directory
      await fs.rm(tempDir, { recursive: true, force: true }).catch(err => {
        console.warn(`Error cleaning up temporary directory: ${err.message}`);
      });
    }
  }
}