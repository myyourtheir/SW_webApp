const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };  
///////////////////////////////////////////////////////////////////////////////////////////////////////////

let hChart = {
    markerY: 'H, м',
    colorOfLine : 'red',
    minVal : 600,
    maxVal : -200,
    marginTop: 175,
};

let pChart = {
    markerY: 'p, МПа',
    colorOfLine : 'green',
    minVal : 5,
    maxVal : -2,
    marginTop : 520,
};

let sChart = {
    markerY : 'V, м/c',
    colorOfLine : 'steelblue',
    minVal : 5,
    maxVal : -1,
    marginTop : 885,
};


const drawCharts = async (res) => {

    let margin1 = {right: 100, bottom: 40, left: 100 };
    
    const width = parseInt(x)-margin1.left;
    const height = 300;
    
    var scaleX = d3.scaleLinear()
                    // .domain([d3.min(res.x),d3.max(res.x)])
                    .range([0, width]);



    var scaleYH = d3.scaleLinear()
                    .domain([hChart.maxVal, hChart.minVal])
                    .range([height, 0]);
    
    var scaleYP = d3.scaleLinear()
                    .domain([pChart.maxVal, pChart.minVal])
                    .range([height, 0]);

    var scaleYS = d3.scaleLinear()
                    .domain([sChart.maxVal, sChart.minVal])
                    .range([height, 0]);

    const lineH = d3.line()
                .x(d => scaleX(d.x))
                .y(d => scaleYH(d.y));
    
    const lineP = d3.line()
                .x(d => scaleX(d.x))
                .y(d => scaleYP(d.y));
    
    const lineS = d3.line()
                .x(d => scaleX(d.x))
                .y(d => scaleYS(d.y));

    var svgH = d3.select("#mainSVG")
        .append("svg")
            .attr("class", "charts")
            .attr("width", width + margin1.left + margin1.right)
            .attr("height", height + hChart.marginTop + margin1.bottom)
        .append("g")
            .attr("transform", `translate(${margin1.left},${hChart.marginTop})`);

    var svgP = d3.select("#mainSVG")
            .append("svg")
                .attr("class", "charts")
                .attr("width", width + margin1.left + margin1.right)
                .attr("height", height + pChart.marginTop + margin1.bottom)
            .append("g")
                .attr("transform", `translate(${margin1.left},${pChart.marginTop})`);

    var svgS = d3.select("#mainSVG")
                .append("svg")
                    .attr("class", "charts")
                    .attr("width", width + margin1.left + margin1.right)
                    .attr("height", height + sChart.marginTop + margin1.bottom)
                .append("g")
                    .attr("transform", `translate(${margin1.left},${sChart.marginTop})`);

    const tooltip = d3.select(".workSpace")
        .append("div")
            .attr("class", "tooltip");

    if (x<=200){
        var xAxis = d3.axisBottom(scaleX)
                    .ticks(3, ".0f");
    }
    else{
        var xAxis = d3.axisBottom(scaleX)
                    .ticks(5, ".0f");
    }
    var yAxisH = d3.axisLeft(scaleYH)
                .ticks(10);

    var yAxisP = d3.axisLeft(scaleYP)
                .ticks(10);
    
    var yAxisS = d3.axisLeft(scaleYS)
                .ticks(10);
                

    svgH.append("g")       
        .attr("class", "x-axis")
        .attr("transform",  // сдвиг оси вниз и вправо
        `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width + 30)
        .attr("y", 5)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text('x, м');

    svgP.append("g")       
        .attr("class", "x-axis")
        .attr("transform",  // сдвиг оси вниз и вправо
        `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width + 30)
        .attr("y", 5)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text('x, м');
    
    svgS.append("g")       
        .attr("class", "x-axis")
        .attr("transform",  // сдвиг оси вниз и вправо
        `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width + 30)
        .attr("y", 5)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text('x, м');
        
    svgH.append("g")       
        .attr("class", "y-axis")
        .call(yAxisH)
        .append("text")
        .attr("x", -20)
        .attr("y", -10)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(hChart.markerY);

    svgP.append("g")       
        .attr("class", "y-axis")
        .call(yAxisP)
        .append("text")
        .attr("x", -20)
        .attr("y", -10)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(pChart.markerY);
    
    svgS.append("g")       
        .attr("class", "y-axis")
        .call(yAxisP)
        .append("text")
        .attr("x", -20)
        .attr("y", -10)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(sChart.markerY);
    
    
    svgH.append("text")
        .attr('class', 'labelTime')
        .attr("x", width)
        .attr("y", 0 )
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(0);
    
    svgH.append('path')
        .attr('class', 'lineH');

    svgP.append('path')
        .attr('class', 'lineP');

    svgS.append('path')
        .attr('class', 'lineS');
    
    const circleH = svgH.append("circle")
        .attr("r", 0)
        .attr("fill", "black")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    const circleP = svgP.append("circle")
        .attr("r", 0)
        .attr("fill", "black")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    const circleS = svgS.append("circle")
        .attr("r", 0)
        .attr("fill", "black")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");


    const listeningRectH = svgH.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "rect") 
    
    const listeningRectP = svgP.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "rect")

    const listeningRectS = svgS.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "rect")
    



    let iter_data =0;
    while (iter_data<=fullData.t.length-2){
        if (!anim){
            await sleep(1)
        }
        else{
            
            updateGraph('H', hChart.colorOfLine, svgH, '.lineH', lineH, listeningRectH);
            updateGraph('P', pChart.colorOfLine, svgP, '.lineP', lineP, listeningRectP);
            updateGraph('S', sChart.colorOfLine, svgS, '.lineS', lineS, listeningRectS);
            timeLabel = d3.select('.labelTime')
                        .text('t = ' + res.t[iter_data].toFixed(2)+ 'c');
            iter_data++;
            await sleep(50)
        }
    };

    
    function updateGraph(par, colorOfLine, svg, line, linePer, listeningRect) {
        data = par === "H"? res.Napory[iter_data]: par === "P"? res.Davleniya[iter_data]:res.Skorosty[iter_data];

        
        // Update the domains
        scaleX.domain(d3.extent(data, d => d.x));
        // scaleY.domain(d3.extent(data, d => d.y));
      
        // Update the axes
        svg.select('.x-axis')
          .call(xAxis);
      
        // svg.select('.y-axis')
        //   .call(yAxisH);
      
        // Update the line path
        svg.select(line)
          .datum(data)
          .attr('d', linePer)
            .attr("fill", "none")
            .attr("stroke", colorOfLine)
            .attr("stroke-width", 2);

        listeningRect.on("mousemove", function (event) {
            let [xCoord] = d3.pointer(event, this);
            let bisectX = d3.bisector(d => d.x).left;
            let x0 = scaleX.invert(xCoord);
            let i = bisectX(data, x0, 1);
            let d0H = res.Napory[iter_data][i - 1];
            let d1H = res.Napory[iter_data][i];
            let d0P = res.Davleniya[iter_data][i - 1];
            let d1P = res.Davleniya[iter_data][i];
            let d0S = res.Skorosty[iter_data][i - 1];
            let d1S = res.Skorosty[iter_data][i];
            let dH = x0 - d0H.x > d1H.x - x0 ? d1H : d0H;
            let dP = x0 - d0H.x > d1H.x - x0 ? d1P : d0P;
            let dS = x0 - d0H.x > d1H.x - x0 ? d1S : d0S;
            let xPos = scaleX(dH.x);
            let yPosH = scaleYH(dH.y);
            let yPosP = scaleYP(dP.y);
            let yPosS = scaleYS(dS.y);
            
            // let d = par==="H"? (x0 - d0H.x > d1H.x - x0 ? d1H : d0H): par==="P" ? (x0 - d0P.x > d1P.x - x0 ? d1P : d0P): x0 - d0S.x > d1S.x - x0 ? d1S : d0S;
    
        // Update the circle position
    
            circleH.attr("cx", xPos)
            .attr("cy", yPosH);
    
            circleP.attr("cx", xPos)
            .attr("cy", yPosP);
            // Add transition for the circle radius
            
            circleS.attr("cx", xPos)
            .attr("cy", yPosS);

            circleH.transition()
            .duration(50)
            .attr("r", 4);

            circleP.transition()
            .duration(50)
            .attr("r", 4);

            circleS.transition()
            .duration(50)
            .attr("r", 4);
    
            // add in  our tooltip
    
            tooltip
                .style("display", "block")
                .style("left", `${xPos + 150}px`)
                .style("top", `${par ==="H"? yPosH + 50: par ==="P"? yPosP + pChart.marginTop -125: yPosS + sChart.marginTop -125 }px`)
                .html(`<strong>Координата: </strong> ${dH.x/1000} км<br><strong>Напор: </strong> ${dH.y !== undefined ? (dH.y).toFixed(0) + " м": 'N/A'}<br><strong>Давление: </strong>${dP.y !== undefined ? (dP.y).toFixed(2) + " МПа": 'N/A'} <br><strong>Скорость: </strong>${dS.y !== undefined ? (dS.y).toFixed(2) + " м/с": 'N/A'}`)
        });
            listeningRect.on("mouseleave", function () {
                circleH.transition()
                .duration(50)
                .attr("r", 0);
                circleP.transition()
                .duration(50)
                .attr("r", 0);
                circleS.transition()
                .duration(50)
                .attr("r", 0);
            
            tooltip.style("display", "none");
            });
    };
}