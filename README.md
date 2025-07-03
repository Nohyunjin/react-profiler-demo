# RAG AI 어시스턴트

실시간 검색(Travily)과 AI(OpenAI)가 결합된 지능형 어시스턴트입니다.

## 주요 기능

- **실시간 웹 검색**: Travily API를 통한 최신 정보 검색
- **RAG (Retrieval-Augmented Generation)**: 검색 결과를 바탕으로 한 정확한 AI 답변
- **채팅 인터페이스**: 사용자 친화적인 채팅 UI
- **세션 관리**: 왼쪽 사이드바에서 채팅 이력 관리
- **검색 결과 표시**: 오른쪽 패널에서 검색 결과 실시간 확인

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
# Travily API Key
# https://app.tavily.com/ 에서 API 키를 발급받으세요
TRAVILY_API_KEY=your_travily_api_key_here

# OpenAI API Key
# https://platform.openai.com/api-keys 에서 API 키를 발급받으세요
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 사용 방법

1. **새 대화 시작**: 왼쪽 사이드바의 "새 대화" 버튼을 클릭
2. **질문 입력**: 하단의 텍스트 영역에 질문을 입력
3. **검색 및 답변**: AI가 자동으로 웹 검색을 수행하고 검색 결과를 바탕으로 답변 생성
4. **검색 결과 확인**: 오른쪽 패널에서 참고된 검색 결과 확인 가능
5. **이전 대화 이어가기**: 왼쪽 사이드바에서 이전 대화 세션 선택

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Lucide React (아이콘)
- **API**:
  - Travily API (웹 검색)
  - OpenAI API (언어 모델)
- **HTTP Client**: Axios

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── llm/route.ts          # OpenAI API 라우트
│   │   └── travily/route.ts      # Travily 검색 API 라우트
│   ├── page.tsx                  # 메인 페이지
│   └── layout.tsx                # 레이아웃
├── component/
│   ├── ChatInterface.tsx         # 메인 채팅 인터페이스
│   ├── ChatSidebar.tsx          # 채팅 세션 사이드바
│   ├── ChatMessage.tsx          # 개별 채팅 메시지
│   ├── ChatInput.tsx            # 채팅 입력 컴포넌트
│   └── SearchResults.tsx        # 검색 결과 표시
├── hooks/
│   └── useChat.ts               # 채팅 관리 훅
└── lib/
    └── types.ts                 # TypeScript 타입 정의
```

## API 엔드포인트

### POST /api/travily

웹 검색을 수행합니다.

**요청 바디:**

```json
{
  "query": "검색할 내용"
}
```

**응답:**

```json
{
  "query": "검색할 내용",
  "results": [
    {
      "title": "검색 결과 제목",
      "url": "https://example.com",
      "content": "검색 결과 내용",
      "score": 0.95
    }
  ]
}
```

### POST /api/llm

검색 결과를 바탕으로 AI 답변을 생성합니다.

**요청 바디:**

```json
{
  "message": "사용자 질문",
  "searchResults": [...]
}
```

**응답:**

```json
{
  "content": "AI 답변 내용",
  "sources": [...]
}
```

## 라이선스

MIT License
