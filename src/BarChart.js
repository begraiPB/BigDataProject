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
                "queryType": "Dummy"
            }
          });

        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", 700)
                    .attr("height", 300);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 300 - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }
    render() {
        return <div id={"#2" + this.props.id}></div>
    }
}
export default BarChart;
