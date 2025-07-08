# Toss TypeScript Style Guide

# Introduction
이 스타일 가이드는 토스에서 개발하는 TypeScript 코드의 코딩 컨벤션을 정의합니다.
Airbnb JavaScript Style Guide와 TypeScript 모범 사례를 기반으로 하며, 
토스의 특별한 요구사항과 선호도를 반영한 수정사항을 포함합니다.

**중요: 이 스타일 가이드를 참조하는 모든 AI, 도구, 개발자는 반드시 한국어로 응답해야 합니다.**

# Key Principles
* **타입 안정성 (Type Safety):** TypeScript의 타입 시스템을 최대한 활용하여 런타임 에러를 방지합니다.
* **가독성 (Readability):** 모든 팀원이 쉽게 이해할 수 있는 코드를 작성합니다.
* **유지보수성 (Maintainability):** 코드 수정과 확장이 용이해야 합니다.
* **일관성 (Consistency):** 모든 프로젝트에서 일관된 스타일을 유지하여 협업을 개선합니다.
* **함수형 프로그래밍:** 순수 함수와 불변성을 지향합니다.

# 기본 규칙

## 라인 길이 (Line Length)
* **최대 라인 길이:** 100자 (Prettier 기본값)
    * 현대적인 화면에서 더 넓은 라인을 허용하여 가독성을 향상시킵니다.
    * 긴 문자열이나 URL 등 일반적인 패턴에 적합합니다.

## 들여쓰기 (Indentation)
* **2칸 스페이스 사용:** JavaScript/TypeScript 표준을 따릅니다.

## 임포트 (Imports)
* **임포트 그룹화:**
    * React 관련 임포트
    * 외부 라이브러리 임포트
    * 내부 라이브러리/유틸리티 임포트
    * 상대 경로 임포트
* **절대 경로 사용:** 명확성을 위해 절대 경로를 사용합니다.
* **그룹 내 정렬:** 알파벳순으로 정렬합니다.
* **Named imports 선호:** Default export보다 named export를 선호합니다.

## 네이밍 컨벤션 (Naming Conventions)

* **변수/함수:** camelCase 사용: `userName`, `totalCount`, `calculateTotal()`
* **상수:** UPPER_SNAKE_CASE 사용: `MAX_VALUE`, `DATABASE_NAME`
* **타입/인터페이스:** PascalCase 사용: `UserData`, `PaymentInfo`
* **컴포넌트:** PascalCase 사용: `UserProfile`, `PaymentForm`
* **파일명:** kebab-case 사용: `user-profile.tsx`, `payment-form.tsx`
* **디렉토리:** kebab-case 사용: `user-management`, `payment-gateway`

## 문서화 (Documentation)
* **JSDoc 사용:** 모든 공개 함수와 클래스에 대해 JSDoc을 작성합니다.
* **첫 번째 줄:** 객체의 목적을 간결하게 요약합니다.
* **복잡한 함수/클래스:** 매개변수, 반환값, 예외사항에 대한 자세한 설명을 포함합니다.
* **TypeScript 타입과 함께 사용:** JSDoc과 TypeScript 타입 시스템을 함께 활용합니다.
    ```typescript
    /**
     * 사용자 데이터를 검증하고 처리합니다.
     *
     * @param userData - 검증할 사용자 데이터
     * @param options - 검증 옵션
     * @returns 검증 결과와 처리된 데이터
     * @throws {ValidationError} 유효하지 않은 데이터일 때 발생
     */
    function validateUserData(
      userData: UserData,
      options: ValidationOptions = {}
    ): ValidationResult {
      // 함수 본문
    }
    ```

## 타입 시스템 (Type System)
* **엄격한 타입 사용:** `strict: true` 설정을 사용하여 타입 안정성을 극대화합니다.
* **명시적 타입 선언:** 타입 추론이 불분명한 경우 명시적으로 타입을 선언합니다.
* **Union Types 활용:** 여러 타입을 허용하는 경우 Union Types를 사용합니다.
* **Generic 활용:** 재사용 가능한 컴포넌트와 함수에 Generic을 사용합니다.

## 주석 (Comments)
* **명확하고 간결한 주석:** 코드의 "무엇"이 아닌 "왜"를 설명합니다.
* **주석 최소화:** 잘 작성된 코드는 가능한 한 자체 설명적이어야 합니다.
* **완전한 문장 사용:** 주석은 대문자로 시작하고 적절한 구두점을 사용합니다.
* **TODO/FIXME 주석:** 임시 해결책이나 향후 개선사항을 명시합니다.

