(function (root, factory) {
    const calculator = factory();

    /* istanbul ignore next */
    if (typeof module === "object" && module.exports) {
        module.exports = calculator;
    } else {
        root.CalculatorCore = calculator;
    }

})(typeof window !== "undefined" ? window : globalThis, function () {

    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    function multiply(a, b) {
        return a * b;
    }

    function divide(a, b) {
        if (b === 0) {
            throw new Error("0으로 나눌 수 없습니다.");
        }

        return a / b;
    }

    function square(a) {
        return a * a;
    }

    function addHistory(history, newRecord) {
        return [newRecord, ...history].slice(0, 10);
    }

    return {
        add,
        subtract,
        multiply,
        divide,
        square,
        addHistory
    };
});