import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './App.css';

function SentimentHeatmap() {
  const ref = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/plots');
        const result = await response.json();

        // Assign topics
        const enriched = result.map(d => ({
          ...d,
          topic: assignTopic(d.message),
        }));

        // Group by date + topic and calculate average sentiment
        const grouped = d3.rollups(
          enriched,
          v => ({
            avgSentiment: d3.mean(v, d => d.sentiment),
            count: v.length
          }),
          d => d.date,
          d => d.topic
        );

        const flattened = [];
        for (const [date, topics] of grouped) {
          for (const [topic, { avgSentiment, count }] of topics) {
            flattened.push({ date, topic, sentiment: avgSentiment, count });
          }
        }

        setData(flattened);
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

    const margin = { top: 30, right: 20, bottom: 100, left: 50 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleBand().range([height, 0]).padding(0.1);

    const color = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([-1, 1]);

    const dates = Array.from(new Set(data.map(d => d.date))).sort();
    const topics = Array.from(new Set(data.map(d => d.topic)));

    x.domain(dates);
    y.domain(topics);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % Math.ceil(dates.length / 20) === 0)))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g").call(d3.axisLeft(y));

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
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`
          <strong>Date:</strong> ${d.date}<br/>
          <strong>Topic:</strong> ${d.topic}<br/>
          <strong>Avg Sentiment:</strong> ${d.sentiment.toFixed(2)}<br/>
          <strong>Messages:</strong> ${d.count}
        `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

    // Legend
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient");

    linearGradient.selectAll("stop")
      .data([
        { offset: "0%", color: d3.interpolateRdYlGn(-1) },
        { offset: "50%", color: d3.interpolateRdYlGn(0) },
        { offset: "100%", color: d3.interpolateRdYlGn(1) }
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    svg.append("rect")
      .attr("x", width / 2 - 100)
      .attr("y", height + margin.top + 100)
      .attr("width", 300)
      .attr("height", 15)
      .style("fill", "url(#legend-gradient)");

    svg.append("text")
      .attr("x", width / 2 - 100)
      .attr("y", height + margin.top + 85)
      .text("Sentiment Scale")
      .style("font-size", "12px");

    svg.append("text")
      .attr("x", width / 2 - 100)
      .attr("y", height + margin.top + 135)
      .text("-1 (Negative)        0 (Neutral)        +1 (Positive)")
      .style("font-size", "12px");

  }, [data]);

  return (
    <div className="heat-container">
      <h2>Topic-wise Sentiment Heatmap (Aggregated)</h2>
      <svg ref={ref} width={900} height={600}></svg>
    </div>
  );
}

export default SentimentHeatmap;