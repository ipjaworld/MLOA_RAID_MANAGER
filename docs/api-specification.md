# MLOA 레이드 매니저 API 명세서

## 개요
MLOA 레이드 매니저는 사용자가 로스트아크 게임의 캐릭터, 일정 및 공격대 그룹을 관리하도록 도와주는 플랫폼입니다. 
이 API 문서는 사용 가능한 모든 엔드포인트, 매개변수 및 예상 응답을 설명합니다.

## 기본 URL
```
https://api.mloa-raid-manager.com/v1
```

## 인증
대부분의 엔드포인트는 JWT(JSON Web Token)를 사용한 인증이 필요합니다. 토큰을 Authorization 헤더에 포함하세요:
```
Authorization: Bearer {your_token}
```

---

## 사용자 관리

### 사용자 등록
- **엔드포인트**: `POST /auth/register`
- **설명**: 새 사용자 계정 등록
- **요청 본문**:
  ```json
  {
    "email": "string",
    "password": "string",
    "nickname": "string",
    "login_type": "string" // "simple", "kakao" 등
  }
  ```
- **응답**: `201 Created`
  ```json
  {
    "id": "string",
    "email": "string",
    "nickname": "string",
    "created_at": "datetime",
    "token": "string"
  }
  ```

### 로그인
- **엔드포인트**: `POST /auth/login`
- **설명**: 사용자 인증
- **요청 본문**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **응답**: `200 OK`
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "nickname": "string"
    }
  }
  ```

### 로그아웃
- **엔드포인트**: `POST /auth/logout`
- **설명**: 현재 사용자 로그아웃
- **인증**: 필요
- **응답**: `204 No Content`

---

## 캐릭터 관리

### 대표 캐릭터 정보 가져오기
- **엔드포인트**: `GET /characters/main`
- **설명**: 사용자의 대표 캐릭터 정보 가져오기
- **인증**: 필요
- **응답**: `200 OK`
  ```json
  {
    "id": "string",
    "name": "string",
    "job": "string",
    "level": "number",
    "server": "string",
    "item_level": "number",
    "is_main": true
  }
  ```

### 모든 사용자 캐릭터 가져오기
- **엔드포인트**: `GET /characters`
- **설명**: 사용자의 원정대 내 모든 캐릭터 가져오기
- **인증**: 필요
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "job": "string",
      "level": "number",
      "server": "string",
      "item_level": "number",
      "is_main": true
    },
    {
      "id": "string",
      "name": "string",
      "job": "string",
      "level": "number",
      "server": "string",
      "item_level": "number",
      "is_main": false
    }
  ]
  ```

### 캐릭터 아이템 가져오기
- **엔드포인트**: `GET /characters/{character_id}/items/{item_name}`
- **설명**: 특정 캐릭터의 특정 아이템 정보 가져오기
- **인증**: 필요
- **매개변수**:
  - `character_id`: 캐릭터 ID
  - `item_name`: 아이템 이름
- **응답**: `200 OK`
  ```json
  {
    "id": "string",
    "name": "string",
    "tier": "number",
    "quality": "number",
    "type": "string"
  }
  ```

---

## 일정 관리

### 내 일정 가져오기
- **엔드포인트**: `GET /schedules`
- **설명**: 사용자의 일정 가져오기 (월별 보기 +/- 1주)
- **인증**: 필요
- **쿼리 매개변수**:
  - `year`: 년도 (YYYY)
  - `month`: 월 (MM)
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "start_time": "datetime",
      "end_time": "datetime",
      "memo": "string",
      "visibility": "string" // "public" 또는 "private"
    }
  ]
  ```

### 일별 일정 가져오기
- **엔드포인트**: `GET /schedules/daily`
- **설명**: 특정 날짜의 사용자 일정 가져오기
- **인증**: 필요
- **쿼리 매개변수**:
  - `date`: 날짜 (YYYY-MM-DD)
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "start_time": "datetime",
      "end_time": "datetime",
      "memo": "string",
      "visibility": "string"
    }
  ]
  ```

### 일정 상세 정보 가져오기
- **엔드포인트**: `GET /schedules/{schedule_id}`
- **설명**: 특정 일정에 대한 상세 정보 가져오기
- **인증**: 필요
- **매개변수**:
  - `schedule_id`: 일정 ID
- **응답**: `200 OK`
  ```json
  {
    "id": "string",
    "title": "string",
    "start_time": "datetime",
    "end_time": "datetime",
    "memo": "string",
    "visibility": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
  ```

### 일정 생성하기
- **엔드포인트**: `POST /schedules`
- **설명**: 새 일정 생성
- **인증**: 필요
- **요청 본문**:
  ```json
  {
    "title": "string",
    "start_time": "datetime",
    "end_time": "datetime",
    "memo": "string",
    "visibility": "string" // "public" 또는 "private"
  }
  ```
- **응답**: `201 Created`
  ```json
  {
    "id": "string",
    "title": "string",
    "start_time": "datetime",
    "end_time": "datetime",
    "memo": "string",
    "visibility": "string",
    "created_at": "datetime"
  }
  ```

