import { input, confirm } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';
import os from 'os';
import * as logger from '../utils/logger.js';

export interface TokenConfig {
  TOKEN_V2: string;
  FILE_TOKEN: string;
  OUTPUT_DIR?: string;
}

function getConfigPath(): string {
  return path.join(os.homedir(), '.nconv', '.env');
}

function getConfigDir(): string {
  return path.join(os.homedir(), '.nconv');
}

/**
 * Load existing config from file
 */
export function loadConfig(): TokenConfig | null {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    return null;
  }

  const content = fs.readFileSync(configPath, 'utf-8');
  const config: TokenConfig = { TOKEN_V2: '', FILE_TOKEN: '' };

  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed) return;

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();

    if (key === 'TOKEN_V2') config.TOKEN_V2 = value;
    if (key === 'FILE_TOKEN') config.FILE_TOKEN = value;
    if (key === 'OUTPUT_DIR') config.OUTPUT_DIR = value;
  });

  return config;
}

/**
 * Save config to file
 */
export function saveConfig(config: TokenConfig): void {
  const configDir = getConfigDir();
  const configPath = getConfigPath();

  const envContent = `# Notion Access Tokens
# These tokens are required to fetch content from Notion.
# You can find them in your browser's cookies when logged into Notion.

TOKEN_V2=${config.TOKEN_V2}
FILE_TOKEN=${config.FILE_TOKEN}

# Default output directory (optional)
# If not set, defaults to ~/nconv-output
# You can use ~ for home directory (e.g., ~/Documents/nconv-output)
${config.OUTPUT_DIR ? `OUTPUT_DIR=${config.OUTPUT_DIR}` : '# OUTPUT_DIR=~/nconv-output'}
`;

  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(configPath, envContent);
    logger.info('✅ Configuration saved successfully.');
  } catch (error) {
    logger.error('Failed to save configuration.');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
}

/**
 * Prompt user to input tokens (for /init)
 */
export async function promptInitConfig(): Promise<TokenConfig> {
  logger.info('Please enter your Notion access tokens.');
  logger.info('You can find these in your browser cookies when logged into Notion.\n');

  const TOKEN_V2 = await input({
    message: 'TOKEN_V2:',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'TOKEN_V2 is required';
      return true;
    },
  });

  const FILE_TOKEN = await input({
    message: 'FILE_TOKEN:',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'FILE_TOKEN is required';
      return true;
    },
  });

  const OUTPUT_DIR = await input({
    message: 'OUTPUT_DIR (optional, press Enter for default ~/nconv-output):',
    default: '',
  });

  return {
    TOKEN_V2,
    FILE_TOKEN,
    ...(OUTPUT_DIR.trim() && { OUTPUT_DIR: OUTPUT_DIR.trim() }),
  };
}

/**
 * Prompt user to edit existing config (for /config)
 */
export async function promptEditConfig(existing: TokenConfig): Promise<TokenConfig> {
  logger.info('Current configuration:\n');

  const TOKEN_V2 = await input({
    message: 'TOKEN_V2:',
    default: existing.TOKEN_V2,
    required: true,
  });

  const FILE_TOKEN = await input({
    message: 'FILE_TOKEN:',
    default: existing.FILE_TOKEN,
    required: true,
  });

  const OUTPUT_DIR = await input({
    message: 'OUTPUT_DIR (optional, leave empty for default ~/nconv-output):',
    default: existing.OUTPUT_DIR || '',
  });

  return {
    TOKEN_V2,
    FILE_TOKEN,
    ...(OUTPUT_DIR.trim() && { OUTPUT_DIR: OUTPUT_DIR.trim() }),
  };
}
