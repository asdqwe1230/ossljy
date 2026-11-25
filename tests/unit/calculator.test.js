
const fs = require("fs");
const vm = require("vm");

const {
    add,
    subtract,
    multiply,
    divide,
    square,
    addHistory
} = require("../../frontend/calculator");

describe("계산기 단위 테스트", () => {

    test("덧셈: 10 + 5 = 15", () => {
        expect(add(10, 5)).toBe(15);
    });

    test("뺄셈: 10 - 5 = 5", () => {
        expect(subtract(10, 5)).toBe(5);
    });

    test("곱셈: 10 * 5 = 50", () => {
        expect(multiply(10, 5)).toBe(50);
    });

    test("나눗셈: 10 / 5 = 2", () => {
        expect(divide(10, 5)).toBe(2);
    });

    test("0으로 나누면 오류가 발생한다", () => {
        expect(() => divide(10, 0))
            .toThrow("0으로 나눌 수 없습니다.");
    });

    test("제곱: 5의 제곱은 25", () => {
        expect(square(5)).toBe(25);
    });

    test("새로운 계산 기록은 가장 앞에 추가된다", () => {
        expect(addHistory(["10 + 5 = 15"], "5 - 2 = 3"))
            .toEqual(["5 - 2 = 3", "10 + 5 = 15"]);
    });

    test("계산 기록은 최대 10개까지만 유지한다", () => {
        const history = Array.from(
            { length: 10 },
            (_, i) => `기록 ${i + 1}`
        );

        expect(addHistory(history, "새 기록")).toHaveLength(10);
    });

    test("브라우저 환경에서도 CalculatorCore를 사용할 수 있다", () => {
        const source = fs.readFileSync(
            require.resolve("../../frontend/calculator"),
            "utf8"
        );

        const browserContext = {
            window: {}
        };

        vm.runInNewContext(source, browserContext);

        expect(
            browserContext.window.CalculatorCore.add(2, 3)
        ).toBe(5);
    });

    test("module.exports가 비어 있어도 브라우저 방식으로 내보낸다", () => {
    const source = fs.readFileSync(
        require.resolve("../../frontend/calculator"),
        "utf8"
    );

    const browserContext = {
        window: {},
        module: {
            exports: null
        }
    };

    vm.runInNewContext(source, browserContext);

    expect(
        browserContext.window.CalculatorCore.add(3, 4)
    ).toBe(7);
    });

    test("window가 존재하는 환경에서도 계산기 모듈을 사용할 수 있다", () => {
    global.window = {};

    try {
        jest.isolateModules(() => {
            const calculator = require("../../frontend/calculator");

            expect(calculator.add(3, 4)).toBe(7);
        });
    } finally {
        delete global.window;
    }
});
    test("덧셈은 음수도 올바르게 계산한다", () => {
    expect(add(-10, 5)).toBe(-5);
    });

});
