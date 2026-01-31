
<p align="center">
<a href="#-nconv-cli-english">English</a> | <a href="#-nconv-cli-한국어">한국어</a>
</p>

---

<div id="-nconv-cli-english">

# 🚀 nconv-cli (Notion Converter CLI)

[![npm version](https://img.shields.io/npm/v/nconv-cli.svg)](https://www.npmjs.com/package/nconv-cli)
[![npm downloads](https://img.shields.io/npm/dt/nconv-cli.svg)](https://www.npmjs.com/package/nconv-cli)
[![license](https://img.shields.io/npm/l/nconv-cli.svg)](https://github.com/itsme-shawn/nconv-cli/blob/master/LICENSE)

> **Faster Workflow**: A CLI tool that automatically convert Notion pages into Markdown, HTML, and PDF.
> Stop wasting time unzipping files and fixing broken image paths manually.


---

## 1. Quick Start

Choose your preferred way to work: **Interactive TUI** for easy setup or **Direct CLI** for speed.

### **Option A: Interactive TUI (Recommended for First-time)**

Enter a Claude Code-style shell to manage settings and convert multiple pages easily.

```bash
# 1. Install globally
npm install -g nconv-cli

# 2. Enter Interactive Mode
nconv

# 3. Setup environment & Convert (Inside TUI)
nconv> /init           # Set your Notion tokens (Required once)
nconv> /md <URL>       # Convert Notion page to Markdown
nconv> /pdf <URL>      # Convert Notion page to PDF

```

### **Option B: Direct CLI**

Instantly convert pages with one line. Perfect for scripts and automation.

```bash
# Basic Markdown conversion
nconv md "https://notion.so/your-page-url"

nconv md "URL"

# Generate a professional GitHub-style PDF
nconv pdf "URL"

# Advanced: Save to ./blog as 'my-post.md' with images in 'assets'
nconv md "URL" -o ./blog -f my-post -i assets

# Bulk Conversion: Convert multiple links at once using a simple shell loop
urls=("URL_1" "URL_2" "URL_3")
for url in "${urls[@]}"; do nconv md "$url" -o ./dist; done

```

## 2. Configuration & Requirements

* **Public Page (Required)**: Your Notion page must be **"Published to web"** (Share -> Publish).
* **Tokens**: Run `nconv init` to set `TOKEN_V2` and `FILE_TOKEN` (found in your browser's notion.so cookies).

### How to Find Your Notion Tokens

1.  Log in to [notion.so](https://notion.so) in your browser.
2.  Open your browser's developer tools (usually F12).
3.  Go to the "Application" tab.
4.  Select `https://www.notion.so` under the "Cookies" section.
5.  Copy the value of the `token_v2` cookie and paste it into the `TOKEN_V2` field.
6.  Copy the value of the `file_token` cookie and paste it into the `FILE_TOKEN` field.

## 3. Core Features

- ⚡️ **Faster Workflow**: Creates a ready-to-publish structure with automatic image downloads and relative path conversion.
- 🎨 **Multi-format Support**:
    - **Markdown**: Optimized for static site generators (Hugo, Jekyll) and tech blogs (Velog, Tistory).
    - **HTML**: Perfect for quick web sharing and style previews.
    - **PDF**: Clean, professional archiving with GitHub-style CSS formatting.
- 🖼️ **Smart Image Handling**:
    - **Markdown/HTML**: Extracts images locally and auto-updates internal paths.
    - **PDF**: Encodes all images to **Base64** to prevent resource loss within a single file.
- ✨ **Zero Manual Work**: No more manual renaming or fixing broken image paths.
- 💬 **Interactive TUI**: Provides a **Claude Code style** slash command interface.
- 📁 **Better Organization**: Automatically creates separate folders for each document title.
## 4. Why nconv-cli?

|  | Copy & Paste | Default Export | **nconv-cli** |
| --- | --- | --- | --- |
| **Images** | ❌ Broken Links | ⚠️ Manual Cleanup | **✅ Auto Download** |
| **Paths** | ❌ Manual Fix | ⚠️ Manual Fix | **✅ Auto Fix** |
| **Speed** | ❌ Slow | ⚠️ Annoying | **🚀 Fast & Easy** |

## 5. Recommended For

- Users who write in Notion and post to **Velog, Tistory, GitHub Pages, Hugo, and more**.
- Users who have experienced broken images due to Notion's private CDN issues.
- Those migrating their Notion workspace to tools like **Obsidian, Bear, etc**.
  
## 6. Advanced TUI Usage (Interactive)

The interactive mode (`nconv`) allows for more flexible control.

* **Check Configuration & Get Help**:
  ```bash
  nconv> /config  # View current settings like TOKEN_V2.
  nconv> /help    # See all available slash commands.
  ```

* **Convert with Options**:
  In addition to basic commands, you can specify options like output directory (`-o`) and filename (`-f`).
  ```bash
  # Save Markdown to './blog' as 'my-post.md'
  nconv> /md <URL> -o ./blog -f my-post

  # Save PDF to './docs' as 'my-doc.pdf'
  nconv> /pdf <URL> -o ./docs -f my-doc
  ```

## 7. Advanced CLI Usage (Direct)

The CLI mode is powerful for scripting and automation. Combine options for fine-grained control.

### CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--output <dir>` | `-o` | Output directory | `./nconv-output` |
| `--image-dir <dir>` | `-i` | Image folder name (relative to output) | `images` |
| `--filename <name>` | `-f` | Output filename (without extension) | Extracted from URL |
| `--verbose` | `-v` | Enable verbose logging | `false` |

### CLI Combination Examples

```bash
# 1. HTML: Save to './web-dist' as 'index.html' with images in 'img'
nconv html "URL" -o ./web-dist -f index -i img

# 2. PDF: Save to './documents' as 'report.pdf' and enable verbose logs
nconv pdf "URL" -o ./documents -f report -v

# 3. Markdown (All Options): Save to './blog' as 'post-1.md' with images in 'assets'
nconv md "URL" -o ./blog -i assets -f "post-1" -v
```

## 8. For Developers

### **Project Structure**

```text
src/
├── core/      # Notion export & Image logic
├── commands/  # CLI command definitions
├── repl/      # Interactive TUI mode
└── utils/     # File & Logger helpers

```

### **Contribution**

```bash
git clone https://github.com/itsme-shawn/nconv-cli.git
npm install
npm link
npm run dev

```

</div>

---

<br>
<p align="center">
<a href="#-nconv-cli-english">English</a> | <a href="#-nconv-cli-한국어">한국어</a>
</p>

---

<div id="-nconv-cli-한국어">

# 🚀 nconv-cli (Notion Converter CLI)

[![npm version](https://img.shields.io/npm/v/nconv-cli.svg)](https://www.npmjs.com/package/nconv-cli)
[![npm downloads](https://img.shields.io/npm/dt/nconv-cli.svg)](https://www.npmjs.com/package/nconv-cli)
[![license](https://img.shields.io/npm/l/nconv-cli.svg)](https://github.com/itsme-shawn/nconv-cli/blob/master/LICENSE)

> CLI 도구로 노션 페이지를  Markdown, HTML, PDF로 자동 변환합니다.
> 수동으로 압축을 풀거나 깨진 이미지 경로를 수정하는 시간을 단축해줍니다.

---

## 1. 빠른 시작 (Quick Start)

쉬운 설정을 위한 **대화형 TUI** 또는 빠른 작업을 위한 **CLI 직접 명령** 중 하나를 선택하세요.

### **Option A: 대화형 TUI (처음 사용자 권장)**

설정을 관리하고 여러 페이지를 쉽게 변환할 수 있는 Claude Code 스타일의 쉘에 진입합니다.

```bash
# 1. 전역 설치
npm install -g nconv-cli

# 2. 대화형 모드 진입
nconv

# 3. 환경 설정 및 변환 (TUI 내부)
nconv> /init           # 노션 토큰 설정 (최초 1회 필수)
nconv> /md <URL>       # 노션 페이지를 마크다운으로 변환
nconv> /pdf <URL>      # 노션 페이지를 PDF로 변환

```

### **Option B: CLI 직접 명령**

스크립트 작성이나 자동화에 최적화되어 있습니다.

```bash
# 기본 마크다운 변환
nconv md "https://notion.so/페이지-URL"

# 마크다운 변환 실행
nconv md "URL"

# GitHub 스타일의 깔끔한 PDF 생성
nconv pdf "URL"

# 고급설정: ./blog 폴더에 'my-post.md'로 저장하고 이미지는 'assets'에 수집
nconv md "URL" -o ./blog -f my-post -i assets

# 벌크 처리: 여러 링크를 한 번에 처리 (쉘 루프 활용)
urls=("URL_1" "URL_2" "URL_3")
for url in "${urls[@]}"; do nconv md "$url" -o ./dist; done

```

## 2. 설정 및 주의사항

* **공개 페이지 설정 (필수)**: 변환하려는 노션 페이지는 반드시 **"웹에 게시"** 상태여야 합니다 (공유 -> 게시).
* **토큰 설정**: `nconv init`을 실행하여 `TOKEN_V2`와 `FILE_TOKEN`을 설정하세요 (브라우저의 notion.so 쿠키에서 확인 가능).

### Notion 토큰 값 확인하는 방법

1. 브라우저에서 [notion.so](https://notion.so)에 로그인합니다.
2. 브라우저 개발자 도구(보통 F12)를 엽니다.
3. "Application" 탭으로 이동합니다.
4. "Cookies" 섹션에서 `https://www.notion.so`를 선택합니다.
5. `token_v2` 쿠키 값을 복사하여 `TOKEN_V2` 필드에 붙여넣습니다.
6. `file_token` 쿠키 값을 복사하여 `FILE_TOKEN` 필드에 붙여넣습니다.

## 3. 주요 특징

* ⚡️ **워크플로우 단축**: 이미지 자동 다운로드 및 상대 경로 변환을 통해 즉시 게시 가능한 구조를 생성합니다.
* 🎨 **멀티 포맷 지원**:
  * **Markdown**: 정적 사이트 생성기(Hugo, Jekyll) 및 기술 블로그(Velog, Tistory) 최적화.
  * **HTML**: 빠른 웹 공유 및 스타일 확인용.
  * **PDF**: GitHub 스타일 CSS가 적용된 깔끔한 배포/아카이빙용 문서.

* 🖼️ **이미지 추출 자동화**:
  * **Markdown/HTML**: 이미지를 로컬로 추출하고 문서 내 경로를 자동 업데이트합니다.
  * **PDF**: 모든 이미지를 **Base64**로 인코딩하여 단일 파일 내에 포함합니다 (리소스 유실 방지).
* ✨ **수동 작업 최소화**: 파일명 변경이나 깨진 이미지 경로 수정 등 반복적인 작업이 필요 없습니다.
* 💬 **인터랙티브 TUI**: **Claude Code 스타일**의 슬래시 커맨드 인터페이스를 제공합니다.
* 📁 **체계적 관리**: 문서 제목별로 독립된 폴더 구조를 자동으로 생성합니다.

## 4. Why nconv-cli?

| 비교 항목 | 단순 복사 & 붙여넣기 | 노션 기본 내보내기 | **nconv-cli** |
| --- | --- | --- | --- |
| **이미지 관리** | ❌ 링크 깨짐 발생 | ⚠️ 수동 정리 필요 | **✅ 로컬 자동 추출** |
| **경로 설정** | ❌ 수동 수정 필요 | ⚠️ 수동 재설정 필요 | **✅ 경로 자동 최적화** |
| **작업 속도** | ❌ 매우 느림 | ⚠️ 번거로운 프로세스 | **🚀 매우 빠르고 간편** |

## 5. 이런 분들에게 추천합니다

* 노션으로 글을 쓰고 **Velog, Tistory, GitHub Pages, Hugo 등**에 포스팅하는 개발자.
* 노션 전용 이미지 CDN 문제로 블로그 이미지가 깨져본 경험이 있는 분.
* 노션 문서 체계를 **Obsidian, Bear 등**의 도구로 마이그레이션하려는 분.

## 6. TUI 고급 사용법 (대화형)

`nconv`를 실행하면 나오는 대화형 모드에서는 더 많은 옵션을 활용할 수 있습니다.

* **설정 확인 및 도움말 보기**:
  ```bash
  nconv> /config  # 현재 TOKEN_V2 등 설정 값을 확인합니다.
  nconv> /help    # 사용 가능한 모든 명령어를 봅니다.
  ```

* **옵션을 포함한 변환**:
  Quick Start에서 소개된 기본 변환 외에도, 출력 경로(`-o`), 파일명(`-f`) 등을 자유롭게 지정할 수 있습니다.
  ```bash
  # 마크다운을 'blog' 폴더에 'my-post.md'로 저장
  nconv> /md <URL> -o ./blog -f my-post

  # PDF를 'docs' 폴더에 'my-doc.pdf'로 저장
  nconv> /pdf <URL> -o ./docs -f my-doc
  ```

## 7. CLI 고급 사용법 (직접 명령)

### CLI 옵션

| 옵션 | 단축 | 설명 | 기본값 |
|---|---|---|---|
| `--output <dir>` | `-o` | 결과물이 저장될 폴더 | `./nconv-output` |
| `--image-dir <dir>` | `-i` | 이미지가 저장될 폴더 (output 폴더 기준 상대 경로) | `images` |
| `--filename <name>` | `-f` | 확장자를 제외한 파일명 | 페이지 URL에서 추출 |
| `--verbose` | `-v` | 상세 로그를 출력 | `false` |

### CLI 조합 예시

```bash
# 1. HTML 변환: 'web-dist' 폴더에 'index.html'로 저장하고 이미지 폴더는 'img'로 지정
nconv html "URL" -o ./web-dist -f index -i img

# 2. PDF 변환: 'documents' 폴더에 'report.pdf'로 저장하고 상세 로그 출력
nconv pdf "URL" -o ./documents -f report -v

# 3. 마크다운 변환: 모든 옵션 조합
# './blog' 폴더 아래 'assets'에 이미지를 저장하고 'post-1.md'로 결과물 생성
nconv md "URL" -o ./blog -i assets -f "post-1" -v
```

## 8. 개발자를 위한 안내

### **프로젝트 구조**

```text
src/
├── core/      # 노션 내보내기 및 이미지 처리 핵심 로직
├── commands/  # CLI 명령어 정의 (init, md, html 등)
├── repl/      # 인터랙티브 TUI 모드 구현부
└── utils/     # 파일 시스템 및 로거 유틸리티

```

### **기여 방법**

```bash
git clone https://github.com/itsme-shawn/nconv-cli.git
npm install
npm link
npm run dev

```

</div>


