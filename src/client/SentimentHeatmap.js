// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import './App.css';

// function SentimentHeatmap() {
//   const ref = useRef();
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:5001/api/plots');
//         const result = await response.json();

//         // Assign topics
//         const enriched = result.map(d => ({
//           ...d,
//           topic: assignTopic(d.message),
//         }));

//         // Group by date + topic and calculate average sentiment
//         const grouped = d3.rollups(
//           enriched,
//           v => ({
//             avgSentiment: d3.mean(v, d => d.sentiment),
//             count: v.length
//           }),
//           d => d.date,
//           d => d.topic
//         );

//         const flattened = [];
//         for (const [date, topics] of grouped) {
//           for (const [topic, { avgSentiment, count }] of topics) {
//             flattened.push({ date, topic, sentiment: avgSentiment, count });
//           }
//         }

//         setData(flattened);
//       } catch (error) {
//         console.error('Error fetching heatmap data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//     const assignTopic = (message) => {
//     const lower = message.toLowerCase();

//     // Greeting
//     if (lower.includes("morning") || lower.includes("evening") || lower.includes("hello") || lower.includes("hi") || lower.includes("greetings")) return "Greeting";

//     // Work
//     if (lower.includes("meeting") || lower.includes("event") || lower.includes("work") || lower.includes("project") || lower.includes("task") || lower.includes("office")) return "Work";

//     // Emotion
//     if (lower.includes("happy") || lower.includes("sad") || lower.includes("excited") || lower.includes("angry") || lower.includes("upset") || lower.includes("joy")) return "Emotion";

//     // Task
//     if (lower.includes("deadline") || lower.includes("task") || lower.includes("assignment") || lower.includes("project") || lower.includes("workload") || lower.includes("job")) return "Task";

//     // Question
//     if (lower.includes("how") || lower.includes("what") || lower.includes("why") || lower.includes("where") || lower.includes("when") || lower.includes("which")) return "Question";

//     // Request
//     if (lower.includes("please") || lower.includes("help") || lower.includes("assist") || lower.includes("support") || lower.includes("need") || lower.includes("want")) return "Request";

//     // Time
//     if (lower.includes("time") || lower.includes("when") || lower.includes("schedule") || lower.includes("hours") || lower.includes("clock") || lower.includes("date")) return "Time";

//     // Location
//     if (lower.includes("where") || lower.includes("location") || lower.includes("place") || lower.includes("address") || lower.includes("city") || lower.includes("country")) return "Location";

//     // Weather
//     if (lower.includes("weather") || lower.includes("rain") || lower.includes("sunny") || lower.includes("snow") || lower.includes("storm") || lower.includes("forecast")) return "Weather";

//     // Health
//     if (lower.includes("sick") || lower.includes("health") || lower.includes("doctor") || lower.includes("treatment") || lower.includes("medicine") || lower.includes("symptoms")) return "Health";

//     // Travel
//     if (lower.includes("travel") || lower.includes("trip") || lower.includes("vacation") || lower.includes("flight") || lower.includes("tour") || lower.includes("journey")) return "Travel";

//     // Finance
//     if (lower.includes("money") || lower.includes("finance") || lower.includes("payment") || lower.includes("bill") || lower.includes("cost") || lower.includes("budget")) return "Finance";

//     // Technology
//     if (lower.includes("technology") || lower.includes("computer") || lower.includes("device") || lower.includes("software") || lower.includes("hardware") || lower.includes("app")) return "Technology";

//     // Education
//     if (lower.includes("education") || lower.includes("school") || lower.includes("study") || lower.includes("learning") || lower.includes("exam") || lower.includes("class")) return "Education";

//     // Sports
//     if (lower.includes("sports") || lower.includes("game") || lower.includes("football") || lower.includes("basketball") || lower.includes("soccer") || lower.includes("exercise")) return "Sports";

//     // Food
//     if (lower.includes("food") || lower.includes("eat") || lower.includes("dinner") || lower.includes("lunch") || lower.includes("breakfast") || lower.includes("snack")) return "Food";

//     // Music
//     if (lower.includes("music") || lower.includes("song") || lower.includes("album") || lower.includes("concert") || lower.includes("band") || lower.includes("artist")) return "Music";

//     // Movies
//     if (lower.includes("movie") || lower.includes("film") || lower.includes("cinema") || lower.includes("show") || lower.includes("theater") || lower.includes("series")) return "Movies";

