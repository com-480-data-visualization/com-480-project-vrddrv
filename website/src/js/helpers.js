export function shortenCourseName(name) {
  return name
    .split(" ")
    .map(function (d) {
      switch (d.toLowerCase()) {
        case "and":
          return "&";
        case "a":
          return "";
        case "of":
          return "";
        case "for":
          return "";
        case "in":
          return "";
        default:
          return d[0];
      }
    })
    .join("")
    .toUpperCase();
}

export function getProgramName(program, sep = " ") {
  switch (program) {
    case "Master SC_DS":
      return ["data", "science"].join(sep);
    case "Master IN":
      return ["computer", "science"].join(sep);
    default:
      return ["data", "science"].join(sep);
  }
}

export function getSemesterProject(program, sep = " ") {
  switch (program) {
    case "Master SC_DS":
      return `projet de semestre en data science`;
    case "Master IN":
      return "project in computer science ii";
    default:
      return `projet de semestre en data science`;
  }
}


export function zip(arrays) {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i];
    });
  });
}
