# 사용자 시나리오 기반 기능 실험 제출 자료

본 폴더는 사용자 시나리오를 기반으로 기능을 설계하고, A/B 테스트를 통해 기능을 비교·검토한 프로젝트의 제출 자료입니다.

## 1. 실험 문서 (01-experiment-docs)

- `experiment-plan.md`: A/B 테스트 계획 및 실험 방법
- `user-personas.md`: LLM을 활용해 생성한 10개의 가상 사용자 페르소나
- `user-scenarios.md`: 사용자별 시나리오 및 테스트 내용

## 2. 실험 데이터 (02-experiment-data)

- `feedback-results.csv`: LLM으로 생성한 가상 사용자 피드백 데이터
- `functional-test-events.json`: 기능 테스트 과정에서 수집한 이벤트 기록
- `experiment-results.md`: A/B 그룹별 기능 테스트 및 자체 테스트 결과 보고서

## 3. 의사결정 기록 (03-decision-record)

- `0001-pivot-or-persevere.md`: 실험 결과를 바탕으로 작성한 Pivot 또는 Persevere 결정 기록

## 4. 실험 결과 해석 및 한계

현재 기록된 A/B 테스트 결과는 한 명의 사용자가 A 그룹과 B 그룹을 각각 4회씩 테스트한 자체 테스트 결과입니다.

10개의 사용자 페르소나와 피드백 데이터는 LLM을 통해 생성한 시뮬레이션 자료이며, 실제 사용자 10명의 응답이 아닙니다.

또한 2주간의 정식 A/B 테스트는 아직 완료되지 않았습니다. 따라서 현재 작성된 Persevere 결정은 자체 테스트 결과를 바탕으로 한 잠정적인 결정이며, 실제 사용자 피드백과 정식 실험 결과를 수집한 후 최종적으로 검토할 예정입니다.