
import type { Arguments, CommandBuilder } from 'yargs';
import fs from 'fs';
import path from 'path';
import os from 'os';
import * as logger from '../utils/logger.js';

type Options = {
  // No options yet
};

export const command: string = 'init';
export const desc: string = 'Create a default .env configuration file in your home directory.';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .example([
      ['$0 init', 'Create the default configuration file.'],
    ]);

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const configDir = path.join(os.homedir(), '.nconv');
  const configFile = path.join(configDir, '.env');

  logger.info(`Checking for config file at: ${configFile}`);

  if (fs.existsSync(configFile)) {
    logger.warn('Configuration file already exists.');
    logger.warn(`If you want to re-initialize, please delete the file first: ${configFile}`);
    return;
  }

  const envContent = `
# Please provide your Notion access tokens.
# These are required to fetch content from your Notion pages.
# You can find these tokens in your browser's cookies when you are logged into Notion.
TOKEN_V2=
FILE_TOKEN=
`.trim();

  try {
    logger.info(`Creating directory at: ${configDir}`);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(configFile, envContent);
    logger.info('✅ Successfully created configuration file.');
    logger.info(`Please edit the file to set your environment variables: ${configFile}`);
  } catch (error) {
    logger.error('Failed to create configuration file.');
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};
