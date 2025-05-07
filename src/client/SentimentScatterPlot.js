
// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import './App.css';

// function SentimentScatterPlot() {
//     const [data, setData] = useState([]);

//     const timestampRef = useRef();
//     const responseTimeRef = useRef();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await fetch("http://localhost:5001/api/plots");
//                 const json = await res.json();

//                 const parsed = json.map(d => ({
//                     ...d,
//                     timestamp: new Date(d.timestamp),
//                     sentiment: +d.sentiment,
//                     responseTime: +d.responseTime
//                 }));
//                 setData(parsed);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//             }
//         };

//         fetchData();
//     }, []);

//     const drawChart = (ref, xKey, xLabel) => {
//         if (data.length === 0) return;

//         const svg = d3.select(ref.current);
//         svg.selectAll("*").remove();

//         const width = 950;
//         const height = 500;
//         const margin = { top: 50, right: 160, bottom: 90, left: 60 };

//         const users = Array.from(new Set(data.map(d => d.sender)));
//         const colorScale = d3.scaleOrdinal()
//             .domain(users)
//             .range(d3.schemeCategory10);

//         const innerWidth = width - margin.left - margin.right;
//         const innerHeight = height - margin.top - margin.bottom;

//         const g = svg.append("g")
//             .attr("transform", `translate(${margin.left}, ${margin.top})`);

//         const x = xKey === 'timestamp'
//             ? d3.scaleTime().domain(d3.extent(data, d => d[xKey])).range([0, innerWidth])
//             : d3.scaleLinear().domain([0, d3.max(data, d => d[xKey]) * 1.1]).range([0, innerWidth]);

//         const y = d3.scaleLinear()
//             .domain([d3.min(data, d => d.sentiment) - 1, d3.max(data, d => d.sentiment) + 1])
//             .range([innerHeight, 0]);

//         const xAxis = g.append("g")
//             .attr("transform", `translate(0, ${innerHeight})`)
//             .call(
//                 xKey === 'timestamp'
//                     ? d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d %H:%M"))
//                     : d3.axisBottom(x)
//             );

//         // Slanted x-axis labels
//         xAxis.selectAll("text")
//             .attr("transform", "rotate(-45)")
//             .style("text-anchor", "end")
//             .attr("dx", "-0.8em")
//             .attr("dy", "0.15em");

//         g.append("g")
//             .call(d3.axisLeft(y))
//             .append("text")
//             .attr("transform", "rotate(-90)")
//             .attr("x", -innerHeight / 2)
//             .attr("y", -40)
//             .attr("fill", "#000")
//             .style("text-anchor", "middle")
//             .text("Sentiment");

//         const tooltip = d3.select("body").append("div")
//             .attr("class", "tooltip")
//             .style("opacity", 0)
//             .style("position", "absolute")
//             .style("background", "#eee")
//             .style("padding", "6px")
//             .style("border", "1px solid #ccc")
//             .style("border-radius", "4px");

//         g.selectAll("circle")
//             .data(data)
//             .enter()
//             .append("circle")
//             .attr("cx", d => x(d[xKey]))
//             .attr("cy", d => y(d.sentiment))
//             .attr("r", 5)
//             .style("fill", d => colorScale(d.sender))
//             .style("opacity", 0.8)
//             .on("mouseover", (event, d) => {
//                 tooltip.transition().duration(200).style("opacity", 1);
//                 tooltip
//                     .html(`<strong>Sender:</strong> ${d.sender}<br/>
//                            <strong>Sentiment:</strong> ${d.sentiment}<br/>
//                            <strong>${xLabel}:</strong> ${xKey === 'timestamp' ? d.timestamp.toLocaleString() : d.responseTime + "s"}`)
//                     .style("left", `${event.pageX + 10}px`)
//                     .style("top", `${event.pageY - 28}px`);
//             })
//             .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

//         // Title
//         svg.append("text")
//             .attr("x", width / 2)
//             .attr("y", margin.top / 2)
//             .attr("text-anchor", "middle")
//             .style("font-size", "20px")
//             .text(`${xLabel} vs Sentiment`);

//         // Legend
//         const legend = svg.append("g")
//             .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

//         users.forEach((user, i) => {
//             const row = legend.append("g")
//                 .attr("transform", `translate(0, ${i * 25})`);

//             row.append("rect")
//                 .attr("width", 18)
//                 .attr("height", 18)
//                 .attr("fill", colorScale(user));

//             row.append("text")
//                 .attr("x", 25)
//                 .attr("y", 14)
//                 .text(user)
//                 .style("font-size", "12px")
//                 .attr("alignment-baseline", "middle");
//         });
//     };

//     useEffect(() => {
//         drawChart(timestampRef, 'timestamp', 'Timestamp');
//         drawChart(responseTimeRef, 'responseTime', 'Response Time');
//     }, [data]);

//     return (
//         <div style={{display: "flex", flexDirection: "column", marginTop: "50px" }}>
//             <div className='scatter-container'>
//                 <svg ref={timestampRef} width={1000} height={500}></svg>

