/* You need to create a scatter plot between two of the data variables such as 
vs. Poverty or Smokers vs. Age.

Using the D3 techniques we taught you in class, create a scatter plot that represents 
each state with circle elements. You'll code this graphic in the app.js file of your homework 
directory—make sure you pull in the data from data.csv by using the d3.csv function. 
Your scatter plot should ultimately appear like the image at the top of this section.


Include state abbreviations in the circles.
Create and situate your axes and labels to the left and bottom of the chart.
Note: You'll need to use python -m http.server to run the visualization. 
This will host the page at localhost:8000 in your web browser. */

/*
VARIABLES
poverty
povertyMoe
age
ageMoe
income
incomeMoe
healthcare
healthcareLow
healthcareHigh
obesity
obesityLow
obesityHigh
smokes
smokesLow
smokesHigh
*/

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, loadChart() is called
loadChart();

// Define responsive function
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
        loadChart();
    }
}

// Define the chart rendering function
function loadChart() {

    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

    var margin = {
      top: 20,
      right: 100,
      bottom: 100,
      left: 100
    };
  
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", width)
      .attr("height", svgHeight);
  
    // Append an SVG group
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Import Data
    d3.csv("assets/data/data.csv")
        .then(function (healthData) {

            // Parse Data/Cast as numbers
            // ==============================
            healthData.forEach(function (data) {
                data.id = +data.id;
                data.poverty = +data.poverty;
                data.povertyMoe = +data.povertyMoe;
                data.obesity = +data.obesity;
                data.obesityLow = +data.obesityLow;
                data.obesityHigh = +data.obesityHigh;
            });

            // Create scale functions
            // ==============================
            var xLinearScale = d3.scaleLinear()
                .domain([8, d3.max(healthData, d => d.poverty)])
                .range([0, width]);
            var yLinearScale = d3.scaleLinear()
                .domain([20, d3.max(healthData, d => d.obesity)])
                .range([height, 0]);

            // Create axis functions
            // ==============================
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            //  Append Axes to the chart
            // ==============================
            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);
            chartGroup.append("g")
                .call(leftAxis);


            // Create Circles
            // ==============================
            
            // append circles
            var circlesGroup = chartGroup.selectAll("circle")
                .data(healthData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.obesity))
                .attr("r", "15")
                .attr("fill", "green")
                .attr("opacity", ".7")

                
            // append text labels
            var textsGroup = chartGroup.append("g")
                .selectAll("text")
                .data(healthData)
                .enter()
                .append("text")
                .classed("text-group", true)
                .text(d => d.abbr)
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.obesity))
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font_family", "sans-serif") 
                .attr("font-size", "11px") 
                .attr("fill", "white")   
                .style("font-weight", "bold");


            // Create ToolTip
            // ==============================

            // Initialize tooltip for menu when circle is selected
            var toolTip = d3.tip()
                .attr("class", "tooltip")
                .attr("border", "solid")
                .html(function(d) {
                return (`<h3>${d.state}</h3><br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
                });

            // Create tooltip in the chart
            textsGroup.call(toolTip);

            // Create event listeners to display and hide the tooltip
            textsGroup.on("click", function(healthData) {
                toolTip.show(healthData, this);
            })
                // onmouseout event
                .on("mouseout", function(healthData, index) {
                toolTip.hide(healthData);
                });

            
            // Create axes labels
            // ==============================
            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text("Obesity (in %)");
            chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
                .attr("class", "axisText")
                .text("Poverty (in %)");

        });

    }