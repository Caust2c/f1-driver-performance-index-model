import { useEffect, useState } from "react";
import MetricChart from "../components/MetricChart";
import FinalChart from "../components/FinalChart";

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
      <FinalChart metricDataByKey={metricDataByKey} season={2025} />
      <p>Use the sliders above to set your own metric weights and generate a custom final ranking.</p>
    </>
  );
}
