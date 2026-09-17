# MLOA Raid Manager

로스트아크 캐릭터, 공격대 그룹, 개인 일정과 공격대 일정을 한곳에서 관리하기 위한 풀스택 프로토타입입니다. Next.js 프런트엔드와 NestJS·Prisma 백엔드를 분리해 구성했으며, 현재는 핵심 도메인 API와 주요 화면을 구현하고 실제 사용자 흐름을 연결하는 단계입니다.

> **개발 상태**: 작업 중인 저장소입니다. 인증과 AI 매니저는 아직 완성된 기능이 아니며, 일정 화면의 초기 데이터 로딩 등 일부 프런트엔드 연동도 비활성화되어 있습니다.

## 현재 구현된 범위

### 프런트엔드

- 로그인·회원가입, 프로필, 캐릭터, 공격대 상세 화면 골격
- `react-big-calendar` 기반 개인/공격대 일정 UI와 생성·수정·삭제 요청 코드
- 다크 모드 및 공통 UI 컴포넌트
- Axios API 클라이언트와 SWR 의존성

### 백엔드

- 사용자 CRUD 및 사용자별 공격대·일정 조회
- 캐릭터 CRUD, 대표 캐릭터, 캐릭터 정보 동기화 엔드포인트
- 공격대 생성·수정·삭제, 가입·탈퇴, 리더 변경
- 개인 일정 및 공격대 일정 CRUD와 다가오는 일정 조회
- Lost Ark API 프록시 엔드포인트
- Prisma/PostgreSQL 데이터 모델과 seed 스크립트
- Swagger 설정과 단위·E2E 테스트 기반

## 아직 연결되지 않은 부분

- JWT 패키지와 가드는 포함되어 있지만 인증 모듈과 실제 로그인 토큰 흐름은 완성되지 않았습니다.
- 프런트엔드 API 클라이언트는 임시 토큰을 사용합니다.
- 일정 화면의 최초 데이터 조회 코드는 주석 처리되어 있으며, 일부 요청 경로는 백엔드 컨트롤러와 추가 정합성 작업이 필요합니다.
- AI 채팅 로그 모델은 존재하지만 AI 채팅/일정 추천 API와 UI는 구현되어 있지 않습니다.
- 프로덕션 배포와 CI/CD는 구성되어 있지 않습니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, Radix UI, SWR, Axios, React Big Calendar |
| Backend | NestJS 10, Prisma 6, PostgreSQL, Passport/JWT, Swagger |
| Test | Jest, Supertest |
| Local infrastructure | Docker Compose, PostgreSQL 14 |

## 프로젝트 구조

```text
MLOA_RAID_MANAGER/
├─ frontend/       # Next.js 애플리케이션
├─ backend/        # NestJS API와 Prisma 스키마
├─ prisma/         # 초기 설계 스키마
├─ docs/           # API 설계 문서
└─ docker-compose.yml
```

실행 시에는 백엔드가 사용하는 `backend/prisma/schema.prisma`를 기준으로 마이그레이션합니다.

## 로컬 실행

요구 사항: Node.js 20 이상, npm, Docker

```bash
git clone https://github.com/ipjaworld/MLOA_RAID_MANAGER.git
cd MLOA_RAID_MANAGER
docker compose up -d
```

백엔드 환경 파일을 만듭니다.

```bash
cd backend
npm install
cp .env.example .env
```

기본 Docker Compose 설정을 사용할 경우 `backend/.env`의 데이터베이스 주소는 다음과 같이 맞춥니다.

```dotenv
DATABASE_URL="postgresql://postgres:password@localhost:5432/mloa_raid_manager?schema=public"
JWT_SECRET="replace-with-a-local-secret"
```

이어서 Prisma와 API 서버를 준비합니다.

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
npm run start:dev
```

다른 터미널에서 프런트엔드를 실행합니다.

```bash
cd frontend
npm install
```

`frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000
```

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

Windows PowerShell에서는 `cp` 대신 `Copy-Item`을 사용하세요.

## 검증

```bash
cd backend
npm run build
npm test

cd ../frontend
npm run build
```

## 다음 작업 우선순위

1. 인증 모듈과 실제 JWT 로그인 흐름 완성
2. 프런트엔드 요청 URL·DTO와 백엔드 컨트롤러 정합화
3. 일정 초기 조회 및 공격대 목록 연동 복구
4. 환경 변수 정리와 통합 테스트 추가
5. AI 기능은 핵심 일정 관리 흐름이 안정화된 뒤 별도 설계
