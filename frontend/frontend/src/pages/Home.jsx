import { useEffect, useState } from "react";
import MetricChart from "../components/MetricChart"; 
import FinalChart from "../components/FinalChart";
import "../Home.css";

export default function Home() {
  const [quali, setQuali] = useState([]);
  const [clean, setClean] = useState([]);
  const [consistency, setConsistency] = useState([]);
  const [firstLap, setFirstLap] = useState([]);
  const [racePositionGain, setRacePositionGain] = useState([]);
  const [tyreWhisperer, setTyreWhisperer] = useState([]);

  useEffect(() => {
    fetch("/data/2025/qualifying.json")
      .then(res => res.json())
      .then(json => setQuali(json.data));

    fetch("/data/2025/clean_air_penalty.json")
      .then(res => res.json())
      .then(json => setClean(json.data));

    fetch("/data/2025/consistency.json")
      .then(res => res.json())
      .then(json => setConsistency(json.data));

    fetch("/data/2025/first_lap.json")
      .then(res => res.json())
      .then(json => setFirstLap(json.data));

    fetch("/data/2025/race_position_gain.json")
      .then(res => res.json())
      .then(json => setRacePositionGain(json.data));

    fetch("/data/2025/tyre_whisperer.json")
      .then(res => res.json())
      .then(json => setTyreWhisperer(json.data));
  }, []);

  const metricDataByKey = {
    qualifying: quali,
    cleanAirPenalty: clean,
    consistency,
    firstLap,
    racePositionGain,
    tyreWhisperer,
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

      <div className="metrics-container">
        
        {/* ================= SECTOR 1 ================= */}
        <div className="sector-divider">
          <span className="sector-badge purple">SECTOR 1</span>
          <h3>Raw Pace & Speed</h3>
          <div className="sector-line"></div>
        </div>

        <section className="metric-card">
          <div className="metric-text">
            <h2>Qualifying Relative Delta</h2>
            <p>
              Measures a driver's raw single-lap pace relative to their teammate. By comparing Q3 times within the same garage, this metric extracts the car's baseline performance, revealing who truly maximizes their machinery when the track rubbers in.
            </p>
          </div>
          <MetricChart title="" data={quali} dataKey="value" />
        </section>

        <section className="metric-card">
          <div className="metric-text">
            <h2>Clean Air Penalty</h2>
            <p>
              A balancing metric designed to penalize drivers who fail to extend their delta when running in clean air. It ensures drivers aren't artificially boosted simply because their dominant car allows them to coast out front away from the turbulent dirty air of the pack.
            </p>
          </div>
          <MetricChart title="" data={clean} dataKey="value" />
        </section>

        {/* ================= SECTOR 2 ================= */}
        <div className="sector-divider">
          <span className="sector-badge green">SECTOR 2</span>
          <h3>Racecraft & Combat</h3>
          <div className="sector-line"></div>
        </div>

        <section className="metric-card">
          <div className="metric-text">
            <h2>Lights Out Racecraft</h2>
            <p>
              Judges a driver purely on the opening lap. This metric highlights reaction times off the line, spatial awareness into Turn 1, and early aggression by tracking positions gained or lost before DRS is enabled and the race settles.
            </p>
          </div>
          <MetricChart title="" data={firstLap} dataKey="value" />
        </section>

        <section className="metric-card">
          <div className="metric-text">
            <h2>Total Position Delta</h2>
            <p>
              Compares a driver's starting grid position against their final classification. This provides a broad overview of their Sunday execution, capturing overtaking ability into braking zones, defensive driving, and capitalizing on Safety Car chaos.
            </p>
          </div>
          <MetricChart title="" data={racePositionGain} dataKey="value" />
        </section>

        {/* ================= SECTOR 3 ================= */}
        <div className="sector-divider">
          <span className="sector-badge yellow">SECTOR 3</span>
          <h3>Endurance & Strategy</h3>
          <div className="sector-line"></div>
        </div>

        <section className="metric-card">
          <div className="metric-text">
            <h2>Consistency Rating</h2>
            <p>
              Evaluates lap-to-lap variance. By calculating the standard deviation of lap times within a single tyre stint, this algorithm rates drivers higher for lower deviation. A high score indicates a metronomic driver who stays off the marbles and makes minimal errors.
            </p>
          </div>
          <MetricChart title="" data={consistency} dataKey="value" />
        </section>

        <section className="metric-card">
          <div className="metric-text">
            <h2>Tyre Whisperer Index</h2>
            <p>
              Rewards drivers for exceptional thermal management. Drivers score highly if they extend a stint significantly beyond Pirelli's expected degradation cliff, while simultaneously maintaining pace without excessive drop-off.
            </p>
          </div>
          <MetricChart title="" data={tyreWhisperer} dataKey="value" />
        </section>

        {/* ================= CHEQUERED FLAG ================= */}
        <section className="final-section">
          <div className="flag-pattern"></div>
          <h2>The Parc Fermé Index</h2>
          <p>The culmination of all telemetry parameters. Use the chart below to view the definitive driver rankings based on the weighted VelocityStats model.</p>
          <FinalChart metricDataByKey={metricDataByKey} season={2025} />
        </section>

      </div>
    </div>
  );
}