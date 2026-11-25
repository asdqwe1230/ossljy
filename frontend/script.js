
function calculate() {
    const num1 = Number(document.getElementById("num1").value);
    const num2 = Number(document.getElementById("num2").value);
    const operator = document.getElementById("operator").value;

    let result;

    if (document.getElementById("num1").value === "" ||
        document.getElementById("num2").value === "") {
        alert("숫자를 모두 입력해 주세요.");
        return;
    }

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
    }

    document.getElementById("result").textContent = "결과: " + result;
}
