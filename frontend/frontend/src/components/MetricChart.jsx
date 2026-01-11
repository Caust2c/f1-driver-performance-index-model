import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MetricChart({ title, dataKey, data }) {
  return (
    <div className="mb-5">
      <h4 className="mb-3">{title}</h4>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="driver" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
