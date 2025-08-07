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

# 🚄 트러블 슈팅

프로젝트 진행 중 발생했던 주요 이슈와 해결 과정을 정리했습니다.

<details>
  <summary><strong>실시간 매칭 중 중복 접속/부정 로그인 이슈</strong></summary>
<img width="1857" height="1261" alt="image" src="https://github.com/user-attachments/assets/2ea8a8c5-d877-42b9-8d3b-49bd849472b0" />

- **문제점:**  
  동일 계정의 여러 클라이언트 동시 접속 시 거래 정보 꼬임, 부정 로그인 위험  
  또, 실시간 매칭(match)에서 거래 진행(match/trading) 페이지로 이동해도 소켓이 끊어지지 않아야 함.  
  반대로 match 페이지를 벗어났다 돌아오면 소켓을 정상적으로 새로 연결해야 하는 상황 발생

- **해결 방법:**  
  - **소켓 세션 관리**:  
    - `useGlobalSocket.ts`에서 소켓 상태를 전역 관리  
    - 페이지 이동에 따라 소켓 연결 유지/해제 제어  
    - `sessionStorage`를 활용, 사용자가 match → match/trading 등 내부 페이지 이동 시 소켓을 유지  
    - match에서 벗어나거나 새로 진입 시 소켓을 적절히 리프레시하도록 설계 (예: 방문 여부 true/false로 체크)

  ```ts
  // 간략 예시 (pseudo)
  // useGlobalSocket.ts 내부
  useEffect(() => {
    if (sessionStorage.getItem('hasVisited')) {
      // 소켓 연결 유지
    } else {
      // 소켓 새로 연결
      sessionStorage.setItem('hasVisited', 'true');
    }
    // 페이지 벗어날 때
    return () => {
      sessionStorage.setItem('hasVisited', 'false');
      // 소켓 연결 해제
    };
  }, [pathname]);
  ```
- **결과:**

  실제 서비스에서 동시 접속/부정 로그인 시도가 모두 차단됨
  
  거래 단계(match → match/trading) 페이지 이동 시에도 소켓이 안전하게 유지
  
  불필요한 재연결/끊김 없이 사용자 경험(UX)도 자연스럽게 구현됨

</details> 




  

</details> <details> <summary><strong>API 호출 더블링 현상</strong></summary>
  
- **문제점:**
useEffect의 경우 Dev 환경에서는 두번 발생하는 경우가 있으나 useEffect를 전혀 사용하지않은 상황이라 원인을 파악해보니 이벤트 리스너를 여러 상황에 등록해두어 이벤트가 동시다발적으로 발동된 상황

- **해결 방법:**
한 화면에서 이미 발송된 전적이 있는지 판단을 하거나 이벤트 리스너를 발생되자마자 지우는 등의 조치로 해결

</details>

</details> <details> <summary><strong>Oauth 로그인 서비스 구축</strong></summary>
  
  [+Oauth 로그인 서비스 구축](https://www.notion.so/2224a475c7f78024ad24ebbf67ed515d?v=2224a475c7f780bf8a45000c850aa9b3&p=23c4a475c7f7807b87b0fa031cc11a3a&pm=s)

</details>

</details> <details> <summary><strong> 모바일 메뉴 내 Link 클릭 불가 이슈 (Next.js + Headless UI)</strong></summary>
  
- **문제 발생**: 모바일 환경에서 `<Dialog>`로 구현한 드롭다운 메뉴 내 `<Link>` 컴포넌트가 **렌더링은 되지만 클릭이 되지 않는 문제**가 발생했습니다.
- **분석 과정**:
  - z-index 및 stacking context 조정 → 실패
  - 오버레이 레이어 충돌 확인 → 실패
  - `<Link>` 대신 `<button>`으로 대체 테스트 → 성공
- **원인 파악**:
  - Headless UI의 `<Dialog>`의 **포커스 트래핑(Focus Trap)** 기능이 Next.js의 `<Link>` 내비게이션을 **가로막는 충돌**이 일어났습니다.
- **해결 방법**:
  - `<Link>` 대신 `button` 태그 사용
  - `onClick` 핸들러 내부에서 `router.push()`로 **프로그래밍 방식 라우팅 처리**
- **예시 코드**:
```tsx
기존 코드: <Link href="/mypage">마이페이지</Link>
↓
수정 코드: <button onClick={() => router.push('/mypage')}>마이페이지</button>
```

</details>


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
에자일 방법론 도입

#### 총기간 2025.6.30 ~ 2025.8.8 (39 days)


# 👩‍💻 팀원

## FE
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/hyonun321"><img src="https://avatars.githubusercontent.com/u/196058650?v=4" width="120px;" alt=""/><br /><b>김현훈</b></a><br /><p>👑거래(일반 거래, 실시간 거래), 블로그</p></td>
      <td align="center"><a href="https://github.com/yshls"><img src="https://avatars.githubusercontent.com/u/97035336?v=4" width="120px;" alt=""/><br /><b>양세현</b></a><br /><p>메인 페이지, 블로그, 관리자</p></td>
      <td align="center"><a href="https://github.com/seungwoo505"><img src="https://avatars.githubusercontent.com/u/51819005?v=4" width="120px;" alt=""/><br /><b>이승우</b></a><br /><p>로그인, 회원가입, 마이페이지, 결제, SEO, 최적화</p></td>
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
