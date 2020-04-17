// window.onhashchange = function() {
//
// };

var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
let queries = queryString.split("&");

console.log(queries);

d3
.select("#p1")
.text(queries[0].substring(6,queries[0].length) + ' page');

let qc = d3.select("svg#container");
qc.append("text")
    .attr("x", 500)//padding of 4px
    .attr("y", 600)
    .text(queries[0].substring(6,queries[0].length));