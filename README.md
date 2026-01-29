<p align="right">
  <a href="./README.en.md">English</a>
</p>

# nconv-cli (Notion Convertor CLI)

> Notion 글을 블로그에 바로 올릴 수 있는 마크다운으로 변환하는 CLI  
> (이미지 자동 추출 및 경로 정리 포함)

Notion 퍼블릭 페이지를 마크다운으로 변환하고  
이미지 파일을 로컬로 추출해 블로그 친화적인 구조로 정리해주는 CLI 도구입니다.

## 특징

- 🚀 Notion 퍼블릭 페이지를 블로그용 마크다운으로 바로 변환
- 🖼️ 이미지 파일을 로컬로 자동 다운로드 및 상대경로로 변환
- 📁 게시글 단위로 정리된 출력 디렉토리 구조
- 🎨 간단한 CLI 인터페이스



## 기존 Notion -> Markdown 변환의 문제점

Notion에서 작성한 글을 블로그에 옮길 때,
단순한 복사/붙여넣기나 기본 Markdown export는 포스팅에 불편함이 있습니다.

* 복사 & 붙여넣기 방식의 문제점
  * 마크다운 식으로 텍스트는 변환되지만,
  * 이미지는 Notion CDN URL로 유지되며
  * Access Denied 로 이미지 접근이 깨지는 경우가 많습니다

* Notion Markdown Export 방식의 문제점
  * 직접 다운받아서 수동으로 저장 후 압축을 해제해야하며,
  * 게시글 단위로 정리하기 어렵습니다

결과적으로 블로그에 게시하려면 이미지 개별 다운로드,
파일명 및 경로 수정, 폴더 구조 재정리가 필요합니다.

| 방식 | 이미지 관리 | 블로그 사용성 |
|------|------------|---------------|
| 복사 & 붙여넣기 | ❌ Notion CDN 의존 | ❌ 이미지 깨짐 |
| Notion Export | ⚠️ 수동 정리 필요 | ⚠️ 번거로움 |
| **nconv-cli** | ✅ 로컬 자동 추출 | ✅ 즉시 사용 가능 |

## 이런 분들에게 추천합니다

- Notion으로 글을 쓰고, Velog / Tistory / GitHub Pages / Hugo 등의 플랫폼에 마크다운으로 포스팅을 하시는 분
- Notion 이미지 CDN 문제로 글이 깨져본 경험이 있는 분
- 노션 문서 체계를 옵시디언 등으로 마이그레이션하기 원하시는 분


## 환경
- **Node.js**: v20 이상 (npm v10 이상)
- **TypeScript**: v5 이상

## 설치

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 로컬에 CLI 설치
npm link
```

## 설정

`.env` 파일에 Notion 인증 토큰을 설정해야 합니다.

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일을 열고 아래 값들을 설정하세요:

```
TOKEN_V2=your_token_v2_here
FILE_TOKEN=your_file_token_here
```

### Notion env 값 확인하는 방법

1. [notion.so](https://notion.so)에 로그인
2. 브라우저 개발자 도구 열기 (F12)
3. Application > Cookies > notion.so
4. `token_v2` 값 복사 → `.env`의 `TOKEN_V2`에 붙여넣기
5. `file_token` 값 복사 → `.env`의 `FILE_TOKEN`에 붙여넣기

## 사용법

### 기본 사용법

```bash
nconv md <notion-url>
```

### 예시

```bash
# 기본 사용 (./output 폴더에 저장)
nconv md "https://notion.so/My-Page-abc123"

# 출력 디렉토리 지정
nconv md "https://notion.so/My-Page-abc123" -o ./blog-posts

# 커스텀 파일명
nconv md "https://notion.so/My-Page-abc123" -f "my-article"

# 상세 로그 출력
nconv md "https://notion.so/My-Page-abc123" -v

# 모든 옵션 사용
nconv md "https://notion.so/My-Page-abc123" -o ./blog -i assets -f "article-1" -v
```

## 옵션

| 옵션 | 단축 | 설명 | 기본값 |
|------|------|------|--------|
| `--output <dir>` | `-o` | 출력 디렉토리 | `./output` |
| `--image-dir <dir>` | `-i` | 이미지 폴더명 (output 기준 상대경로) | `images` |
| `--filename <name>` | `-f` | 출력 파일명 (확장자 제외 또는 포함) | URL에서 자동 추출 |
| `--verbose` | `-v` | 상세 로그 출력 | `false` |

## 출력 구조

```
output/
├── my-article-folder/
    ├── my-article.md          # 마크다운 파일
    └── images/
        ├── abc12345.png       # 다운로드된 이미지들
        ├── def67890.jpg
        └── ...
```

마크다운 파일 내 이미지 경로는 상대경로로 변환됩니다:

```markdown
![image](./images/abc12345.png)
```

## 라이브러리
### 주요 라이브러리
- **notion-exporter**: Notion 페이지를 마크다운으로 내보내는 라이브러리
- **commander**: CLI 명령 정의 및 파싱 도구
- **axios**: HTTP 클라이언트 (이미지 다운로드 등)
- **dotenv**: 환경 변수 관리
- **chalk**: 터미널 출력 색상화
- **ora**: 터미널 스피너 (진행 상황 표시)
- **slugify**: 문자열을 URL 슬러그로 변환
- **uuid**: 고유 ID 생성

### 오픈소스 라이선스
- **nconv-cli**: [ISC License](LICENSE)
- 본 프로젝트는 위에 명시된 주요 라이브러리 외에도 다수의 오픈소스 라이브러리를 사용하며, 각 라이브러리는 해당 라이선스 정책을 따릅니다.

## 개발

```bash
# 개발 모드 (파일 변경 감지)
npm run dev

# 빌드
npm run build

# 로컬 테스트
npm link
nconv md "https://notion.so/test-page"
```

## 프로젝트 구조

```
nconv/
├── src/
│   ├── index.ts              # CLI 진입점
│   ├── config.ts             # 설정 관리
│   ├── commands/
│   │   └── md.ts             # md 명령어
│   ├── core/
│   │   ├── exporter.ts       # Notion 내보내기
│   │   └── image-processor.ts # 이미지 처리
│   └── utils/
│       ├── file.ts           # 파일 유틸리티
│       └── logger.ts         # 로깅
├── bin/
│   └── nconv.js   # 실행 파일
├── package.json
├── tsconfig.json
└── tsup.config.ts
```