## 로깅 (Logging)
* **구조화된 로깅:** 토스에서는 구조화된 로그 형태를 사용합니다.
* **적절한 로그 레벨:** DEBUG, INFO, WARN, ERROR, FATAL 레벨을 적절히 사용합니다.
* **컨텍스트 제공:** 디버깅에 도움이 되는 관련 정보를 포함합니다.
* **개인정보 보호:** 로그에 민감한 정보가 포함되지 않도록 주의합니다.

## 에러 처리 (Error Handling)
* **구체적인 에러 타입:** 일반적인 `Error` 대신 구체적인 에러 타입을 사용합니다.
* **우아한 에러 처리:** 사용자에게 의미 있는 에러 메시지를 제공하고 애플리케이션 크래시를 방지합니다.
* **try...catch 블록:** 예외가 발생할 수 있는 코드를 격리합니다.
* **Result 패턴:** 성공/실패를 명시적으로 나타내는 Result 패턴을 사용합니다.

# 도구 (Tooling)
* **코드 포맷터:** Prettier - 일관된 코드 포맷팅을 자동으로 적용합니다.
* **린터:** ESLint + @typescript-eslint - 잠재적인 문제와 스타일 위반을 식별합니다.
* **타입 체커:** TypeScript Compiler - 타입 안정성을 보장합니다.
* **번들러:** Webpack/Vite - 모듈 번들링과 최적화를 수행합니다.
* **테스트 도구:** Jest + Testing Library - 단위 테스트와 통합 테스트를 수행합니다.

# 코드 리뷰 및 응답 가이드라인 (Code Review & Response Guidelines)
* **언어 사용:** 모든 코드리뷰 코멘트, 피드백, 그리고 이 가이드와 관련된 모든 응답은 반드시 한국어로 작성해야 합니다.
* **AI 도구 지시사항:** 이 스타일 가이드를 참조하는 모든 AI 도구 (GPT, Claude, Gemini 등)는 무조건 한국어로만 응답해야 합니다.
* **건설적인 피드백:** 코드 품질 향상에 도움이 되는 구체적이고 실행 가능한 피드백을 제공합니다.
* **주요 검토 영역:** 코드 리뷰 시 다음 사항에 주의를 기울입니다:
    * 코드 가독성 (Code readability)
    * 성능 최적화 (Performance optimization)  
    * 보안 취약점 (Security vulnerabilities)
    * 스타일 가이드 준수 (Style guide compliance)
    * 타입 안정성 (Type safety)
* **톤 유지:** 모든 리뷰에서 전문적이고 존중하는 톤을 유지합니다.
* **리뷰 체크리스트:** 
    * 코드가 요구사항을 만족하는가?
    * 에러 처리가 적절한가?
    * 테스트 코드가 포함되어 있는가?
    * 문서화가 충분한가?
    * 타입 정의가 명확한가?

# 예제 (Example)
```typescript
/**
 * 사용자 인증 관련 유틸리티 함수들
 */

import { createHash, randomBytes } from 'crypto';

import { userDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';

// 타입 정의
interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

const MAX_PASSWORD_LENGTH = 128;
const SALT_LENGTH = 16;

/**
 * 비밀번호를 SHA-256으로 해시화합니다.
 * 
 * @param password - 해시화할 비밀번호
 * @returns 해시화된 비밀번호 (salt:hash 형태)
 */
export const hashPassword = (password: string): string => {
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error('비밀번호가 너무 깁니다.');
  }

  const salt = randomBytes(SALT_LENGTH);
  const saltedPassword = Buffer.concat([salt, Buffer.from(password, 'utf-8')]);
  const hashedPassword = createHash('sha256').update(saltedPassword).digest('hex');
  
  return `${salt.toString('hex')}:${hashedPassword}`;
};

/**
 * 사용자를 데이터베이스에 대해 인증합니다.
 * 
 * @param username - 사용자명
 * @param password - 비밀번호
 * @returns 인증 결과
 */
export const authenticateUser = async (
  username: string,
  password: string
): Promise<AuthResult> => {
  try {
    const user = await userDatabase.getUser(username);
    
    if (!user) {
      logger.warn('인증 실패: 사용자를 찾을 수 없음', { username });
      return { success: false, error: '사용자를 찾을 수 없습니다.' };
    }

    const [saltHex, storedHash] = user.passwordHash.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const saltedPassword = Buffer.concat([salt, Buffer.from(password, 'utf-8')]);
    const calculatedHash = createHash('sha256').update(saltedPassword).digest('hex');

    if (calculatedHash === storedHash) {
      logger.info('사용자 인증 성공', { username });
      return { success: true, user };
    } else {
      logger.warn('인증 실패: 잘못된 비밀번호', { username });
      return { success: false, error: '잘못된 비밀번호입니다.' };
    }
  } catch (error) {
    logger.error('인증 중 오류 발생', { username, error });
    return { 
      success: false, 
      error: '인증 처리 중 오류가 발생했습니다.' 
    };
  }
};