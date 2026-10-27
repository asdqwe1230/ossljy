# Contributing Guide

## 1. GitHub Flow

- 새로운 작업은 `feature/기능명` 브랜치에서 진행한다.
- 작업이 끝나면 GitHub에 Push하고 Pull Request를 생성한다.
- 코드 리뷰를 거친 후 `main` 브랜치에 병합한다.

## 2. Branch Naming

- `feature/`: 새로운 기능
- `fix/`: 버그 수정
- `docs/`: 문서 수정

## 3. Conventional Commits

커밋 메시지는 다음 형식을 따른다.

`type: 작업 내용`

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `refactor`: 코드 구조 개선
- `test`: 테스트 추가 및 수정

## 4. Pull Request

- 변경 목적과 주요 내용을 작성한다.
- 변경 사항을 자체 리뷰한다.
- 테스트를 실행하고 CI 결과를 확인한다.
- 리뷰 피드백을 반영한 후 병합한다.

## 5. Code Review

- `[MUST]`: 반드시 수정해야 하는 문제
- `[SHOULD]`: 개선을 권장하는 사항
- 구체적인 대안과 개선 방향을 제시한다.
- 좋은 코드나 적절한 설계도 칭찬한다.