import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './App.css';

function SentimentHeatmap() {
  const ref = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/heatmap');
        const result = await response.json();

        const enriched = result.map(d => ({
          ...d,
          topic: assignTopic(d.message),
        }));
        setData(enriched);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };

    fetchData();
  }, []);

  const assignTopic = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes("morning") || lower.includes("evening")) return "Greeting";
    if (lower.includes("meeting") || lower.includes("event")) return "Work";
    if (lower.includes("happy") || lower.includes("sad")) return "Emotion";
    if (lower.includes("project") || lower.includes("deadline")) return "Task";
    return "Other";
  };

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 60, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).padding(0.05);
    const y = d3.scaleBand().range([height, 0]).padding(0.05);

    const color = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([-1, 1]); // Sentiment from -1 to +1

    const dates = Array.from(new Set(data.map(d => d.date)));
    const topics = Array.from(new Set(data.map(d => d.topic)));

    x.domain(dates);
    y.domain(topics);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g").call(d3.axisLeft(y).tickSize(0));

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    g.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.topic))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", d => color(d.sentiment))
      .style("stroke", "white")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`<strong>${d.sender}</strong><br>${d.message}<br>Sentiment: ${d.sentiment}`)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

  }, [data]);

  return (
    <div className="container">
      <h2>Topic-wise Sentiment Heatmap</h2>
      <svg ref={ref} width={700} height={450}></svg>
    </div>
  );
}

export default SentimentHeatmap;