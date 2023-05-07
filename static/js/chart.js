const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };  
///////////////////////////////////////////////////////////////////////////////////////////////////////////

const drawCharts = async (res, par) => {


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

    let margin1 = {right: 100, bottom: 40, left: 100 };
    
    const width = parseInt(x)-margin1.left;
    const height = 300;
    
    // 1 chart(H)
    var scaleX = d3.scaleLinear()
                    // .domain([d3.min(res.x),d3.max(res.x)])
                    .range([0, width]);

    var scaleY = d3.scaleLinear()
                    .domain([hChart.maxVal, hChart.minVal])
                    .range([height, 0]);
    
    const line = d3.line()
                .x(d => scaleX(d.x))
                .y(d => scaleY(d.y));

    var svg = d3.select("#mainSVG")
        .append("svg")
            .attr("class", "charts")
            .attr("width", width + margin1.left + margin1.right)
            .attr("height", height + hChart.marginTop + margin1.bottom)
        .append("g")
            .attr("transform", `translate(${margin1.left},${hChart.marginTop})`);
        

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
    var yAxis = d3.axisLeft(scaleY)
                .ticks(10);

    svg.append("g")       
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
        
    svg.append("g")       
        .attr("class", "y-axis")
        .call(yAxis)
        .append("text")
        .attr("x", -20)
        .attr("y", -10)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(hChart.markerY);
    
    
    svg.append("text")
        .attr('class', 'labelTime')
        .attr("x", width)
        .attr("y", 0 )
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style('fill', 'black')
        .text(0);
    
    svg.append('path')
        .attr('class', 'line');

    const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "black")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "rect")
    
    



    let iter_data =0;
    while (iter_data<=fullData.t.length-2){
        if (!anim){
            await sleep(1)
        }
        else{
            selectedData = par === "H"? res.Napory[iter_data]: par === "S"? res.Skorosty[iter_data]:res.Davleniya[iter_data];
            updateGraph(selectedData, hChart.colorOfLine);
            timeLabel = d3.select('.labelTime')
                        .text('t = ' + res.t[iter_data].toFixed(2)+ 'c');
            iter_data++;
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

        listeningRect.on("mousemove", function (event) {
            let [xCoord] = d3.pointer(event, this);
            let bisectX = d3.bisector(d => d.x).left;
            let x0 = scaleX.invert(xCoord);
            let i = bisectX(data, x0, 1);
            let d0 = data[i - 1];
            let d1 = data[i];
            let d = x0 - d0.x > d1.x - x0 ? d1 : d0;
            let xPos = scaleX(d.x);
            let yPos = scaleY(d.y);
            
    
    
        // Update the circle position
    
            circle.attr("cx", xPos)
            .attr("cy", yPos);
    
            // Add transition for the circle radius
    
            circle.transition()
            .duration(50)
            .attr("r", 4);
    
            // add in  our tooltip
    
            tooltip
                .style("display", "block")
                .style("left", `${xPos + 100}px`)
                .style("top", `${yPos + 50}px`)
                .html(`<strong>Координата: </strong> ${d.x/1000} км<br><strong>Напор: </strong> ${d.y !== undefined ? (d.y).toFixed(0) + " м": 'N/A'}`)
        });
            listeningRect.on("mouseleave", function () {
                circle.transition()
                .duration(50)
                .attr("r", 0);
            
            tooltip.style("display", "none");
            });
    };
}