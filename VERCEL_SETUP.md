# Vercel 환경변수 설정 가이드

## Vercel Dashboard에서 환경변수 추가하기

### 1. Vercel 프로젝트 설정으로 이동
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 (2025-r45-recap)
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Environment Variables** 선택

### 2. 환경변수 추가

다음 2개의 환경변수를 추가하세요:

#### Variable 1: VITE_SUPABASE_URL
```
Key (키): VITE_SUPABASE_URL
Value (값): https://ijgxyqipwqznlleeurog.supabase.co
Environment: Production, Preview, Development (모두 체크)
```

#### Variable 2: VITE_SUPABASE_ANON_KEY
```
Key (키): VITE_SUPABASE_ANON_KEY
Value (값): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZ3h5cWlwd3F6bmxsZWV1cm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Nzg1NzQsImV4cCI6MjA4MjM1NDU3NH0.k4rsxlqC57-qanW6MgpgpROfugaVLUX1HkKaT7MHZew
Environment: Production, Preview, Development (모두 체크)
```

### 3. 저장 후 재배포
- **Save** 버튼 클릭
- Deployments 탭으로 이동
- 가장 최근 배포에서 **Redeploy** 클릭
- 또는 새로운 커밋을 푸시하여 자동 배포

---

## 📝 복사용 환경변수 값

### VITE_SUPABASE_URL
```
https://ijgxyqipwqznlleeurog.supabase.co
```

### VITE_SUPABASE_ANON_KEY (Public Key - 안전함)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZ3h5cWlwd3F6bmxsZWV1cm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Nzg1NzQsImV4cCI6MjA4MjM1NDU3NH0.k4rsxlqC57-qanW6MgpgpROfugaVLUX1HkKaT7MHZew
```

---

## ⚠️ Service Role Key 주의사항

아래 Service Role Key는 **절대로 클라이언트 코드나 환경변수에 넣으면 안됩니다!**

❌ **사용하지 마세요 (서버 전용)**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZ3h5cWlwd3F6bmxsZWV1cm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3ODU3NCwiZXhwIjoyMDgyMzU0NTc0fQ.Nm6ROLbfFQ9a4KB0ZYbx-zwT8W1FT1uV3RsH-nk4HG0
```

이 키는 백엔드 API나 서버리스 함수에서만 사용해야 합니다.

---

## 🔍 환경변수 확인

Vercel 환경변수가 제대로 설정되었는지 확인하려면:

1. 배포 후 브라우저 개발자 도구 콘솔에서:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
```

2. 또는 앱 코드에서 Supabase 클라이언트가 정상 초기화되는지 확인

---

## 🚀 로컬 개발 환경

로컬에서는 `.env` 파일이 자동으로 사용됩니다:
```bash
npm run dev
```

`.env` 파일은 이미 생성되어 있으며 `.gitignore`에 포함되어 있어 GitHub에 업로드되지 않습니다.
