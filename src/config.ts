import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// 환경 변수 로드
dotenvConfig();

export interface NotionConfig {
  tokenV2: string;
  fileToken: string;
}

export interface ConverterOptions {
  output: string;
  imageDir: string;
  filename?: string;
  verbose: boolean;
}

export interface FullConfig extends NotionConfig, ConverterOptions {}

/**
 * Notion 인증 설정 가져오기
 */
export function getNotionConfig(): NotionConfig {
  const tokenV2 = process.env.TOKEN_V2 || '';
  const fileToken = process.env.FILE_TOKEN || '';

  if (!tokenV2 || !fileToken) {
    throw new Error(
      'Notion 토큰이 설정되지 않았습니다.\n' +
      '.env 파일에 TOKEN_V2와 FILE_TOKEN을 설정해주세요.\n' +
      '자세한 내용은 .env.example을 참고하세요.'
    );
  }

  return { tokenV2, fileToken };
}

/**
 * 전체 설정 생성
 */
export function createConfig(options: ConverterOptions): FullConfig {
  const notionConfig = getNotionConfig();

  // 출력 디렉토리 절대 경로로 변환
  const outputDir = resolve(process.cwd(), options.output);

  return {
    ...notionConfig,
    ...options,
    output: outputDir,
  };
}

/**
 * 디렉토리 존재 여부 확인
 */
export function ensureDirectoryExists(dir: string): boolean {
  return existsSync(dir);
}
