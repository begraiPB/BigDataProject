import React, { Component } from 'react'
import * as d3 from 'd3'
import { API } from 'aws-amplify';

class LineChartYearTrips extends Component {
    async componentDidMount() {
        await this.drawChart();
    }
    async drawChart() {

        const data = await API.get('apifd318e7f', '/items', {
            queryStringParameters: {
                "queryType": "yearNumTrips"
            }
          });

          var parseTime = d3.timeParse("%Y");
          data.forEach(function (d) {
            d.year = parseTime(d.year);
            });

        var margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        var svg = d3.select("#chart3")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %d')))
            .append("text")
            .attr("x", (960+90)/2) //middle of the xAxis
            .attr("y", "50") // a little bit below xAxis
            .text("Year");

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.numtrips; })])
        .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.numtrips) })
        )

        svg 
        .append("text") 
        .attr("transform", "translate(100,0)") 
        .attr("x", 200) 
        .attr("y", 0) 
        .attr("font-size", "24px") 
        .text("User trend for Divvy eBike Usage From"); 
    }
    render() {
        return <div id={"#3" + this.props.id}></div>
    }
}
export default LineChartYearTrips;
