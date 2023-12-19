// javascript file to avoid compilation and make debugging easier
export const v = (x: number, y: number) => {
  // contrived branching logic for code coverage
  if (x < 5) {
    return x + y;
  } else if (y < 5 || x > 20) {
    let cat = 2 + y;
    cat += x;
    return cat;
  } else {
    return x + y;
  }
};
