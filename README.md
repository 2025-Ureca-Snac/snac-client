# 유레카 비대면 융합프로젝트 1조

![헤더 (2)](https://github.com/user-attachments/assets/78461da4-dee7-4be4-882e-df732ee39129)

## Snac (Share Network Allocation & Commerce)

![vc12](https://github.com/user-attachments/assets/4523d261-9049-4efc-ab5d-ecc28d3e8fd3)


[🔗팀노션](https://www.notion.so/Snac-2224a475c7f780d5a9dbd467cf15fe0b?source=copy_link)
[🎨피그마](https://www.figma.com/design/eO8GHGStmnF8NgLo4BKyaK/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=0-1&t=lW8NdrlOaJu4ytEB-1)
[🌐배포사이트](https://www.snac-app.com/)
[👨‍🏫시연영상](https://youtu.be/TuABjUV7xGg)

# 👨‍🔧 기획
> 남는 통신 데이터를 쉽고 안전하게 사고파는 실시간 데이터 거래 플랫폼, Snac!

**Snac은 이런 서비스예요.**

- 실시간 거래: 판매자와 구매자가 즉시 연결되어, 남는 데이터를 빠르고 쉽게 거래할 수 있습니다.
- 거래 안전성과 익명성: 개인정보 노출 없이, 안심하고 거래할 수 있도록 익명 매칭과 안전 결제 시스템을 도입했습니다.

시장 데이터 약 300건을 조사하여 불편함을 느낀 20명 중 18명이 **빠른 응답**을, 2명이 **익명성 보장**을 가장 중요한 가치로 꼽았습니다.


---



# 🚄 주요 기능

## 홈 화면

![2025-08-0714-53-14-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/9ef81647-4677-4267-9436-361011f8dc25)



## 로그인/회원가입
### 로그인

<img width="1644" height="1346" alt="image" src="https://github.com/user-attachments/assets/7dda8806-947e-4f7a-94b0-20335ce34c19" />

### 회원가입

<img width="3572" height="1880" alt="image" src="https://github.com/user-attachments/assets/21a15f25-74ac-4372-b652-bf44cd369fef" />

## 구매글/판매글 


![12d12d1zx23](https://github.com/user-attachments/assets/1a02a759-205d-497f-9db5-323c9b686453)


## 구매글/판매글 거래

![ezgif com-video-to-gif-converter (6)](https://github.com/user-attachments/assets/718a5c2f-fb5f-414f-9151-6b9b2a6580c6)

## 마이페이지

<img width="2459" height="1252" alt="image" src="https://github.com/user-attachments/assets/9072c23b-6a62-4286-86a7-73a00111e271" />


<img width="2458" height="1137" alt="image" src="https://github.com/user-attachments/assets/47122926-3914-4ef8-86a2-a6e5ac50d690" />


## 소셜 로그인 연동

![2025-08-0700-13-20-ezgif com-censor](https://github.com/user-attachments/assets/d30ee0ac-762c-4b2b-a462-888b01e5d97f)

## 거래 내역

![ff1123-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/8bfb3c24-d595-4cb8-913c-9b0aede3f632)


## 실시간 매칭

![2025-08-0715-38-31-ezgif com-optimize](https://github.com/user-attachments/assets/c9b43660-a638-45a2-9efd-88696b34515e)

![2025-08-0716-24-30-ezgif com-optimize](https://github.com/user-attachments/assets/42dfce22-349a-4c7e-a6d6-96a1da17b147)

## 블로그 (읽을거리)

![ezgif com-video-to-gif-converter (9)](https://github.com/user-attachments/assets/a65bf58e-79cf-4965-82a8-9495637323a2)


## 어드민 페이지 대쉬보드 및 신고관리
![ezgif com-video-to-gif-converter (7)](https://github.com/user-attachments/assets/750f4282-1575-4678-bcff-bc965557eb04)


## 어드민 페이지 블로그글 등록/수정/삭제

![ezgif com-speed (1)](https://github.com/user-attachments/assets/b1f06775-84b7-4c9f-a637-68631ee6c57a)




# 🗂️ 디렉토리 구조

```
app/  # Next.js 15의 App Router 폴더
│   ├── (shared)/ # 전역 공용 컴포넌트/유틸/상수
│   │     ├── components/
│   │     ├── constants/
│   │     │     └── index.ts
│   │     ├── hooks/
│   │     ├── stores/
│   │     ├── types/
│   │     └── utils/
│   ├── blog/ # 블로그 도메인 관련 폴더
│   │     ├── admin/ 
│   │     ├── components/
│   │     ├── data/
│   │     ├── utils/
│   │     ├── layout.tsx
│   │     └── page.tsx
│   ├── login/ # 로그인 페이지
│   ├── match/ # 실시간 매칭 페이지
│   ├── payment/ # 결제 관련 페이지
│   ├── signUp/ # 회원가입 페이지

```

# 🔰 실행 방법

```bash
# 1. 의존성 설치 (루트 디렉토리에서 실행)
npm install

# 2. 빌드 (서버, 클라이언트 등 모든 패키지 빌드)
npm run build

# 3. 개발 서버 실행 (서버와 클라이언트가 동시에 실행됨)
npm run dev
```


**FE 환경변수**
```env
NEXT_PUBLIC_API_URL={백엔드 서버 URL}
```

개발 서버를 실행할 때, 환경변수를 설정해주세요! (.env파일로 생성)

## 📚 Tech Stack

협업 툴도 적어보기 (지라,피그마 등등)


### 💻 FE Development

[![My Skills](https://skillicons.dev/icons?i=nextjs,ts,tailwind,react)](https://skillicons.dev)

### ⌛ Developed Period
에자일 방법론 도입

#### 총기간 2025.6.30 ~ 2025.8.8 (39 days)
## 📅 개발 기간

| 기간                | 주차          | 진행 내용              |
|---------------------|--------------|------------------------|
| 2025.6.30 ~ 2025.8.8 | 전체 (39일)   | 프로젝트 전체 기간      |
| 2025.6.30 ~ 2025.7.6 | 1주차         |                        |
| 2025.7.7 ~ 2025.7.13 | 2주차         |                        |
| 2025.7.14 ~ 2025.7.20 | 3주차        |                        |
| 2025.7.21 ~ 2025.7.27 | 4주차        |                        |
| 2025.7.28 ~ 2025.8.4  | 5주차        |                        |
| 2025.8.5 ~ 2025.8.7   | 6주차        |                        |



# 👩‍💻 팀원

## FE
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/hyonun321"><img src="https://avatars.githubusercontent.com/u/196058650?v=4" width="120px;" alt=""/><br /><b>김현훈</b></a><br /><p>👑팀장</p></td>
      <td align="center"><a href="https://github.com/yshls"><img src="https://avatars.githubusercontent.com/u/97035336?v=4" width="120px;" alt=""/><br /><b>양세현</b></a><br /><p>개발</p></td>
      <td align="center"><a href="https://github.com/seungwoo505"><img src="https://avatars.githubusercontent.com/u/51819005?v=4" width="120px;" alt=""/><br /><b>이승우</b></a><br /><p>개발</p></td>
    </tr>
  </tbody>
</table>

## BE
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/iju42829"><img src="https://avatars.githubusercontent.com/u/116072376?v=4" width="120px;" alt=""/><br /><b>이재윤</b></a><br /><p>개발</p></td>
      <td align="center"><a href="https://github.com/Iamcalmdown"><img src="https://avatars.githubusercontent.com/u/144317474?v=4" width="120px;" alt=""/><br /><b>정동현</b></a><br /><p>개발</p></td>
      <td align="center"><a href="https://github.com/mike7643"><img src="https://avatars.githubusercontent.com/u/121170730?v=4" width="120px;" alt=""/><br /><b>정유민</b></a><br /><p>개발</p></td>
      <td align="center"><a href="https://github.com/seokjuun"><img src="https://avatars.githubusercontent.com/u/45346977?v=4" width="120px;" alt=""/><br /><b>홍석준</b></a><br /><p>개발</p></td>
    </tr>
  </tbody>
  </table>


# 🎯 커밋 컨벤션

- `feat`: Add a new feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code formatting, missing semicolons, cases where no code change is involved
- `refactor`: Code refactoring
- `test`: Test code, adding refactoring tests
- `build`: Build task updates, package manager updates
