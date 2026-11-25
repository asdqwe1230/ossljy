// Feature Flag 설정
const flags = window.APP_CONFIG;

// 사용자 ID 생성 및 저장
function getUserId() {
    let userId = localStorage.getItem("calculator_user_id");

    if (!userId) {
        userId = "user-" + Math.random().toString(36).substring(2, 12);
        localStorage.setItem("calculator_user_id", userId);
    }

    return userId;
}

// A/B 테스트 사용자 배정
function assignVariant() {
    const userId = getUserId();
    const savedVariant = localStorage.getItem("ab_variant");

    if (savedVariant) {
        return savedVariant;
    }

    let hash = 0;
    const value = userId + flags.EXPERIMENT_NAME;

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }

    const variant = (hash % 100) < flags.EXPERIMENT_SPLIT ? "A" : "B";

    localStorage.setItem("ab_variant", variant);
    return variant;
}

const variant = assignVariant();

// 이벤트 기록
function trackEvent(eventName, details = {}) {
    const events = JSON.parse(localStorage.getItem("experiment_events") || "[]");

    events.push({
        userId: getUserId(),
        variant: variant,
        event: eventName,
        details: details,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem("experiment_events", JSON.stringify(events));
}

// Feature Flag 적용
function initializeFeatures() {
    if (flags.FLAG_DARK_MODE) {
        document.body.classList.add("dark-mode");
    }

    document.getElementById("scientific-section").style.display =
        flags.FLAG_SCIENTIFIC ? "block" : "none";

    document.getElementById("history-section").style.display =
        flags.FLAG_HISTORY ? "block" : "none";

    document.getElementById("variant-info").textContent =
        "현재 A/B 테스트 버전: " + variant;

    const button = document.getElementById("calculate-button");

    if (variant === "A") {
        button.textContent = "계산하기";
    } else {
        button.textContent = "결과 확인하기";
    }

    trackEvent("experiment_assigned", {
        experiment: flags.EXPERIMENT_NAME,
        variant: variant
    });
}

// 계산 기능
function calculate() {
    const input1 = document.getElementById("num1").value;
    const input2 = document.getElementById("num2").value;

    const num1 = Number(input1);
    const num2 = Number(input2);
    const operator = document.getElementById("operator").value;

    if (input1 === "" || input2 === "") {
        alert("숫자를 모두 입력해 주세요.");
        return;
    }

    let result;

    switch (operator) {
        case "add":
            result = num1 + num2;
            break;
        case "subtract":
            result = num1 - num2;
            break;
        case "multiply":
            result = num1 * num2;
            break;
        case "divide":
            if (num2 === 0) {
                alert("0으로 나눌 수 없습니다.");
                return;
            }
            result = num1 / num2;
            break;
        default:
            return;
    }

    document.getElementById("result").textContent = "결과: " + result;

    trackEvent("calculation", {
        num1: num1,
        num2: num2,
        operator: operator,
        result: result
    });

    if (flags.FLAG_HISTORY) {
        saveHistory(num1, operator, num2, result);
    }
}

// 계산 기록 저장
function saveHistory(num1, operator, num2, result) {
    const history = JSON.parse(localStorage.getItem("calculator_history") || "[]");

    history.unshift(`${num1} ${operator} ${num2} = ${result}`);

    localStorage.setItem("calculator_history", JSON.stringify(history.slice(0, 10)));

    displayHistory();
}

// 계산 기록 화면 표시
function displayHistory() {
    const history = JSON.parse(localStorage.getItem("calculator_history") || "[]");
    const list = document.getElementById("history-list");

    list.innerHTML = "";

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

// 공학용 계산 기능
function calculateSquare() {
    if (!flags.FLAG_SCIENTIFIC) return;

    const input = document.getElementById("scientific-number").value;

    if (input === "") {
        alert("숫자를 입력해 주세요.");
        return;
    }

    const value = Number(input);
    const result = value * value;

    document.getElementById("scientific-result").textContent =
        "제곱 결과: " + result;

    // 실험 이벤트 기록
    trackEvent("scientific_calculation", {
        operation: "square",
        input: value,
        result: result
    });

    // 계산 기록에 추가
    const history = JSON.parse(
        localStorage.getItem("calculator_history") || "[]"
    );

    history.unshift(`${value}² = ${result}`);

    localStorage.setItem(
        "calculator_history",
        JSON.stringify(history.slice(0, 10))
    );

    displayHistory();
}

// 실험 로그 다운로드
function downloadEvents() {
    const events = JSON.parse(localStorage.getItem("experiment_events") || "[]");

    const blob = new Blob(
        [JSON.stringify(events, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "experiment-events.json";
    link.click();

    URL.revokeObjectURL(url);
    trackEvent("event_log_downloaded");
}

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
    initializeFeatures();
    displayHistory();

    document.getElementById("calculate-button").addEventListener("click", () => {
    trackEvent("calculate_button_clicked");
    calculate();
});

    document.getElementById("download-events").addEventListener("click", downloadEvents);
});