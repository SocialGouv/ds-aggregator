//

import {
  asArray,
  asNumber,
  asTimestamp
} from "../../../src/util/converter/converter";

//

describe("asTimestamp", () => {
  it.each`
    input                         | date
    ${"1970-01-01T00:00:00.000Z"} | ${new Date(0)}
  `("returns '$date' for Date('$input')", ({ input, date }) => {
    expect(asTimestamp(input)).toEqual(date.getTime());
  });

  it("shuold return null with no arguments", () => {
    expect(asTimestamp()).toBeNull();
  });
});

describe("asArray", () => {
  it.each`
    input       | array
    ${""}       | ${[""]}
    ${"1"}      | ${["1"]}
    ${"12"}     | ${["12"]}
    ${"12.3"}   | ${["12.3"]}
    ${"12.3,4"} | ${["12.3", "4"]}
  `("returns '$array' for '$input'", ({ input, array }) => {
    expect(asArray(input)).toEqual(array);
  });

  it("shuold return empty array with no arguments", () => {
    expect(asArray()).toEqual([]);
    expect(asArray(null)).toEqual([]);
  });
});

describe("asNumber", () => {
  it.each`
    input         | number
    ${"123"}      | ${123}
    ${"-123"}     | ${-123}
    ${"Infinity"} | ${NaN}
    ${"4321e+"}   | ${4321}
    ${"4321hop"}  | ${4321}
  `("returns '$number' for '$input'", ({ input, number }) => {
    expect(asNumber(input, 42)).toBe(number);
  });
  it("shuold return NaN value if not numeric", () => {
    expect(asNumber("", 42)).toBeNaN();
  });
  it("shuold return default value if undefined", () => {
    expect(asNumber(undefined, 42)).toBe(42);
  });
});
