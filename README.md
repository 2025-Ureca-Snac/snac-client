# 유레카 비대면 융합프로젝트 1조

![헤더 (2)](https://github.com/user-attachments/assets/78461da4-dee7-4be4-882e-df732ee39129)

## Snac (Share Network Allocation & Commerce)

![vc12](https://github.com/user-attachments/assets/4523d261-9049-4efc-ab5d-ecc28d3e8fd3)


[🔗팀노션](https://www.notion.so/Snac-2224a475c7f780d5a9dbd467cf15fe0b?source=copy_link)
[🎨피그마](https://www.figma.com/design/eO8GHGStmnF8NgLo4BKyaK/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=0-1&t=lW8NdrlOaJu4ytEB-1)
[🌐배포사이트](https://www.snac-app.com/)
[👨‍🏫시연영상]()

# 🚄 주요 기능
## 로그인/회원가입
### 로그인
<img width="2141" height="1333" alt="image" src="https://github.com/user-attachments/assets/c987871c-1b0b-4b2b-91d5-f9769db04988" />

### 회원가입
<img width="2860" height="1908" alt="image" src="https://github.com/user-attachments/assets/252185a5-e475-4a3f-818a-1796ce3dae10" />

## 구매글/판매글 조회
<img width="1444" height="830" alt="image" src="https://github.com/user-attachments/assets/0e682c04-c04b-42d8-8067-3c9bf0558bde" />

## 구매글/판매글 등록
- [구현중]
## 마이페이지
- [구현중]
## 실시간 매칭
- [구현중]
## 블로그글 조회


https://github.com/user-attachments/assets/739eab49-7e3c-41da-b47d-4478b88183d6



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

### 💻 FE Development

[![My Skills](https://skillicons.dev/icons?i=nextjs,ts,tailwind,react)](https://skillicons.dev)

### ⌛ Developed Period

#### 2025.6.30 ~ 2025.8.8 (39 days)

# 👩‍💻 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/hyonun321"><img src="https://avatars.githubusercontent.com/u/196058650?v=4" width="120px;" alt=""/><br /><b>김현훈</b></a><br /><p>👑팀장</p></td>
      <td align="center"><a href="https://github.com/yshls"><img src="https://avatars.githubusercontent.com/u/97035336?v=4" width="120px;" alt=""/><br /><b>양세현</b></a><br /><p>개발</p></td>
      <td align="center"><a href="https://github.com/seungwoo505"><img src="https://avatars.githubusercontent.com/u/51819005?v=4" width="120px;" alt=""/><br /><b>이승우</b></a><br /><p>개발</p></td>
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
