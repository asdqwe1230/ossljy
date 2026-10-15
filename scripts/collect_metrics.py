
import json
import os
from datetime import datetime, timezone


def parse_time(value):
    """ISO 8601 시간을 datetime으로 변환한다."""
    if not value:
        return None

    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def calculate_lead_time(pull_requests):
    """병합된 PR의 생성부터 병합까지 걸린 시간의 평균(시간)을 계산한다."""
    durations = []

    for pr in pull_requests:
        created = parse_time(pr.get("created_at"))
        merged = parse_time(pr.get("merged_at"))

        if created and merged and merged >= created:
            durations.append((merged - created).total_seconds() / 3600)

    if not durations:
        return None

    return round(sum(durations) / len(durations), 2)


def calculate_deployment_frequency(deployments):
    """성공한 배포 횟수를 7일 기준으로 계산한다."""
    now = datetime.now(timezone.utc)
    week_ago = now.timestamp() - 7 * 24 * 60 * 60

    successful = []

    for deployment in deployments:
        if deployment.get("status") != "success":
            continue

        created = parse_time(deployment.get("created_at"))

        if created and created.timestamp() >= week_ago:
            successful.append(deployment)

    return {
        "successful_deployments_7_days": len(successful),
        "deployments_per_day": round(len(successful) / 7, 2)
    }


def main():
    # GitHub Actions에서 전달받을 수집 데이터
    pull_requests = json.loads(
        os.environ.get("PULL_REQUESTS_JSON", "[]")
    )

    deployments = json.loads(
        os.environ.get("DEPLOYMENTS_JSON", "[]")
    )

    result = {
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "lead_time_hours": calculate_lead_time(pull_requests),
        "deployment_frequency": calculate_deployment_frequency(
            deployments
        )
    }

    os.makedirs("reports", exist_ok=True)

    with open("reports/metrics.json", "w", encoding="utf-8") as file:
        json.dump(result, file, ensure_ascii=False, indent=2)

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