//     // Technology
//     if (lower.includes("tech") || lower.includes("gadget") || lower.includes("software") || lower.includes("code") || lower.includes("programming") || lower.includes("app")) return "Technology";

//     // Fashion
//     if (lower.includes("fashion") || lower.includes("style") || lower.includes("clothing") || lower.includes("clothes") || lower.includes("outfit") || lower.includes("trend")) return "Fashion";

//     // Shopping
//     if (lower.includes("shopping") || lower.includes("buy") || lower.includes("store") || lower.includes("sale") || lower.includes("discount") || lower.includes("purchase")) return "Shopping";

//     // Relationships
//     if (lower.includes("relationship") || lower.includes("friend") || lower.includes("love") || lower.includes("partner") || lower.includes("romantic") || lower.includes("family")) return "Relationships";

//     // Politics
//     if (lower.includes("politics") || lower.includes("government") || lower.includes("election") || lower.includes("party") || lower.includes("policy") || lower.includes("candidate")) return "Politics";

//     // News
//     if (lower.includes("news") || lower.includes("headline") || lower.includes("update") || lower.includes("report") || lower.includes("breaking") || lower.includes("story")) return "News";

//     // Science
//     if (lower.includes("science") || lower.includes("research") || lower.includes("experiment") || lower.includes("discovery") || lower.includes("study") || lower.includes("innovation")) return "Science";

//     // History
//     if (lower.includes("history") || lower.includes("past") || lower.includes("ancient") || lower.includes("civilization") || lower.includes("timeline") || lower.includes("war")) return "History";

//     // Art
//     if (lower.includes("art") || lower.includes("painting") || lower.includes("drawing") || lower.includes("sculpture") || lower.includes("artist") || lower.includes("gallery")) return "Art";

//     // Literature
//     if (lower.includes("book") || lower.includes("literature") || lower.includes("novel") || lower.includes("reading") || lower.includes("author") || lower.includes("poetry")) return "Literature";

//     // Pets
//     if (lower.includes("dog") || lower.includes("cat") || lower.includes("pet") || lower.includes("animal") || lower.includes("puppy") || lower.includes("kitten")) return "Pets";

//     // Hobbies
//     if (lower.includes("hobby") || lower.includes("interest") || lower.includes("craft") || lower.includes("DIY") || lower.includes("collecting") || lower.includes("painting")) return "Hobbies";

//     // Technology Support
//     if (lower.includes("support") || lower.includes("help") || lower.includes("troubleshoot") || lower.includes("issue") || lower.includes("problem") || lower.includes("error")) return "Tech Support";

//     // Environment
//     if (lower.includes("environment") || lower.includes("nature") || lower.includes("climate") || lower.includes("green") || lower.includes("pollution") || lower.includes("sustainability")) return "Environment";

//     // Money
//     if (lower.includes("loan") || lower.includes("credit") || lower.includes("debt") || lower.includes("investment") || lower.includes("savings") || lower.includes("bank")) return "Finance";

//     // Social Media
//     if (lower.includes("social media") || lower.includes("twitter") || lower.includes("facebook") || lower.includes("instagram") || lower.includes("linkedin") || lower.includes("posts")) return "Social Media";

//     // Gaming
//     if (lower.includes("game") || lower.includes("gaming") || lower.includes("video game") || lower.includes("console") || lower.includes("pc") || lower.includes("playstation")) return "Gaming";

//     // Cars
//     if (lower.includes("car") || lower.includes("vehicle") || lower.includes("auto") || lower.includes("engine") || lower.includes("drive") || lower.includes("road")) return "Cars";

//     // Books
//     if (lower.includes("book") || lower.includes("library") || lower.includes("reading") || lower.includes("author") || lower.includes("novel") || lower.includes("story")) return "Books";

//     // Holidays
//     if (lower.includes("holiday") || lower.includes("vacation") || lower.includes("celebration") || lower.includes("festival") || lower.includes("trip") || lower.includes("season")) return "Holidays";

//     // Other
//     return "Other";
// };

//   useEffect(() => {
//     if (data.length === 0) return;

//     const svg = d3.select(ref.current);
//     svg.selectAll("*").remove();

//     const margin = { top: 30, right: 20, bottom: 100, left: 100 };
//     const width = 1000 - margin.left - margin.right;
//     const height = 500 - margin.top - margin.bottom;

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

//     // x and y scales
//     const x = d3.scaleBand().range([0, width]).padding(0.1);
//     const y = d3.scaleLinear().range([height, 0]);

