<p align="right">
  <a href="./README.md">한국어</a>
</p>

# nconv-cli (Notion Convertor CLI)

> A CLI tool that converts Notion pages into blog-ready Markdown  
> (with automatic image extraction and path normalization)

nconv-cli converts public Notion pages into Markdown  
and extracts images into local files, organizing everything  
in a blog-friendly directory structure.

## Features

- 🚀 Convert public Notion pages into blog-ready Markdown
- 🖼️ Automatically download images and rewrite them as relative paths
- 📁 Output organized by post-level directory structure
- 🎨 Simple and intuitive CLI interface

## Problems with Existing Notion → Markdown Workflows

When moving content written in Notion to a blog,  
simple copy & paste or the built-in Markdown export often causes issues.

- **Copy & Paste**
  - Text is converted into Markdown-like syntax
  - Images remain linked to Notion CDN URLs
  - Image access frequently breaks with `Access Denied` errors

- **Notion Markdown Export**
  - Requires manual download and extraction of exported files
  - Difficult to organize content by individual posts

As a result, publishing to a blog usually involves  
manually downloading images, renaming files, fixing paths,  
and reorganizing directory structures.

| Method | Image Handling | Blog Usability |
|------|---------------|----------------|
| Copy & Paste | ❌ Dependent on Notion CDN | ❌ Broken images |
| Notion Export | ⚠️ Manual organization required | ⚠️ Inconvenient |
| **nconv-cli** | ✅ Local image extraction | ✅ Ready to publish |

## Recommended For

- Developers who write in Notion and publish Markdown posts to  
  Velog, Tistory, GitHub Pages, Hugo, or similar platforms
- Anyone who has experienced broken images due to Notion CDN issues
- Users looking to migrate Notion content into tools like Obsidian

## Environment

- **Node.js**: v20 or higher (npm v10 or higher)
- **TypeScript**: v5 or higher

## Installation

```bash
# Install dependencies
npm install

# Build
npm run build

# Install CLI locally
npm link
````

## Configuration

Set your Notion authentication tokens in the `.env` file.

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` and set the following values:

```
TOKEN_V2=your_token_v2_here
FILE_TOKEN=your_file_token_here
```

### How to Find Notion Tokens

1. Log in to [notion.so](https://notion.so)
2. Open browser developer tools (F12)
3. Application > Cookies > notion.so
4. Copy `token_v2` → paste into `.env` as `TOKEN_V2`
5. Copy `file_token` → paste into `.env` as `FILE_TOKEN`

## Usage

### Basic Usage

```bash
nconv md <notion-url>
```

### Examples

```bash
# Default output (saved to ./output)
nconv md "https://notion.so/My-Page-abc123"

# Specify output directory
nconv md "https://notion.so/My-Page-abc123" -o ./blog-posts

# Custom filename
nconv md "https://notion.so/My-Page-abc123" -f "my-article"

# Verbose logging
nconv md "https://notion.so/My-Page-abc123" -v

# All options
nconv md "https://notion.so/My-Page-abc123" -o ./blog -i assets -f "article-1" -v
```

## Options

| Option              | Short | Description                                 | Default            |
| ------------------- | ----- | ------------------------------------------- | ------------------ |
| `--output <dir>`    | `-o`  | Output directory                            | `./output`         |
| `--image-dir <dir>` | `-i`  | Image directory (relative to output)        | `images`           |
| `--filename <name>` | `-f`  | Output filename (with or without extension) | Extracted from URL |
| `--verbose`         | `-v`  | Enable verbose logging                      | `false`            |

## Output Structure

```text
output/
├── my-article-folder/
│   ├── my-article.md
│   └── images/
│       ├── abc12345.png
│       ├── def67890.jpg
│       └── ...
```

Image paths inside the Markdown file are converted to relative paths:

```md
![image](./images/abc12345.png)
```

## Libraries

### Main Libraries

* **notion-exporter**: Export Notion pages to Markdown
* **commander**: CLI command definition and parsing
* **axios**: HTTP client (image downloads)
* **dotenv**: Environment variable management
* **chalk**: Terminal output styling
* **ora**: Terminal spinner for progress display
* **slugify**: Convert strings to URL-friendly slugs
* **uuid**: Generate unique IDs

### Open Source Licenses

* **nconv-cli**: [ISC License](LICENSE)
* This project uses multiple open source libraries,
  each distributed under its respective license.

## Development

```bash
# Development mode (watch files)
npm run dev

# Build
npm run build

# Local testing
npm link
nconv md "https://notion.so/test-page"
```

## Project Structure

```text
nconv/
├── src/
│   ├── index.ts
│   ├── config.ts
│   ├── commands/
│   │   └── md.ts
│   ├── core/
│   │   ├── exporter.ts
│   │   └── image-processor.ts
│   └── utils/
│       ├── file.ts
│       └── logger.ts
├── bin/
│   └── nconv.js
├── package.json
├── tsconfig.json
└── tsup.config.ts
