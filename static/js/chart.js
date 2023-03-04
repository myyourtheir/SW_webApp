const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };  


const drawChart = async(res, resY, marginY, par) => {
    let markerY = NaN;
    let colorOfLine =NaN;
    let t = 0;
    let dt = res.dt;
    if (par==='H'){
        markerY = 'H, м';
        colorOfLine = 'red';
        minVal = res.min_val[0] - 50;
        maxVal = res.max_val[0] + 50;
        
    };
    if (par==='S'){
        markerY = 'V, м/c';
        colorOfLine = 'steelblue';
        minVal = res.min_val[2] - 1;
        maxVal = res.max_val[2] + 1;
    };
    if (par==='P'){
        markerY = 'p, Па';
        colorOfLine = 'green';
        minVal = res.min_val[1] - 1000000;
        maxVal = res.max_val[1] + 1000000;
    };

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
                    .domain([d3.min(res.x),d3.max(res.x)])
                    .range([0, xAxisLength]);

    var scaleY = d3.scaleLinear()
                    .domain([maxVal, minVal])
                    .range([0, yAxisLength]);
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
    if (par ==="H"){
        svg.append("text")
            .attr('class', 'labelTime')
            .attr("x", width)
            .attr("y", marginY + margin)
            .attr("text-anchor", "end")
            .style("font-size", "14px")
            .style('fill', 'black')
            .text(t);
    }
    let fullData = [];
    for (let j = 0; j < res.Napory.length; j++){

        let dataMoment = []
        for(i=0; i<res.x.length; i++){
                    dataMoment.push({x: scaleX(res.x[i])+100, y: scaleY(resY[j][i]) +margin + marginY});
        };
        fullData.push(dataMoment)
    };

    for(let iter = 0; iter<= fullData.length-1;){

        if (!anim) {
            await sleep(1)
        }
        else{
            updateLine(fullData[iter], colorOfLine)
                timeLabel = d3.select('.labelTime')
                            .text('t = ' + t.toFixed(2)+ 'c')
                t+=dt
        iter+=1;
        await sleep(50)
        }
    };
    
    

        

    
    
    function updateLine (data, colorOfLine){
          
        var u = svg.selectAll(".lineTest")
            .data([data], function(d){ return {x :d.x, y: d.y}});

        u
        .enter()
        .append("path")
        .attr("class","lineTest")
        .merge(u)
        .transition()
        .duration(0)
        .attr("d", d3.line()
            .x(function(d) { return d.x;})
            .y(function(d) { return d.y;}))
            .attr("fill", "none")
            .attr("stroke", colorOfLine)
            .attr("stroke-width", 2)
        }
    }