### 일정 업데이트하기
- **엔드포인트**: `PATCH /schedules/{schedule_id}`
- **설명**: 기존 일정 업데이트
- **인증**: 필요
- **매개변수**:
  - `schedule_id`: 일정 ID
- **요청 본문**:
  ```json
  {
    "title": "string",  // 선택 사항
    "start_time": "datetime",  // 선택 사항
    "end_time": "datetime",  // 선택 사항
    "memo": "string",  // 선택 사항
    "visibility": "string"  // 선택 사항, "public" 또는 "private"
  }
  ```
- **응답**: `200 OK`
  ```json
  {
    "id": "string",
    "title": "string",
    "start_time": "datetime",
    "end_time": "datetime",
    "memo": "string",
    "visibility": "string",
    "updated_at": "datetime"
  }
  ```

### 일정 삭제하기
- **엔드포인트**: `DELETE /schedules/{schedule_id}`
- **설명**: 일정 삭제
- **인증**: 필요
- **매개변수**:
  - `schedule_id`: 일정 ID
- **응답**: `204 No Content`

### 다른 사용자의 일정 가져오기
- **엔드포인트**: `GET /users/{user_id}/schedules`
- **설명**: 다른 사용자의 공개 일정 가져오기
- **인증**: 필요
- **매개변수**:
  - `user_id`: 사용자 ID
- **쿼리 매개변수**:
  - `year`: 년도 (YYYY)
  - `month`: 월 (MM)
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "start_time": "datetime",
      "end_time": "datetime",
      "visibility": "public"
    }
  ]
  ```

### 다른 사용자의 일별 일정 가져오기
- **엔드포인트**: `GET /users/{user_id}/schedules/daily`
- **설명**: 특정 날짜의 다른 사용자 공개 일정 가져오기
- **인증**: 필요
- **매개변수**:
  - `user_id`: 사용자 ID
- **쿼리 매개변수**:
  - `date`: 날짜 (YYYY-MM-DD)
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "start_time": "datetime",
      "end_time": "datetime",
      "visibility": "public"
    }
  ]
  ```

---

## 공격대 그룹 관리

### 모든 공개 공격대 그룹 가져오기
- **엔드포인트**: `GET /raid-groups`
- **설명**: 모든 공개 공격대 그룹 가져오기
- **인증**: 필요
- **쿼리 매개변수**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 결과 수 (기본값: 20)
- **응답**: `200 OK`
  ```json
  {
    "total": "number",
    "pages": "number",
    "current_page": "number",
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "visibility": "public",
        "leader": {
          "id": "string",
          "nickname": "string"
        },
        "member_count": "number",
        "created_at": "datetime"
      }
    ]
  }
  ```

### 공격대 그룹 생성하기
- **엔드포인트**: `POST /raid-groups`
- **설명**: 새 공격대 그룹 생성
- **인증**: 필요
- **요청 본문**:
  ```json
  {
    "name": "string",
    "description": "string",
    "visibility": "string" // "public" 또는 "private"
  }
  ```
- **응답**: `201 Created`
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "visibility": "string",
    "leader_id": "string",
    "created_at": "datetime"
  }
  ```

### 공격대 그룹 업데이트하기
- **엔드포인트**: `PATCH /raid-groups/{group_id}`
- **설명**: 공격대 그룹 정보 업데이트
- **인증**: 필요 (공대장만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **요청 본문**:
  ```json
  {
    "name": "string",  // 선택 사항
    "description": "string",  // 선택 사항
    "visibility": "string"  // 선택 사항, "public" 또는 "private"
  }
  ```
- **응답**: `200 OK`
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "visibility": "string",
    "updated_at": "datetime"
  }
  ```

