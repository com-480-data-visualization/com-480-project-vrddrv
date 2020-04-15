'use strict';


const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const TRANSITION_TIME_SCALE = 900;

const CIRC_PLOT_RADIUS = 30;
const OUTER_PLOT_RADIUS = 80;

//TODO: 120 should be parsed
const MAX_NUMBER_CREDITS = 120;
const VALID_BLOCK_NAMES = {'Group 1': 'class_core', 
                           'Options': 'class_optional', 
                           'SHS"'   : 'class_shs'};
const VALID_SESSION_DATES = ['02.2020', '02.2019'];


function dragOverHandler(ev) {
  ev.preventDefault(); // Prevents file from being opened on drop
}


function dropHandler(ev) {
  ev.preventDefault();

  if (ev.dataTransfer.items && ev.dataTransfer.items[0].kind === 'file') {
    var file = ev.dataTransfer.items[0].getAsFile();
    file.text().then(extractDataFromPDF);
  }
}


function extractDataFromPDF(pdfData) {
  var pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.js';

  // Load binary data from the obtained file
  var loadingTask = pdfjsLib.getDocument({data: pdfData});
  loadingTask.promise.then(function(pdfInstance) {
    console.log('PDF loaded');
    
    // TODO: Now we work only with the first page!
    pdfInstance.getPage(1).then( (pdfPage) => {
      pdfPage.getTextContent().then(function (textContent) {

        var parsedData = itemsPDFToDataInstance(textContent.items);
        
        console.log("Parsed data: ", parsedData)

        let circularPlot = new CircularPlot(parsedData);
      });
    });
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });
}


function itemsPDFToDataInstance(itemsArray) {
  let classesData = [];
  let currentBlock;

  for (let idx = 0; idx < itemsArray.length; idx++) {

    // Keep track of current block
    if ( Object.keys(VALID_BLOCK_NAMES).includes(itemsArray[idx].str) ) {
      currentBlock = VALID_BLOCK_NAMES[itemsArray[idx].str];
    }

    // Detect subject line by session date
    if ( VALID_SESSION_DATES.includes(itemsArray[idx].str) ) {
      let name='', 
          form=itemsArray[idx - 2].str;
      // TODO: now name is extracted in a very unrobust way:
      // 1. Check if it was attached to the form item
      let split = form.split(' ');
      if (split.length > 0) {
        name = split.slice(0, -1).join(' ');
        form = split[split.length - 1];
      }

      // 2. Take next left item while name has small letter first
      let nameIdx = idx - 1;
      while ( (name === '' || name[0] == name[0].toLowerCase() ) && nameIdx > 2) {
        name = itemsArray[nameIdx - 2].str + ' ' + name;
        nameIdx -= 1;
      }

      var subject = {
        name:      name,
        form:      form,
        lang:      itemsArray[idx - 1].str,
        sdate:     itemsArray[idx].str,
        grade:     Number.parseFloat(itemsArray[idx + 1].str),
        creditsOf: Number.parseInt(itemsArray[idx + 2].str),
        credits:   Number.parseInt(itemsArray[idx + 3].str),
        block:     currentBlock
      };

      classesData.push(subject);
    }
  }

  return classesData;
}


class DropZone {
  constructor() {
    let dropZone = d3.select('svg#plot')
                     .append('g')
                     .attr('id', 'drop_zone');

    dropZone.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', CANVAS_WIDTH)
            .attr('height', CANVAS_HEIGHT);

    dropZone.append('text')
            .attr('x', CANVAS_WIDTH / 2)
            .attr('y', CANVAS_HEIGHT / 2)
            .text('Drop your Transcript here');

    dropZone.attr('ondrop', 'dropHandler(event)')
            .attr('ondragover', 'dragOverHandler(event)')
            .on('mouseover', function(d, i) {
              d3.select(this).attr('opacity', '0.8');
            })
            .on('mouseout', function(d, i) {
              d3.select(this).attr('opacity', '1.0');
            });
  }
}


class CircularPlot {
  constructor(data) {

    // To make the plot more interesting
    // shuffleArray(data);

    this.total_credits = 0; //data.reduce((v, t) => v + t.credits, 0);
    for (let idx=0; idx < data.length; idx++) {
      data[idx].creditsBefore = this.total_credits;
      this.total_credits += data[idx].credits;
    }

    this.gpa = data.reduce((t, v) => t + v.credits * v.grade, 0) / this.total_credits;

    this.arcGenerator = d3.arc()
                          .innerRadius(CIRC_PLOT_RADIUS)
                          .cornerRadius(2)
                          .outerRadius((d) => d.grade * OUTER_PLOT_RADIUS / 6)
                          .startAngle((d) => - d.creditsBefore * 2 * Math.PI / MAX_NUMBER_CREDITS)
                          .endAngle((d) => - (d.creditsBefore + d.credits) 
                                            * 2 * Math.PI / MAX_NUMBER_CREDITS);

    // Delete Everything from the plot
    d3.select('svg#plot > *').remove();

    let circPlot = d3.select('svg#plot')
                     .append('g')
                     .attr('id', 'circular_plot');
    
    let сorePlot = circPlot.append('g')
                           .attr('id', 'circular_plot_core')
                          
    сorePlot.append('circle')
            .attr('cx', CANVAS_WIDTH / 2)
            .attr('cy', CANVAS_HEIGHT / 2)
            .attr('r', CIRC_PLOT_RADIUS);
    
    сorePlot.append('text')
            .attr('id', 'GPA')
            .attr('x', CANVAS_WIDTH / 2)
            .attr('y', CANVAS_HEIGHT / 2 - CIRC_PLOT_RADIUS / 2)
            .text('GPA: ' + this.gpa.toPrecision(3).toString())
            .attr('style', 'font-size: 5px');
    
    сorePlot.append('text')
            .attr('id', 'total_credits')
            .attr('x', CANVAS_WIDTH / 2)
            .attr('y', CANVAS_HEIGHT / 2 + CIRC_PLOT_RADIUS / 2)
            .text('Credits: ' + this.total_credits.toString())
            .attr('style', 'font-size: 5px');

    circPlot.selectAll("path")
            .data(data)
            .enter()
            .append('path')
            .attr('d', this.arcGenerator)
            .attr('transform', `translate(${CANVAS_WIDTH / 2}, ${CANVAS_HEIGHT / 2})`)
            .attr("class", (d) => "petal " + d.block)
            .on('mouseover', function(d, i) {
              d3.select(this).attr('opacity', '0.8');
            })
            .on('mouseout', function(d, i) {
              d3.select(this).attr('opacity', '1.0');
            });
    
    circPlot.attr('transform', `matrix(0,0,0,0,${CANVAS_WIDTH / 2},${CANVAS_HEIGHT / 2})`)
            .transition()
            .duration(TRANSITION_TIME_SCALE)
            .attr('transform', 'matrix(1,0,0,1,0,0)');
    
  }
}


function whenDocumentLoaded(action) {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', action);
	} else {
		action();
	}
}


whenDocumentLoaded( () => {
  new DropZone();
});


function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}