//     // Use topics as x-domain
//     const topics = Array.from(new Set(data.map(d => d.topic)));
//     x.domain(topics);

//     // Use sentiment as y-domain
//     const sentimentExtent = d3.extent(data, d => d.sentiment);
//     y.domain(sentimentExtent);

//     g.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x).tickSize(0))
//       .selectAll("text")
//       .attr("transform", "rotate(-45)")
//       .style("text-anchor", "end");

//     g.append("g")
//       .call(d3.axisLeft(y).ticks(5));

//     const tooltip = d3.select("body").append("div")
//       .attr("class", "tooltip")
//       .style("opacity", 0);

//     // Draw rectangles
//     g.selectAll("rect")
//       .data(data)
//       .enter().append("rect")
//       .attr("x", d => x(d.topic))
//       .attr("y", d => y(d.sentiment))
//       .attr("width", x.bandwidth())
//       .attr("height", d => height - y(d.sentiment)) // height determined by sentiment score
//       .style("fill", d => d3.scaleSequential(d3.interpolateRdYlGn).domain([-1, 1])(d.sentiment))
//       .style("stroke", "white")
//       .on("mouseover", (event, d) => {
//         tooltip.transition().duration(200).style("opacity", 0.9);
//         tooltip.html(`
//           <strong>Topic:</strong> ${d.topic}<br/>
//           <strong>Sentiment:</strong> ${d.sentiment.toFixed(2)}<br/>
//           <strong>Messages:</strong> ${d.count}
//         `)
//           .style("left", `${event.pageX + 10}px`)
//           .style("top", `${event.pageY - 28}px`);
//       })
//       .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

//     // Legend
//     const defs = svg.append("defs");
//     const linearGradient = defs.append("linearGradient")
//       .attr("id", "legend-gradient");

//     linearGradient.selectAll("stop")
//       .data([
//         { offset: "0%", color: d3.interpolateRdYlGn(-1) },
//         { offset: "50%", color: d3.interpolateRdYlGn(0) },
//         { offset: "100%", color: d3.interpolateRdYlGn(1) }
//       ])
//       .enter().append("stop")
//       .attr("offset", d => d.offset)
//       .attr("stop-color", d => d.color);

//     svg.append("rect")
//       .attr("x", width / 2 - 100)
//       .attr("y", height + margin.top + 100)
//       .attr("width", 300)
//       .attr("height", 15)
//       .style("fill", "url(#legend-gradient)");

//     svg.append("text")
//       .attr("x", width / 2 - 100)
//       .attr("y", height + margin.top + 85)
//       .text("Sentiment Scale")
//       .style("font-size", "12px");

//     svg.append("text")
//       .attr("x", width / 2 - 100)
//       .attr("y", height + margin.top + 135)
//       .text("-1 (Negative)        0 (Neutral)        +1 (Positive)")
//       .style("font-size", "12px");

//   }, [data]);

//   return (
//     <div className="heat-container">
//       <h2>Topic-wise Sentiment Heatmap (Aggregated)</h2>
//       <svg ref={ref} width={1000} height={600}></svg>
//     </div>
//   );
// }

// export default SentimentHeatmap;


import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './assets/App.css';

