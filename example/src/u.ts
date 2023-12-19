// javascript file to avoid compilation and make debugging easier
export const u = (expr: string, number: number) => {
  // contrived branching logic for code coverage
  switch (expr) {
    case "cat":
      const cat = "yay cat";
      const result = cat + "1";
      return result;
    case "dog":
      const dog = "yay dog";
      if (number > 0) return dog;
      else return "boo";
    default:
      return "defaulted";
  }
};
