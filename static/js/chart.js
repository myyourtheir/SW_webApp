function drawChart(res, par) {
    var height = 300, 
    width = x, 
    margin= 30;
    
    rawData = d3.zip(res.x, res.Davleniya[800]).map(function(d) {
        yyy = d[1];
        xxx= d[0];
        return {x: xxx, y: yyy};
    });

   


    var svg = d3.select("#mainSVG")
        .append("svg")
        .attr("class", "axis")
        .attr("width", width + 100)
        .attr("height", height + 150);

    var xAxisLength = width - 100;
    var yAxisLength = height - 2 * margin;

    var scaleX = d3.scaleLinear()
                    .domain([d3.min(res.x),d3.max(res.x)])
                    .range([0, xAxisLength]);

    var scaleY = d3.scaleLinear()
                    .domain([6000000, -2000000])
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
            "translate(" +  100 + "," + (height + 150 - margin)+ ")")
        .call(xAxis);

    svg.append("g")       
        .attr("class", "y-axis")
        .attr("transform", // сдвиг оси вниз и вправо на margin
                "translate(" + 100 + "," + (margin + 150) + ")")
        .call(yAxis);
    
    var line = d3.line()
        .x(function(d) { return d.x;})
        .y(function(d) { return d.y;});

    let data = [];
    for(i=0; i<rawData.length; i++){
              data.push({x: scaleX(rawData[i].x)+100, y: scaleY(rawData[i].y) +margin + 150});
    };
     console.log(rawData)
     console.log(data)
     svg.append("g").append("path")
                .attr("d", line(data))
                .style("stroke", "black")
                .style("stroke-width", 1);
    
}