function SentimentHeatmap() {
  const ref = useRef();
  const [data, setData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [minSentiment, setMinSentiment] = useState(-1);
  const [maxSentiment, setMaxSentiment] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/plots');
        const result = await response.json();

        const enriched = result.map(d => ({
          ...d,
          topic: assignTopic(d.message),
        }));

        const grouped = d3.rollups(
          enriched,
          v => ({
            avgSentiment: d3.mean(v, d => d.sentiment),
            count: v.length,
            data: v
          }),
          d => d.topic
        );

        const flattened = grouped.map(([topic, values]) => ({
          topic,
          sentiment: values.avgSentiment,
          count: values.count,
          messages: values.data
        }));

        const sentiments = flattened.map(d => d.sentiment);
        setMinSentiment(d3.min(sentiments));
        setMaxSentiment(d3.max(sentiments));
        setData(flattened);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };

    fetchData();
  }, []);

  const assignTopic = (message) => {
    const lower = message.toLowerCase();

    // Greeting
    if (lower.includes("morning") || lower.includes("evening") || lower.includes("hello") || lower.includes("hi") || lower.includes("greetings")) return "Greeting";

    // Work
    if (lower.includes("meeting") || lower.includes("event") || lower.includes("work") || lower.includes("project") || lower.includes("task") || lower.includes("office")) return "Work";

    // Emotion
    if (lower.includes("happy") || lower.includes("sad") || lower.includes("excited") || lower.includes("angry") || lower.includes("upset") || lower.includes("joy")) return "Emotion";

    // Task
    if (lower.includes("deadline") || lower.includes("task") || lower.includes("assignment") || lower.includes("project") || lower.includes("workload") || lower.includes("job")) return "Task";

    // Question
    if (lower.includes("how") || lower.includes("what") || lower.includes("why") || lower.includes("where") || lower.includes("when") || lower.includes("which")) return "Question";

    // Request
    if (lower.includes("please") || lower.includes("help") || lower.includes("assist") || lower.includes("support") || lower.includes("need") || lower.includes("want")) return "Request";

    // Time
    if (lower.includes("time") || lower.includes("when") || lower.includes("schedule") || lower.includes("hours") || lower.includes("clock") || lower.includes("date")) return "Time";

    // Location
    if (lower.includes("where") || lower.includes("location") || lower.includes("place") || lower.includes("address") || lower.includes("city") || lower.includes("country")) return "Location";

    // Weather
    if (lower.includes("weather") || lower.includes("rain") || lower.includes("sunny") || lower.includes("snow") || lower.includes("storm") || lower.includes("forecast")) return "Weather";

    // Health
    if (lower.includes("sick") || lower.includes("health") || lower.includes("doctor") || lower.includes("treatment") || lower.includes("medicine") || lower.includes("symptoms")) return "Health";

    // Travel
    if (lower.includes("travel") || lower.includes("trip") || lower.includes("vacation") || lower.includes("flight") || lower.includes("tour") || lower.includes("journey")) return "Travel";

    // Finance
    if (lower.includes("money") || lower.includes("finance") || lower.includes("payment") || lower.includes("bill") || lower.includes("cost") || lower.includes("budget")) return "Finance";

    // Technology
    if (lower.includes("technology") || lower.includes("computer") || lower.includes("device") || lower.includes("software") || lower.includes("hardware") || lower.includes("app")) return "Technology";

    // Education
    if (lower.includes("education") || lower.includes("school") || lower.includes("study") || lower.includes("learning") || lower.includes("exam") || lower.includes("class")) return "Education";

    // Sports
    if (lower.includes("sports") || lower.includes("game") || lower.includes("football") || lower.includes("basketball") || lower.includes("soccer") || lower.includes("exercise")) return "Sports";

    // Food
    if (lower.includes("food") || lower.includes("eat") || lower.includes("dinner") || lower.includes("lunch") || lower.includes("breakfast") || lower.includes("snack")) return "Food";

    // Music
    if (lower.includes("music") || lower.includes("song") || lower.includes("album") || lower.includes("concert") || lower.includes("band") || lower.includes("artist")) return "Music";

    // Movies
    if (lower.includes("movie") || lower.includes("film") || lower.includes("cinema") || lower.includes("show") || lower.includes("theater") || lower.includes("series")) return "Movies";

    // Technology
    if (lower.includes("tech") || lower.includes("gadget") || lower.includes("software") || lower.includes("code") || lower.includes("programming") || lower.includes("app")) return "Technology";

    // Fashion
    if (lower.includes("fashion") || lower.includes("style") || lower.includes("clothing") || lower.includes("clothes") || lower.includes("outfit") || lower.includes("trend")) return "Fashion";

    // Shopping
    if (lower.includes("shopping") || lower.includes("buy") || lower.includes("store") || lower.includes("sale") || lower.includes("discount") || lower.includes("purchase")) return "Shopping";

    // Relationships
    if (lower.includes("relationship") || lower.includes("friend") || lower.includes("love") || lower.includes("partner") || lower.includes("romantic") || lower.includes("family")) return "Relationships";

    // Politics
    if (lower.includes("politics") || lower.includes("government") || lower.includes("election") || lower.includes("party") || lower.includes("policy") || lower.includes("candidate")) return "Politics";

    // News
    if (lower.includes("news") || lower.includes("headline") || lower.includes("update") || lower.includes("report") || lower.includes("breaking") || lower.includes("story")) return "News";

    // Science
    if (lower.includes("science") || lower.includes("research") || lower.includes("experiment") || lower.includes("discovery") || lower.includes("study") || lower.includes("innovation")) return "Science";

    // History
    if (lower.includes("history") || lower.includes("past") || lower.includes("ancient") || lower.includes("civilization") || lower.includes("timeline") || lower.includes("war")) return "History";

    // Art
    if (lower.includes("art") || lower.includes("painting") || lower.includes("drawing") || lower.includes("sculpture") || lower.includes("artist") || lower.includes("gallery")) return "Art";

    // Literature
    if (lower.includes("book") || lower.includes("literature") || lower.includes("novel") || lower.includes("reading") || lower.includes("author") || lower.includes("poetry")) return "Literature";

    // Pets
    if (lower.includes("dog") || lower.includes("cat") || lower.includes("pet") || lower.includes("animal") || lower.includes("puppy") || lower.includes("kitten")) return "Pets";

    // Hobbies
    if (lower.includes("hobby") || lower.includes("interest") || lower.includes("craft") || lower.includes("DIY") || lower.includes("collecting") || lower.includes("painting")) return "Hobbies";

    // Technology Support
    if (lower.includes("support") || lower.includes("help") || lower.includes("troubleshoot") || lower.includes("issue") || lower.includes("problem") || lower.includes("error")) return "Tech Support";

    // Environment
    if (lower.includes("environment") || lower.includes("nature") || lower.includes("climate") || lower.includes("green") || lower.includes("pollution") || lower.includes("sustainability")) return "Environment";

    // Money
    if (lower.includes("loan") || lower.includes("credit") || lower.includes("debt") || lower.includes("investment") || lower.includes("savings") || lower.includes("bank")) return "Finance";

    // Social Media
    if (lower.includes("social media") || lower.includes("twitter") || lower.includes("facebook") || lower.includes("instagram") || lower.includes("linkedin") || lower.includes("posts")) return "Social Media";

    // Gaming
    if (lower.includes("game") || lower.includes("gaming") || lower.includes("video game") || lower.includes("console") || lower.includes("pc") || lower.includes("playstation")) return "Gaming";

    // Cars
    if (lower.includes("car") || lower.includes("vehicle") || lower.includes("auto") || lower.includes("engine") || lower.includes("drive") || lower.includes("road")) return "Cars";

    // Books
    if (lower.includes("book") || lower.includes("library") || lower.includes("reading") || lower.includes("author") || lower.includes("novel") || lower.includes("story")) return "Books";

    // Holidays
    if (lower.includes("holiday") || lower.includes("vacation") || lower.includes("celebration") || lower.includes("festival") || lower.includes("trip") || lower.includes("season")) return "Holidays";

    // Other
    return "Other";
  };

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 120, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const sortedData = data.slice().sort((a, b) => b.count - a.count);

    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.topic))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count)])
      .range([height, 0]);

    const color = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([minSentiment, maxSentiment]);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    g.selectAll("rect")
      .data(sortedData)
      .enter().append("rect")
      .attr("x", d => x(d.topic))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", d => color(d.sentiment))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`<strong>${d.topic}</strong><br/>Count: ${d.count}<br/>Sentiment: ${d.sentiment.toFixed(2)}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0))
      .on("click", (event, d) => {
        setPopupData(d);
      });

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(y));
  }, [data, minSentiment, maxSentiment]);

  const renderPopup = () => {
    if (!popupData) return null;

    const svgWidth = 600;
    const svgHeight = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const parsedData = popupData.messages.map(d => ({
      ...d,
      date: new Date(d.date)
    }));

    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([minSentiment, maxSentiment])
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.sentiment));

    return (
      <div className="popup">
        <div className="popup-inner">
          <h3>Sentiment Over Time: {popupData.topic}</h3>
          <svg width={svgWidth} height={svgHeight}>
            <g transform={`translate(${margin.left},${margin.top})`}>
              <g transform={`translate(0,${height})`} ref={node => d3.select(node).call(d3.axisBottom(x).ticks(5))} />
              <g ref={node => d3.select(node).call(d3.axisLeft(y).ticks(5))} />
              <path d={line(parsedData)} fill="none" stroke="steelblue" strokeWidth="2" />
              {parsedData.map((d, i) => (
                <circle key={i} cx={x(d.date)} cy={y(d.sentiment)} r={3} fill="red" />
              ))}
            </g>
          </svg>
          <button onClick={() => setPopupData(null)}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className='heat-container'>
      <h2>Sentiment Heatmap by Topic</h2>
      <svg ref={ref} width={1000} height={600}></svg>
      {renderPopup()}
    </div>
  );
}

export default SentimentHeatmap;
