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
        marginY = 150;
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
        markerY = 'p, Па';
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

    
    while (res.t){
        if (!anim){
            await sleep(1)
        }
        else{
            selectedData = par === "H"? res.Napory.shift(): par === "S"? res.Skorosty.shift():res.Davleniya.shift();
            console.log(selectedData)
            updateGraph(selectedData, colorOfLine);
            timeLabel = d3.select('.labelTime')
                        .text('t = ' + res.t.shift().toFixed(2)+ 'c');
            await sleep(100)
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
    }
}

