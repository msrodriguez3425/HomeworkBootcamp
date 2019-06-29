var svgWidth = 960;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 90,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth) 
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty"

//Update the x scale based on the data of the newly selected axis value
function xScale(data,chosenXAxis){
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data,d=>d[chosenXAxis])*0.8,
      d3.max(data,d=>d[chosenXAxis])*1.1
    ])
    .range([0,width]);
  return xLinearScale
};

//Render the new axes when new axis value is selected
function renderAxes(newXScale,xAxis){
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return xAxis
}

//Render the new circles when new axis value is selected
function renderCircles(circlesGroup,newXScale,chosenXAxis){

    circlesGroup.transition()
    .duration(1000)
    .attr("cx",d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderText(textGroup,newXScale,chosenXAxis){
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))

  return textGroup;
}

//Update the tooltips upon change of selected axis value
function updateToolTip(chosenXAxis,circlesGroup){
  console.log("test")
if (chosenXAxis=== 'poverty') {
    var label = "Poverty:";
    console.log("Poverty was selected");
}
//household income in dollars
else if (chosenXAxis === 'income') {
    var label = "Median Income:";
    console.log("Income was selected");

}
//age (number)
else {
    var label = "Age:";
    console.log("Age was selected");
}
  var toolTip = d3.tip()
    .attr("class","tooltip")
    .offset([-8,0])
    .html(function(d){
      return(`${d.state}<br>${label} ${d[chosenXAxis]}<br>Lacks Healthcare (%): ${d.healthcare}%`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });

    return circlesGroup;
}


// Import Data
d3.csv("data.csv")
  .then(function(data) {
    
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(data,chosenXAxis);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.healthcare)*0.5, d3.max(data, d => d.healthcare)*1.1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .classed("x-axis",true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .classed("stateCircle",true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", "0.7");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .attr("color","white")
        .text(function(d){return d.abbr});

    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width/2},${height + 20})`);
    
    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value","poverty")
      .classed("active",true)
      .classed("axisText",true)
      .text("In Poverty (%)");
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value","age")
      .classed("inactive",true)
      .classed("axisText",true)
      .text("Age (Median)");
    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value","income")
      .classed("inactive",true)
      .classed("axisText",true)
      .text("Household Income (Median)");

      // append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axisText", true)
    .text("Lacks Healthcare (%)");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
      .on("click",function(){
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis){
          chosenXAxis = value;

          xLinearScale = xScale(data,chosenXAxis);

          xAxis = renderAxes(xLinearScale, xAxis);

          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          circlesGroup = updateToolTip(chosenXAxis,circlesGroup);

          textGroup = renderText(textGroup,xLinearScale, chosenXAxis);

          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active",true)
              .classed("inactive",false);
            ageLabel
              .classed("active",false)
              .classed("inactive",true);
            incomeLabel
              .classed("active",false)
              .classed("inactive",true);
          }else if (chosenXAxis === "age"){
            ageLabel
              .classed("active",true)
              .classed("inactive",false);
            incomeLabel
              .classed("active",false)
              .classed("inactive",true);
            povertyLabel
              .classed("active",false)
              .classed("inactive",true);
          }else {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active",false)
              .classed("inactive",true);
            ageLabel
              .classed("active",false)
              .classed("inactive",true);
          }
        }
      });

  });
  //   // Step 6: Initialize tool tip
  //   // ==============================
  //   var toolTip = d3.tip()
  //     .attr("class", "tooltip")
  //     .offset([80, -60])
  //     .html(function(d) {
  //       return (`${d.state}<br>Poverty(%): ${d.poverty}<br>Lacks healthcare: ${d.healthcare}`);
  //     });

  //   // Step 7: Create tooltip in the chart
  //   // ==============================
  //   chartGroup.call(toolTip);

  //   // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    // circlesGroup.on("mouseover", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data, this);
    //   });

  //   // Create axes labels
  //   chartGroup.append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 0 - margin.left + 40)
  //     .attr("x", 0 - (height / 2))
  //     .attr("dy", "1em")
  //     .attr("class", "axisText")
  //     .text("Lacks Healthcare (%)");

  //   chartGroup.append("text")
  //     .attr("transform", `translate(${width / 2}, ${height + margin.top +30})`)
  //     .attr("class", "axisText")
  //     .text("In Poverty (%)");
  // });
