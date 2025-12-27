# OG 이미지 추가 방법

## 현재 상태
링크 공유 시 미리보기를 위한 Open Graph 이미지 설정이 되어 있습니다.

## 이미지 추가하기

### 1. 이미지 파일 준비
- **파일명**: `og-image.png`
- **권장 크기**: 1200 x 630 픽셀
- **형식**: PNG 또는 JPG

### 2. 이미지 파일 위치
이 폴더(`public/`)에 `og-image.png` 파일을 넣으세요.

```
public/
  └── og-image.png  ← 여기!
```

### 3. 히어로 섹션 스크린샷 만들기 (추천)

배포 후:
1. 사이트 접속
2. 히어로 섹션 전체 화면 캡처
3. 1200 x 630 픽셀로 리사이즈
4. `og-image.png`로 저장
5. `public/` 폴더에 업로드
6. 커밋 & 푸시

### 4. 테스트하기

배포 후 다음 도구로 미리보기 확인:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

## 임시 대안

이미지가 없어도 링크는 공유되지만, 미리보기 이미지는 표시되지 않습니다.
나중에 추가해도 됩니다!
