import { promises as fs } from 'fs';
import path from 'path';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Notion URL에서 페이지 제목 추출 (간단한 버전)
 */
export function extractTitleFromUrl(notionUrl: string): string | null {
  try {
    const url = new URL(notionUrl);
    const pathname = url.pathname;

    // /Page-Title-abc123 형식에서 제목 부분 추출
    const match = pathname.match(/\/([^/]+)-[a-f0-9]{32}$/i);
    if (match) {
      const title = match[1].replace(/-/g, ' ');
      return title;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 안전한 파일명 생성
 */
export function generateSafeFilename(title: string | null, extension: string = 'md'): string {
  if (title) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'ko',
    });

    if (slug.length > 0) {
      return extension ? `${slug}.${extension}` : slug;
    }
  }

  // 제목이 없거나 slugify 실패 시 UUID 사용
  const hash = uuidv4().slice(0, 8);
  return extension ? `notion-export-${hash}.${extension}` : `notion-export-${hash}`;
}

/**
 * 마크다운 파일 저장
 */
export async function saveMarkdownFile(
  outputDir: string,
  filename: string,
  content: string
): Promise<string> {
  await fs.mkdir(outputDir, { recursive: true });

  const filePath = path.join(outputDir, filename);
  await fs.writeFile(filePath, content, 'utf-8');

  return filePath;
}

/**
 * 파일 경로를 상대 경로로 변환
 */
export function toRelativePath(from: string, to: string): string {
  return path.relative(from, to);
}
