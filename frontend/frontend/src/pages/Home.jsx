import { useEffect, useState } from "react";
import MetricChart from "../components/MetricChart";

export default function Home() {
  const [quali, setQuali] = useState([]);
  const [final, setFinal] = useState([]);

  useEffect(() => {
    fetch("/data/2025/qualifying.json")
      .then(res => res.json())
      .then(json => setQuali(json.data));

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

      <MetricChart
        title="Final Driver Ranking"
        data={final}
        dataKey="value"
      />
    </>
  );
}