//             </div>
//              <div className='scatter-container'>
//              <svg ref={responseTimeRef} width={1000} height={500}></svg>
//             </div> 
//         </div>
//     );
// }

// export default SentimentScatterPlot;


import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './assets/App.css';

function SentimentScatterPlot() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [allTopics, setAllTopics] = useState(['All']); // Dynamic topic list
  
  // New conversation filter state.
  const [selectedConversation, setSelectedConversation] = useState('All');
  const [conversationList, setConversationList] = useState(['All']);

    const timestampRef = useRef();
    const responseTimeRef = useRef();

    const assignTopic = (message) => {
        const lower = message.toLowerCase();

        if (lower.includes("morning") || lower.includes("evening") || lower.includes("hello") || lower.includes("hi") || lower.includes("greetings")) return "Greeting";
        if (lower.includes("meeting") || lower.includes("event") || lower.includes("work") || lower.includes("project") || lower.includes("task") || lower.includes("office")) return "Work";
        if (lower.includes("happy") || lower.includes("sad") || lower.includes("excited") || lower.includes("angry") || lower.includes("upset") || lower.includes("joy")) return "Emotion";
        if (lower.includes("deadline") || lower.includes("assignment") || lower.includes("workload") || lower.includes("job")) return "Task";
        if (lower.includes("how") || lower.includes("what") || lower.includes("why") || lower.includes("where") || lower.includes("when") || lower.includes("which")) return "Question";
        if (lower.includes("please") || lower.includes("help") || lower.includes("assist") || lower.includes("support") || lower.includes("need") || lower.includes("want")) return "Request";
        if (lower.includes("time") || lower.includes("schedule") || lower.includes("hours") || lower.includes("clock") || lower.includes("date")) return "Time";
        if (lower.includes("location") || lower.includes("place") || lower.includes("address") || lower.includes("city") || lower.includes("country")) return "Location";
        if (lower.includes("weather") || lower.includes("rain") || lower.includes("sunny") || lower.includes("snow") || lower.includes("storm") || lower.includes("forecast")) return "Weather";
        if (lower.includes("sick") || lower.includes("health") || lower.includes("doctor") || lower.includes("treatment") || lower.includes("medicine") || lower.includes("symptoms")) return "Health";
        if (lower.includes("travel") || lower.includes("trip") || lower.includes("vacation") || lower.includes("flight") || lower.includes("tour") || lower.includes("journey")) return "Travel";
        if (lower.includes("money") || lower.includes("finance") || lower.includes("payment") || lower.includes("bill") || lower.includes("cost") || lower.includes("budget")) return "Finance";
        if (lower.includes("technology") || lower.includes("computer") || lower.includes("device") || lower.includes("software") || lower.includes("hardware") || lower.includes("app") || lower.includes("code") || lower.includes("programming")) return "Technology";
        if (lower.includes("education") || lower.includes("school") || lower.includes("study") || lower.includes("learning") || lower.includes("exam") || lower.includes("class")) return "Education";
        if (lower.includes("sports") || lower.includes("game") || lower.includes("football") || lower.includes("basketball") || lower.includes("soccer") || lower.includes("exercise")) return "Sports";
        if (lower.includes("food") || lower.includes("eat") || lower.includes("dinner") || lower.includes("lunch") || lower.includes("breakfast") || lower.includes("snack")) return "Food";
        if (lower.includes("music") || lower.includes("song") || lower.includes("album") || lower.includes("concert") || lower.includes("band") || lower.includes("artist")) return "Music";
        if (lower.includes("movie") || lower.includes("film") || lower.includes("cinema") || lower.includes("show") || lower.includes("theater") || lower.includes("series")) return "Movies";
        if (lower.includes("fashion") || lower.includes("style") || lower.includes("clothing") || lower.includes("clothes") || lower.includes("outfit") || lower.includes("trend")) return "Fashion";
        if (lower.includes("shopping") || lower.includes("buy") || lower.includes("store") || lower.includes("sale") || lower.includes("discount") || lower.includes("purchase")) return "Shopping";
        if (lower.includes("relationship") || lower.includes("friend") || lower.includes("love") || lower.includes("partner") || lower.includes("romantic") || lower.includes("family")) return "Relationships";
        if (lower.includes("politics") || lower.includes("government") || lower.includes("election") || lower.includes("party") || lower.includes("policy") || lower.includes("candidate")) return "Politics";
        if (lower.includes("news") || lower.includes("headline") || lower.includes("update") || lower.includes("report") || lower.includes("breaking") || lower.includes("story")) return "News";
        if (lower.includes("science") || lower.includes("research") || lower.includes("experiment") || lower.includes("discovery") || lower.includes("study") || lower.includes("innovation")) return "Science";
        if (lower.includes("history") || lower.includes("past") || lower.includes("ancient") || lower.includes("civilization") || lower.includes("timeline") || lower.includes("war")) return "History";
        if (lower.includes("art") || lower.includes("painting") || lower.includes("drawing") || lower.includes("sculpture") || lower.includes("artist") || lower.includes("gallery")) return "Art";
        if (lower.includes("literature") || lower.includes("novel") || lower.includes("reading") || lower.includes("author") || lower.includes("poetry")) return "Literature";
        if (lower.includes("dog") || lower.includes("cat") || lower.includes("pet") || lower.includes("animal") || lower.includes("puppy") || lower.includes("kitten")) return "Pets";
        if (lower.includes("hobby") || lower.includes("interest") || lower.includes("craft") || lower.includes("DIY") || lower.includes("collecting") || lower.includes("painting")) return "Hobbies";
        if (lower.includes("support") || lower.includes("troubleshoot") || lower.includes("issue") || lower.includes("problem") || lower.includes("error")) return "Tech Support";
        if (lower.includes("environment") || lower.includes("nature") || lower.includes("climate") || lower.includes("green") || lower.includes("pollution") || lower.includes("sustainability")) return "Environment";
        if (lower.includes("loan") || lower.includes("credit") || lower.includes("debt") || lower.includes("investment") || lower.includes("savings") || lower.includes("bank")) return "Finance";
        if (lower.includes("social media") || lower.includes("twitter") || lower.includes("facebook") || lower.includes("instagram") || lower.includes("linkedin") || lower.includes("posts")) return "Social Media";
        if (lower.includes("gaming") || lower.includes("video game") || lower.includes("console") || lower.includes("pc") || lower.includes("playstation")) return "Gaming";
        if (lower.includes("car") || lower.includes("vehicle") || lower.includes("auto") || lower.includes("engine") || lower.includes("drive") || lower.includes("road")) return "Cars";
        if (lower.includes("book") || lower.includes("library") || lower.includes("reading") || lower.includes("author") || lower.includes("story")) return "Books";
        if (lower.includes("holiday") || lower.includes("celebration") || lower.includes("festival") || lower.includes("season")) return "Holidays";

        return "Other";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/plots");
                const json = await res.json();

                const parsed = json.map(d => ({
                    ...d,
                    timestamp: new Date(d.timestamp),
                    sentiment: +d.sentiment,
                    responseTime: +d.responseTime,
          topic: assignTopic(d.message),
          // Use existing conversation property if available, or set to "Default".
          conversation: d.conversation || "Default"
                }));

                setData(parsed);
                setFilteredData(parsed);

                const uniqueTopics = Array.from(new Set(parsed.map(d => d.topic))).sort();
                setAllTopics(['All', ...uniqueTopics]);

        // Build conversation dropdown list.
        const uniqueConversations = Array.from(new Set(parsed.map(d => d.conversation))).sort();
        setConversationList(['All', ...uniqueConversations]);

        // Set initial filtered data.
        setFilteredData(parsed);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
    let filtered = data;
    
    if (selectedTopic !== "All") {
      filtered = filtered.filter(d => d.topic === selectedTopic);
    }
    if (selectedConversation !== "All") {
      filtered = filtered.filter(d => d.conversation === selectedConversation);
        }
    setFilteredData(filtered);
  }, [selectedTopic, selectedConversation, data]);

    const drawChart = (ref, xKey, xLabel) => {
        if (filteredData.length === 0) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 950;
        const height = 500;
        const margin = { top: 50, right: 160, bottom: 90, left: 60 };

        const users = Array.from(new Set(filteredData.map(d => d.sender)));
        const colorScale = d3.scaleOrdinal()
            .domain(users)
            .range(d3.schemeCategory10);

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = xKey === 'timestamp'
            ? d3.scaleTime().domain(d3.extent(filteredData, d => d[xKey])).range([0, innerWidth])
            : d3.scaleLinear().domain([0, d3.max(filteredData, d => d[xKey]) * 1.1]).range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.sentiment) - 1, d3.max(filteredData, d => d.sentiment) + 1])
            .range([innerHeight, 0]);

        const xAxis = g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(
                xKey === 'timestamp'
                    ? d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d %H:%M"))
                    : d3.axisBottom(x)
            );

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
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d[xKey]))
            .attr("cy", d => y(d.sentiment))
            .attr("r", 5)
            .style("fill", d => colorScale(d.sender))
            .style("opacity", 0.8)
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>Sender:</strong> ${d.sender}<br/>
                              <strong>Sentiment:</strong> ${d.sentiment}<br/>
                              <strong>${xLabel}:</strong> ${xKey === 'timestamp' ? d.timestamp.toLocaleString() : d.responseTime + "s"}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text(`${xLabel} vs Sentiment`);

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
    }, [filteredData]);

    return (
        <div style={{ marginTop: "50px" }}>
      {/* Dropdown to select Topic */}
      <div style={{ marginBottom: "10px", marginLeft: "20px" }}>
                <label style={{ marginRight: "10px" }}>Filter by Topic:</label>
                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                    {allTopics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>
            </div>
      
      {/* Dropdown to select Conversation */}
      <div style={{ marginBottom: "20px", marginLeft: "20px" }}>
        <label style={{ marginRight: "10px" }}>Filter by Conversation:</label>
        <select value={selectedConversation} onChange={(e) => setSelectedConversation(e.target.value)}>
          {conversationList.map(conv => (
            <option key={conv} value={conv}>{conv}</option>
          ))}
        </select>
      </div>

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
