
const { test } = require("node:test");
const assert = require("node:assert");
const calculator = require("./index");

test("덧셈 테스트", () => {
  assert.strictEqual(calculator.add(10, 5), 15);
});

test("뺄셈 테스트", () => {
  assert.strictEqual(calculator.subtract(10, 5), 5);
});

test("곱셈 테스트", () => {
  assert.strictEqual(calculator.multiply(10, 5), 50);
});

test("나눗셈 테스트", () => {
  assert.strictEqual(calculator.divide(10, 5), 2);
});

test("0으로 나누면 오류 발생", () => {
  assert.throws(() => calculator.divide(10, 0));
});
