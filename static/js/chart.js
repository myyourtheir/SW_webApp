const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };  

const drawChart = async(res, resY, max, min, marginY, par) => {
    let markerY = NaN;
    let colorOfLine =NaN;
    if (par==='H'){
        markerY = 'H, м'
        colorOfLine = 'red'
    };
    if (par==='S'){
        markerY = 'V, м/c'
        colorOfLine = 'steelblue'
    };
    if (par==='P'){
        markerY = 'p, Па'
        colorOfLine = 'green'
    };

    var height = 250, 
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
                    .domain([max, min])
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
        .style('fill', 'green')
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
        .style('fill', 'green')
        .text(markerY);
    
    
    for (let j =0; j<res.Napory.length; j++){

        let dataMoment = []
        for(i=0; i<res.x.length; i++){
                    dataMoment.push({x: scaleX(res.x[i])+100, y: scaleY(resY[j][i]) +margin + marginY});
        };
        update(dataMoment, colorOfLine)
        await sleep(50)
    };
    
        
         
        

    
    
    function update (data, colorOfLine){
          
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


