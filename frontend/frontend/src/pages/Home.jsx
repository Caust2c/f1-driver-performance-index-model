import { useEffect, useState } from "react";
import MetricChart from "../components/MetricChart"; 
import FinalChart from "../components/FinalChart";
import TiltCard from "../components/TiltCard"; 
import TrackTracker from "../components/TrackTracker"; 
import "./Home.css";

export default function Home({ selectedDrivers }) {
  const [quali, setQuali] = useState([]);
  const [clean, setClean] = useState([]);
  const [consistency, setConsistency] = useState([]);
  const [firstLap, setFirstLap] = useState([]);
  const [racePositionGain, setRacePositionGain] = useState([]);
  const [tyreWhisperer, setTyreWhisperer] = useState([]);

  const [focusedDriver, setFocusedDriver] = useState(null);
  const [sortBy, setSortBy] = useState("value"); 

  const filterData = (data) => {
    if (!selectedDrivers || selectedDrivers.length === 0) return data;
    const selectedCodes = selectedDrivers.map(name => name.substring(0, 3).toUpperCase());
    return data.filter(item => selectedCodes.includes(item.driver)); 
  };

  useEffect(() => {
    fetch("/data/2025/qualifying.json").then(res => res.json()).then(json => setQuali(filterData(json.data)));
    fetch("/data/2025/clean_air_penalty.json").then(res => res.json()).then(json => setClean(filterData(json.data)));
    fetch("/data/2025/consistency.json").then(res => res.json()).then(json => setConsistency(filterData(json.data)));
    fetch("/data/2025/first_lap.json").then(res => res.json()).then(json => setFirstLap(filterData(json.data)));
    fetch("/data/2025/race_position_gain.json").then(res => res.json()).then(json => setRacePositionGain(filterData(json.data)));
    fetch("/data/2025/tyre_whisperer.json").then(res => res.json()).then(json => setTyreWhisperer(filterData(json.data)));
  }, [selectedDrivers]); 

  const metricProps = {
    dataKey: "value",
    focusedDriver,
    setFocusedDriver,
    sortBy
  };

  return (
    <div className="home-dashboard">
      <header className="dashboard-header">
        <div className="pit-wall-status">
          <span className="live-dot"></span>
          <span>TELEMETRY LINK ACTIVE</span>
        </div>
        <h1>VelocityStats Hub</h1>
        <p>A data-driven breakdown isolating pure driver skill from machinery advantages.</p>
      </header>

      <TrackTracker /> 

      <div className="metrics-container">
        <div className="sector-divider">
          <span className="sector-badge purple">SECTOR 1</span>
          <h3>Raw Pace & Speed</h3>
          <div className="sector-line"></div>
        </div>

        <TiltCard>
          <div className="metric-text">
            <h2>Qualifying Relative Delta</h2>
            <p>Measures a driver's raw single-lap pace relative to their teammate.</p>
          </div>
          <MetricChart title="" data={quali} {...metricProps} />
        </TiltCard>

        <TiltCard>
          <div className="metric-text">
            <h2>Clean Air Penalty</h2>
            <p>Penalizes drivers who fail to extend their delta when running in clean air.</p>
          </div>
          <MetricChart title="" data={clean} {...metricProps} />
        </TiltCard>

        <div className="sector-divider">
          <span className="sector-badge green">SECTOR 2</span>
          <h3>Racecraft & Combat</h3>
          <div className="sector-line"></div>
        </div>

        <TiltCard>
          <div className="metric-text">
            <h2>Lights Out Racecraft</h2>
            <p>Highlights reaction times off the line, spatial awareness, and early aggression.</p>
          </div>
          <MetricChart title="" data={firstLap} {...metricProps} />
        </TiltCard>

        <TiltCard>
          <div className="metric-text">
            <h2>Total Position Delta</h2>
            <p>Compares a driver's starting grid position against their final classification.</p>
          </div>
          <MetricChart title="" data={racePositionGain} {...metricProps} />
        </TiltCard>

        <div className="sector-divider">
          <span className="sector-badge yellow">SECTOR 3</span>
          <h3>Endurance & Strategy</h3>
          <div className="sector-line"></div>
        </div>

        <TiltCard>
          <div className="metric-text">
            <h2>Consistency Rating</h2>
            <p>Evaluates lap-to-lap variance. High scores indicate metronomic driving.</p>
          </div>
          <MetricChart title="" data={consistency} {...metricProps} />
        </TiltCard>

        <TiltCard>
          <div className="metric-text">
            <h2>Tyre Whisperer Index</h2>
            <p>Rewards drivers for exceptional thermal management and extending stints.</p>
          </div>
          <MetricChart title="" data={tyreWhisperer} {...metricProps} />
        </TiltCard>

        <section className="final-section">
          <div className="flag-pattern"></div>
          <h2>The Parc Fermé Index</h2>
          <p>The culmination of all telemetry parameters. Adjust the weights below.</p>
          <div className="final-chart-wrapper">
             <FinalChart metricDataByKey={{
               qualifying: quali, cleanAirPenalty: clean, consistency, firstLap, racePositionGain, tyreWhisperer
             }} season={2025} />
          </div>
        </section>
      </div>
    </div>
  );
}