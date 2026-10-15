

import json
import os
from datetime import datetime, timezone, timedelta


def parse_time(value):
    """ISO 8601 시간을 datetime으로 변환한다."""
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def calculate_lead_time(pull_requests):
    """PR 생성부터 병합까지 걸린 평균 시간(시간)을 계산한다."""
    durations = []

    for pr in pull_requests:
        created = parse_time(pr.get("created_at"))
        merged = parse_time(pr.get("merged_at"))

        if created and merged and merged >= created:
            durations.append((merged - created).total_seconds() / 3600)

    return {
        "average_hours": round(sum(durations) / len(durations), 2)
        if durations else None,
        "merged_pr_count": len(durations)
    }


def calculate_deployments(deployments):
    """최근 7일의 성공 배포 횟수와 변경 실패율을 계산한다."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    recent = []

    for deployment in deployments:
        status_time = parse_time(
            deployment.get("status_created_at")
            or deployment.get("created_at")
        )

        if status_time and status_time >= cutoff:
            if deployment.get("status") in ("success", "failure"):
                recent.append(deployment)

    successful = sum(1 for d in recent if d["status"] == "success")
    failed = sum(1 for d in recent if d["status"] == "failure")
    total = successful + failed

    return {
        "successful_deployments_7_days": successful,
        "deployments_per_day": round(successful / 7, 2),
        "failed_deployments_7_days": failed,
        "total_deployments_7_days": total,
        "change_failure_rate_percent": round(failed / total * 100, 2)
        if total else None
    }


def is_incident(issue):
    """incident: 제목 또는 incident 라벨이 있는 이슈만 장애로 취급한다."""
    title = issue.get("title", "").lower()
    labels = [
        label.get("name", "").lower()
        for label in issue.get("labels", [])
    ]
    return title.startswith("incident:") or "incident" in labels


def calculate_mttr(issues):
    """종료된 장애 이슈의 평균 복구 시간을 계산한다."""
    durations = []
    open_count = 0

    for issue in issues:
        if not is_incident(issue):
            continue

        if issue.get("state") == "open":
            open_count += 1
            continue

        created = parse_time(issue.get("created_at"))
        closed = parse_time(issue.get("closed_at"))

        if created and closed and closed >= created:
            durations.append((closed - created).total_seconds() / 3600)

    return {
        "average_recovery_hours": round(sum(durations) / len(durations), 2)
        if durations else None,
        "closed_incidents_count": len(durations),
        "open_incidents_count": open_count
    }


def main():
    pull_requests = json.loads(
        os.environ.get("PULL_REQUESTS_JSON", "[]")
    )
    deployments = json.loads(
        os.environ.get("DEPLOYMENTS_JSON", "[]")
    )
    issues = json.loads(
        os.environ.get("ISSUES_JSON", "[]")
    )

    result = {
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "period_days": 7,
        "lead_time": calculate_lead_time(pull_requests),
        "deployment_frequency_and_failure_rate":
            calculate_deployments(deployments),
        "mttr": calculate_mttr(issues)
    }

    os.makedirs("reports", exist_ok=True)

    with open("reports/metrics.json", "w", encoding="utf-8") as file:
        json.dump(result, file, ensure_ascii=False, indent=2)

    lead = result["lead_time"]
    deploy = result["deployment_frequency_and_failure_rate"]
    mttr = result["mttr"]

    report = f"""# DORA Metrics Report

- 수집 시각(UTC): {result["collected_at"]}
- 측정 기간: 최근 7일

## 1. Lead Time
- 평균 PR 생성~병합 시간: {lead["average_hours"] if lead["average_hours"] is not None else "데이터 없음"} 시간
- 병합된 PR 수: {lead["merged_pr_count"]}

## 2. Deployment Frequency
- 성공한 배포 수: {deploy["successful_deployments_7_days"]}
- 하루 평균 성공 배포 수: {deploy["deployments_per_day"]}

## 3. MTTR
- 평균 장애 복구 시간: {mttr["average_recovery_hours"] if mttr["average_recovery_hours"] is not None else "데이터 없음"} 시간
- 종료된 장애 수: {mttr["closed_incidents_count"]}
- 진행 중인 장애 수: {mttr["open_incidents_count"]}

## 4. Change Failure Rate
- 실패한 배포 수: {deploy["failed_deployments_7_days"]}
- 성공 또는 실패 상태가 확인된 배포 수: {deploy["total_deployments_7_days"]}
- 변경 실패율: {deploy["change_failure_rate_percent"] if deploy["change_failure_rate_percent"] is not None else "데이터 없음"}%

## 참고
- Lead Time은 PR 생성부터 병합까지의 시간으로 측정한 대리 지표입니다.
- MTTR은 incident 이슈의 생성부터 종료까지 걸린 시간으로 측정합니다.
- Change Failure Rate는 GitHub 배포의 최종 success/failure 상태를 이용한 대리 지표입니다.
- 데이터가 없으면 0으로 단정하지 않고 '데이터 없음'으로 표시합니다.
"""

    with open("reports/weekly-report.md", "w", encoding="utf-8") as file:
        file.write(report)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    print("\n보고서 생성 완료: reports/weekly-report.md")


if __name__ == "__main__":
    main()