### 공격대 그룹 멤버 가져오기
- **엔드포인트**: `GET /raid-groups/{group_id}/members`
- **설명**: 공격대 그룹의 멤버 가져오기
- **인증**: 필요 (멤버만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "user": {
        "id": "string",
        "nickname": "string"
      },
      "role": "string", // "leader", "sub", "member"
      "joined_at": "datetime",
      "status": "string" // "approved", "pending", "rejected"
    }
  ]
  ```

### 멤버 역할 업데이트하기
- **엔드포인트**: `PATCH /raid-groups/{group_id}/members/{user_id}`
- **설명**: 공격대 그룹에서 멤버의 역할 업데이트
- **인증**: 필요 (공대장만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
  - `user_id`: 사용자 ID
- **요청 본문**:
  ```json
  {
    "role": "string", // "leader", "sub", "member"
    "status": "string" // "approved", "pending", "rejected"
  }
  ```
- **응답**: `200 OK`
  ```json
  {
    "id": "string",
    "user_id": "string",
    "role": "string",
    "status": "string",
    "updated_at": "datetime"
  }
  ```

### 공대장 권한 이전
- **엔드포인트**: `POST /raid-groups/{group_id}/transfer-leadership`
- **설명**: 공격대 그룹 리더십을 다른 멤버에게 이전
- **인증**: 필요 (공대장만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **요청 본문**:
  ```json
  {
    "new_leader_id": "string"
  }
  ```
- **응답**: `200 OK`
  ```json
  {
    "success": true,
    "message": "리더십이 성공적으로 이전되었습니다"
  }
  ```

### 공격대 그룹 가입 신청
- **엔드포인트**: `POST /raid-groups/{group_id}/apply`
- **설명**: 공격대 그룹 가입 신청
- **인증**: 필요
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **응답**: `201 Created`
  ```json
  {
    "id": "string",
    "raid_group_id": "string",
    "user_id": "string",
    "role": "member",
    "status": "pending",
    "applied_at": "datetime"
  }
  ```

### 가입 신청 상태 확인
- **엔드포인트**: `GET /raid-groups/applications`
- **설명**: 사용자의 공격대 그룹 가입 신청 상태 확인
- **인증**: 필요
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "raid_group": {
        "id": "string",
        "name": "string"
      },
      "status": "string", // "approved", "pending", "rejected"
      "applied_at": "datetime"
    }
  ]
  ```

### 공격대 그룹 탈퇴
- **엔드포인트**: `DELETE /raid-groups/{group_id}/leave`
- **설명**: 공격대 그룹 탈퇴
- **인증**: 필요
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **응답**: `204 No Content`

### 공격대 그룹 삭제 (해산)
- **엔드포인트**: `DELETE /raid-groups/{group_id}`
- **설명**: 공격대 그룹 삭제 (해산)
- **인증**: 필요 (공대장만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **응답**: `204 No Content`

---

## 레이드 일정 관리

### 공격대 그룹 일정 가져오기
- **엔드포인트**: `GET /raid-groups/{group_id}/schedules`
- **설명**: 공격대 그룹 일정 가져오기
- **인증**: 필요 (멤버만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **쿼리 매개변수**:
  - `year`: 년도 (YYYY)
  - `month`: 월 (MM)
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "start_time": "datetime",
      "end_time": "datetime",
      "created_at": "datetime"
    }
  ]
  ```

### 공격대 그룹 일별 일정 가져오기
- **엔드포인트**: `GET /raid-groups/{group_id}/schedules/daily`
- **설명**: 특정 날짜의 공격대 그룹 일정 가져오기
- **인증**: 필요 (멤버만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **쿼리 매개변수**:
  - `date`: 날짜 (YYYY-MM-DD)
- **응답**: `200 OK`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "start_time": "datetime",
      "end_time": "datetime",
      "created_at": "datetime"
    }
  ]
  ```

### 추천 레이드 시간 가져오기
- **엔드포인트**: `GET /raid-groups/{group_id}/recommended-times`
- **설명**: 멤버들의 일정을 기반으로 AI가 추천하는 레이드 시간 가져오기
- **인증**: 필요 (멤버만 가능)
- **매개변수**:
  - `group_id`: 공격대 그룹 ID
- **응답**: `200 OK`
  ```json
  {
    "recommended_times": [
      {
        "date": "YYYY-MM-DD",
        "start_time": "HH:MM",
        "end_time": "HH:MM",
        "availability_score": "number",
        "available_members": "number",
        "total_members": "number"
      }
    ]
  }
  ```

---

## AI 채팅 관리

### AI 매니저에게 메시지 보내기
- **엔드포인트**: `POST /ai/chat`
- **설명**: AI 매니저에게 메시지 보내기
- **인증**: 필요
- **요청 본문**:
  ```json
  {
    "message": "string"
  }
  ```
- **응답**: `200 OK`
  ```json
  {
    "id": "string",
    "role": "ai",
    "message": "string",
    "created_at": "datetime"
  }
  ```

### 채팅 내역 가져오기
- **엔드포인트**: `GET /ai/chat`
- **설명**: AI 매니저와의 채팅 내역 가져오기
- **인증**: 필요
- **쿼리 매개변수**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 결과 수 (기본값: 50)
- **응답**: `200 OK`
  ```json
  {
    "total": "number",
    "pages": "number",
    "current_page": "number",
    "data": [
      {
        "id": "string",
        "role": "string", // "user" 또는 "ai"
        "message": "string",
        "created_at": "datetime"
      }
    ]
  }
  ```

---

## 오류 응답

### 일반적인 오류 응답 형식
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {} // 선택 사항
  }
}
```

### 일반적인 상태 코드
- `400 Bad Request`: 잘못된 요청 형식 또는 매개변수
- `401 Unauthorized`: 인증 필요 또는 잘못된 토큰
- `403 Forbidden`: 사용자가 이 작업에 대한 권한이 없음
- `404 Not Found`: 리소스를 찾을 수 없음
- `409 Conflict`: 리소스 충돌
- `422 Unprocessable Entity`: 요청 유효성 검사 실패
- `500 Internal Server Error`: 서버 오류