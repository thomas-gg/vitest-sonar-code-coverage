export const divide = (x: number, y: number): number => {
  // contrived branching logic for code coverage
  if (x > 5) {
    return x / y;
  } else if (x > y) {
    return x / y;
  } else {
    return x / y;
  }
};
