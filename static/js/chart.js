const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };  


const drawChart = async (res, par) => {
    let markerY = NaN;
    let colorOfLine =NaN;
    let marginY = NaN;
    let t = 0;
    if (par==='H'){
        markerY = 'H, м';
        colorOfLine = 'red';
        marginY = 175;
        minVal = 600 ;
        maxVal = -200;
        
    };
    if (par==='S'){
        markerY = 'V, м/c';
        colorOfLine = 'steelblue';
        marginY = -10;
        minVal = 5 ;
        maxVal = -1 ;
        
    };
    if (par==='P'){
        markerY = 'p, МПа';
        colorOfLine = 'green';
        marginY = -10;
        minVal = 5;
        maxVal = -2;
        
       
    };

    var height = 300, 
    width = x, 
    margin= 30;

    // 1 chart(H)
    
    var height = 300, 
    width = x, 
    margin= 30;
    
    

    var svg = d3.select(".workSpace")
        .append("svg")
        .attr("class", "axis")
        .attr("width", width + 100)
        .attr("height", height + marginY);

    var xAxisLength = width - 100;
    var yAxisLength = height - 2 * margin;

    var scaleX = d3.scaleLinear()
                    // .domain([d3.min(res.x),d3.max(res.x)])
                    .range([0, xAxisLength]);

    var scaleY = d3.scaleLinear()
                    .domain([maxVal, minVal])
                    .range([yAxisLength, 0]);
    if (x<=200){
        var xAxis = d3.axisBottom(scaleX)
                    .ticks(3, ".0f");
    }
    else{
        var xAxis = d3.axisBottom(scaleX)
                    .ticks(5, ".0f");
    }
    var yAxis = d3.axisLeft(scaleY)
                .ticks(10);

    svg.append("g")       
        .attr("class", "x-axis")
        .attr("transform",  // сдвиг оси вниз и вправо
            "translate(" +  100 + "," + (height + marginY - margin)+ ")")
        .call(xAxis)
        .append("text")
        .attr("x", width - margin - 40)
        .attr("y", 5)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text('x, м');
        

    svg.append("g")       
        .attr("class", "y-axis")
        .attr("transform", // сдвиг оси вниз и вправо на margin
                "translate(" + 100 + "," + (margin + marginY) + ")")
        .call(yAxis)
        .append("text")
        .attr("x", margin - 40)
        .attr("y", margin - 40)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(markerY);
    if (par==='H'){
    svg.append("text")
        .attr('class', 'labelTime')
        .attr("x", width)
        .attr("y", marginY + margin)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(t);
    }
    
    svg.append('path')
        .attr('class', 'line');

    const line = d3.line()
    .x(d => scaleX(d.x)+100)
    .y(d => scaleY(d.y)+margin + marginY);

       
    let i =0;
    while (res.t){
        if (!anim){
            await sleep(1)
        }
        else{
            selectedData = par === "H"? res.Napory[i]: par === "S"? res.Skorosty[i]:res.Davleniya[i];
            updateGraph(selectedData, colorOfLine);
            timeLabel = d3.select('.labelTime')
                        .text('t = ' + res.t[i].toFixed(2)+ 'c');
            i++;
            await sleep(50)
        }
    };

    
    function updateGraph(newData, colorOfLine) {
        data = newData;
      
        // Update the domains
        scaleX.domain(d3.extent(data, d => d.x));
        // scaleY.domain(d3.extent(data, d => d.y));
      
        // Update the axes
        svg.select('.x-axis')
          .call(xAxis);
      
        svg.select('.y-axis')
          .call(yAxis);
      
        // Update the line path
        svg.select('.line')
          .datum(data)
          .attr('d', line)
            .attr("fill", "none")
            .attr("stroke", colorOfLine)
            .attr("stroke-width", 2);
    };
}

//  // Define the tooltip element
//  var tooltip = d3.select("#mainSVG")
//     .append("div")
//     .attr("id", "tooltip")
//     .style("display", "none");

// // Define the tooltip content
// var tooltipContent = function(d) {
//     return "X: " + d.x + "<br/>Y: " + d.y;
// };

// // Attach the mouseover event to the line chart data points
// d3.select("path.line")
//     .on("mouseover", function(d) {
//         tooltip.html(tooltipContent(d))
//             .style("display", "block")
//             .style("left", (d3.event.pageX + 10) + "px")
//             .style("top", (d3.event.pageY - 10) + "px");
// })
//     .on("mouseout", function(d) {
//         tooltip.style("display", "none");
// });

// var tooltip2 = d3.select(".axis")
//   .append("div")
//     .style("position", "absolute")
//     .style("visibility", "hidden")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "1px")
//     .style("border-radius", "5px")
//     .style("padding", "10px")
//     .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>");

// d3.select("path.line")
//         .on("mouseover", function(){return tooltip2.style("visibility", "visible");})
//         .on("mousemove", function(){return tooltip2.style("top", (event.pageY-2390)+"px").style("left",(event.pageX-800)+"px");})
//         .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});

