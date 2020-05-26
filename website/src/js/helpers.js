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
    case "Master SC_CS":
      return ["computer", "science"].join(sep);
    default:
      return ["data", "science"].join(sep);
  }
}
