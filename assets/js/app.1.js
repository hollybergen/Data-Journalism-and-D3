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
      right: 40,
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
      .attr("width", svgWidth)
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
                data.obesity = +data.obesity;
                data.obesityLow = +data.obesityLow;
                data.obesityHigh = +data.obesityHigh;
                data.age = +data.age;
                data.income = +data.income;
                data.healthcare = +data.healthcare;
                data.smokes = +data.smokes;
            });

            // Create scale functions
            // ==============================
            // var xLinearScale = d3.scaleLinear()
            //     .domain([8, d3.max(healthData, d => d.poverty)])
            //     .range([0, width]);
            // var yLinearScale = d3.scaleLinear()
            //     .domain([20, d3.max(healthData, d => d.obesity)])
            //     .range([height, 0]);
                
        

            // Create axis functions
            // ==============================

            // Initialize variables
            var currentXAxis = "poverty";
            var currentYAxis = "healthcare";

            // LinearScale functions
            var xLinearScale = xScale(healthData, currentXAxis);
            var yLinearScale = yScale(healthData, currentYAxis);

            // Initial axis functions
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);





            // Append Axes to the chart
            // ==============================
            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);
            chartGroup.append("g")
                .call(leftAxis);


            // Create Circles
            // ==============================

            var circlesGroup = chartGroup.selectAll("circle")
                .data(healthData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d[currentXAxis]))
                .attr("cy", d => yLinearScale(d[currentYAxis]))
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
                .attr("x", d => xLinearScale(d[currentXAxis]))
                .attr("y", d => yLinearScale(d[currentYAxis]))
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font_family", "sans-serif") 
                .attr("font-size", "11px") 
                .attr("fill", "white")   
                .style("font-weight", "bold");

            // Create axes labels
            // chartGroup.append("text")
            //     .attr("transform", "rotate(-90)")
            //     .attr("y", 0 - margin.left + 40)
            //     .attr("x", 0 - (height / 2))
            //     .attr("dy", "1em")
            //     .attr("class", "axisText")
            //     .text("Obesity");
            // chartGroup.append("text")
            //     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            //     .attr("class", "axisText")
            //     .text("Poverty (in %)");

            // Create group for  3 x-axis labels
            var labelsGroup = chartGroup.append("g")
                .attr("transform", `translate(${width / 2}, ${height + 20})`)
                .classed("xLabel", true);

            var povertyLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "poverty") // value to grab for event listener
                .classed("active", true)
                .text("In Poverty (%)");

            var ageLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 40)
                .attr("value", "age") // value to grab for event listener
                .classed("inactive", true)
                .text("Age (Median)");

            var incomeLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 60)
                .attr("value", "income") // value to grab for event listener
                .classed("inactive", true)
                .text("Household Income (Median)");


            // Create group for  3 y-axis labels
            var ylabelsGroup = chartGroup.append("g")
                .attr("transform", "rotate(-90)")
                .classed("yLabel", true);

            var healthcareLabel = ylabelsGroup.append("text")
                .attr("y", 0 - 50)
                .attr("x", 0 - (height / 2))
                .attr("value", "healthcare")
                .attr("dy", "1em")
                .classed("active", true)
                .text("Lacks Healthcare (%)");

            var obesityLabel = ylabelsGroup.append("text")
                .attr("y", 0 - 70)
                .attr("x", 0 - (height / 2))
                .attr("value", "obesity")
                .attr("dy", "1em")
                .classed("inactive", true)
                .text("Obese (%)");

            var smokesLabel = ylabelsGroup.append("text")
                .attr("y", 0 - 90)
                .attr("x", 0 - (height / 2))
                .attr("value", "smokes")
                .attr("dy", "1em")
                .classed("inactive", true)
                .text("Smokes (%)");

            // updateToolTip function above csv import
            var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
            circlesGroup = updateYToolTip(chosenYAxis, circlesGroup);














        });
    }