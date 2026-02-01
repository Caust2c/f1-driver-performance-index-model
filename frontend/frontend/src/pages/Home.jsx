import { useEffect, useState } from "react";
import MetricChart from "../components/MetricChart";

export default function Home() {
  const [quali, setQuali] = useState([]);
  const [final, setFinal] = useState([]);
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
    
    fetch("/data/2025/final.json")
      .then(res => res.json())
      .then(json => setFinal(json.data));
  }, []);

  return (
    <>
      <MetricChart
        title="Qualifying Performance"
        data={quali}
        dataKey="value"
      />
      <p>Desc about Quali</p>
      <MetricChart
        title="Clean Air Performance"
        data={clean}
        dataKey="value"
      />
      <p>Desc about Clean Air</p>
      <MetricChart
        title="Constency of the drivers"
        data={consistency}
        dataKey="value"
      />
      <p>Desc about Consistency</p>
      <MetricChart
        title="First Lap Gain/Loss"
        data={firstLap}
        dataKey="value"
      />
      <p>Desc about First Lap</p>
      <MetricChart
        title="Race Postition Gain/Loss"
        data={racePositionGain}
        dataKey="value"
      />
      <p>Desc about Race Position Gain</p>
      <MetricChart
        title="Tyre Whisperer Metric"
        data={tyreWhisperer}
        dataKey="value"
      />
      <p>Desc about Tyre Whisperer</p>
      <MetricChart
        title="Final Driver Ranking"
        data={final}
        dataKey="value"
      />
      <p>Desc about Final Ranking</p>
    </>
  );
}
