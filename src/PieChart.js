import React, { Component } from 'react'
import * as d3 from 'd3'
import { API } from 'aws-amplify';

class BarChart extends Component {
    async componentDidMount() {
        await this.drawChart();
    }
    async drawChart() {

        const data = await API.get('apifd318e7f', '/items', {
            queryStringParameters: {
                "queryType": "genderRatio"
            }
          });

        // set the dimensions and margins of the graph
        const width = 450,
        height = 450,
        margin = 40;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin;

        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", 450)
                    .attr("height", 450)
                    .append("g")
                        .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal()
        .range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        const pie = d3.pie()
        .value(function(d) {return d[1]})
        const data_ready = pie(Object.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
        .selectAll('mySlices')
        .data(data_ready)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data[0])) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

        // Now add the annotation. Use the centroid method to get the best coordinates
        svg
        .selectAll('mySlices')
        .data(data_ready)
        .join('text')
        .text(function(d){ return d.data[0] + " " + d.data[1]})
        .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
        .style("text-anchor", "middle")
        .style("font-size", 17);

        svg.append("text")
        .attr("y", (width / 2))             
        .attr("x", height - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Gender Distribution of eBike Users");
    }
    render() {
        return <div id={"#" + this.props.id}></div>
    }
}
export default BarChart;
