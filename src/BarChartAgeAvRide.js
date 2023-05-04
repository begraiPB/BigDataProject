import React, { Component } from 'react'
import * as d3 from 'd3'
import { API } from 'aws-amplify';

class BarChartAgeAvRide extends Component {
    async componentDidMount() {
        await this.drawChart();
    }
    async drawChart() {

        const data = await API.get('apifd318e7f', '/items', {
            queryStringParameters: {
            }
          });

        const sortedData = data.slice().sort((a, b) => d3.ascending(a.age, b.age))

        console.log(sortedData)

        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", 1600)
                    .attr("height", 800);

        var margin = 200;
        var width = svg.attr("width") - margin;
        var height = svg.attr("height") - margin; 

        var xScale = d3.scaleBand().range([0, width]).padding(0.5); 
        var yScale = d3.scaleLinear().range([height, 0]); 

        var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")"); 

        xScale.domain( 
            sortedData.map(function (d) { 
            return d.age; 
        }) 
        ); 
        yScale.domain([ 
            0, 
            d3.max(sortedData, function (d) { 
                return d.avg_trip_duration; 
            }), 
        ]); 

        g.append("g") 
        .attr("transform", "translate(0," + height + ")") 
        .call(d3.axisBottom(xScale)) ;

        g.append("g") 
        .call(d3.axisLeft(yScale)) ;

        g.selectAll(".bar") 
        .data(sortedData) 
        .enter() 
        .append("rect") 
        .attr("class", "bar") 
        .attr("x", function (d) { 
        return xScale(d.age); 
        }) 
        .attr("y", function (d) { 
        return yScale(d.avg_trip_duration); 
        }) 
        .attr("width", xScale.bandwidth()) 
        .attr("height", function (d) { 
        return height - yScale(d.avg_trip_duration); 
        }); 

        g.append("g") 
        .attr("transform", "translate(0," + height + ")") 
        .call(d3.axisBottom(xScale)) 
        .append("text") 
        .attr("y", height - 140) 
        .attr("x", width - 400) 
        .attr("text-anchor", "end") 
        .attr("stroke", "black") 
        .attr("font-size", "15px") 
        .text("Age"); 

        g.append("g") 
        .call(d3.axisLeft(yScale)) 
        .append("text") 
        .attr("transform", "rotate(-90)") 
        .attr("x", -80) 
        .attr("y", 25) 
        .attr("dy", "-5.1em") 
        .attr("text-anchor", "end") 
        .attr("stroke", "black") 
        .attr("font-size", "15px") 
        .text("Average Trip Duration"); 

        svg 
        .append("text") 
        .attr("transform", "translate(100,0)") 
        .attr("x", 200) 
        .attr("y", 50) 
        .attr("font-size", "20px") 
        .text("Average Trip Duration Per Age"); 

    }
    render() {
        return <div id={"#" + this.props.id}></div>
    }
}
export default BarChartAgeAvRide;
