import { config as dotenvConfig } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { resolve, join } from 'path';
import os from 'os';
import * as logger from './utils/logger.js';

// Disable dotenv default logging
process.env.DOTENV_CONFIG_SILENT = 'true';

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

function getConfigPath(): string {
  return join(os.homedir(), '.nconv', '.env');
}

/**
 * Loads environment variables from the global config file.
 */
function loadEnv() {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    return;
  }

  try {
    // Manually parse .env file to avoid dotenv logging
    const content = readFileSync(configPath, 'utf-8');
    let loadedCount = 0;

    content.split('\n').forEach((line) => {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) {
        return;
      }

      // Parse key=value
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex === -1) {
        return;
      }

      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();

      if (key && value) {
        process.env[key] = value;
        loadedCount++;
      }
    });

    if (process.env.NCONV_VERBOSE) {
      logger.info(`✓ Loaded ${loadedCount} environment variable(s) from ${configPath}`);
    }
  } catch (error) {
    logger.error(`Failed to load configuration from: ${configPath}`);
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
}

/**
 * Checks if the required environment variables are set.
 * Exits the process if tokens are missing (for CLI commands).
 */
function checkEnv() {
  const configPath = getConfigPath();
  if (!process.env.TOKEN_V2 || !process.env.FILE_TOKEN) {
    logger.error('Notion tokens are not set.');
    if (!existsSync(configPath)) {
      logger.error('Configuration file not found.');
      logger.error('Please run "nconv init" to create a configuration file.');
    } else {
      logger.error(`Please set TOKEN_V2 and FILE_TOKEN in: ${configPath}`);
    }
    process.exit(1);
  }
}

/**
 * Validates if the required environment variables are set.
 * Returns true if valid, false otherwise (for REPL mode).
 */
export function validateConfig(): { valid: boolean; message?: string } {
  loadEnv();
  const configPath = getConfigPath();

  if (!process.env.TOKEN_V2 || !process.env.FILE_TOKEN) {
    if (!existsSync(configPath)) {
      return {
        valid: false,
        message: 'Configuration file not found. Please run /init to set up your Notion tokens.',
      };
    } else {
      return {
        valid: false,
        message: `Notion tokens are not set. Please run /init or /config to set up your tokens.\nConfig file: ${configPath}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Notion 인증 설정 가져오기
 */
export function getNotionConfig(): NotionConfig {
  const tokenV2 = process.env.TOKEN_V2 || '';
  const fileToken = process.env.FILE_TOKEN || '';
  return { tokenV2, fileToken };
}

/**
 * 전체 설정 생성
 */
export function createConfig(options: ConverterOptions): FullConfig {
  loadEnv();
  checkEnv();

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
