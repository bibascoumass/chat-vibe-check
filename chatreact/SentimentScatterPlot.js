import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './App.css';

function SentimentScatterPlot() {
    const [data, setData] = useState([]);

    const timestampRef = useRef();
    const responseTimeRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/plots");
                const json = await res.json();

                const parsed = json.map(d => ({
                    ...d,
                    timestamp: new Date(d.timestamp),
                    sentiment: +d.sentiment,
                    responseTime: +d.responseTime
                }));
                setData(parsed);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const drawChart = (ref, xKey, xLabel) => {
        if (data.length === 0) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 950;
        const height = 500;
        const margin = { top: 50, right: 160, bottom: 90, left: 60 };

        const users = Array.from(new Set(data.map(d => d.sender)));
        const colorScale = d3.scaleOrdinal()
            .domain(users)
            .range(d3.schemeCategory10);

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = xKey === 'timestamp'
            ? d3.scaleTime().domain(d3.extent(data, d => d[xKey])).range([0, innerWidth])
            : d3.scaleLinear().domain([0, d3.max(data, d => d[xKey]) * 1.1]).range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => d.sentiment) - 1, d3.max(data, d => d.sentiment) + 1])
            .range([innerHeight, 0]);

        const xAxis = g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(
                xKey === 'timestamp'
                    ? d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d %H:%M"))
                    : d3.axisBottom(x)
            );

        // Slanted x-axis labels
        xAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em");

        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2)
            .attr("y", -40)
            .attr("fill", "#000")
            .style("text-anchor", "middle")
            .text("Sentiment");

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "#eee")
            .style("padding", "6px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "4px");

        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d[xKey]))
            .attr("cy", d => y(d.sentiment))
            .attr("r", 5)
            .style("fill", d => colorScale(d.sender))
            .style("opacity", 0.8)
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip
                    .html(`<strong>Sender:</strong> ${d.sender}<br/>
                           <strong>Sentiment:</strong> ${d.sentiment}<br/>
                           <strong>${xLabel}:</strong> ${xKey === 'timestamp' ? d.timestamp.toLocaleString() : d.responseTime + "s"}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

        // Title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text(`${xLabel} vs Sentiment`);

        // Legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

        users.forEach((user, i) => {
            const row = legend.append("g")
                .attr("transform", `translate(0, ${i * 25})`);

            row.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", colorScale(user));

            row.append("text")
                .attr("x", 25)
                .attr("y", 14)
                .text(user)
                .style("font-size", "12px")
                .attr("alignment-baseline", "middle");
        });
    };

    useEffect(() => {
        drawChart(timestampRef, 'timestamp', 'Timestamp');
        drawChart(responseTimeRef, 'responseTime', 'Response Time');
    }, [data]);

    return (
        <div style={{ display: "flex", flexDirection:"column", marginTop:"50px" }}>
            <div className='scatter-container'>
                <svg ref={timestampRef} width={1000} height={500}></svg>
            </div>
            <div className='scatter-container'>
                <svg ref={responseTimeRef} width={1000} height={500}></svg>
            </div>
        </div>
    );
}

export default SentimentScatterPlot;