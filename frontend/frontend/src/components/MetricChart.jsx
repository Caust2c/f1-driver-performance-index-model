import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

// Official 2025 F1 Team Colors mapped to Driver Abbreviations
const driverColors = {
  LEC: "#E8002D", HAM: "#E8002D", // Ferrari
  NOR: "#FF8000", PIA: "#FF8000", // McLaren
  VER: "#3671C6", PER: "#3671C6", // Red Bull
  RUS: "#27F4D2", ANT: "#27F4D2", // Mercedes
  ALO: "#229971", STR: "#229971", // Aston Martin
  GAS: "#FF87BC", DOO: "#FF87BC", // Alpine
  ALB: "#64C4FF", SAI: "#64C4FF", // Williams
  OCO: "#FFFFFF", BEA: "#FFFFFF", // Haas
  TSU: "#6692FF", HAD: "#6692FF", // VCARB
  HUL: "#00E701", BOR: "#00E701", // Kick Sauber
};

export default function MetricChart({ title, data, dataKey }) {
  if (!data || data.length === 0) return <p style={{ color: "#888", textAlign: "center" }}>No telemetry data available for this selection.</p>;

  return (
    <div style={{ width: "100%", height: 350 }}>
      {title && <h3 style={{ color: "#fff", marginBottom: "20px" }}>{title}</h3>}
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          
          <XAxis 
            dataKey="driver" 
            stroke="#888" 
            tick={{ fill: "#888", fontFamily: "Orbitron", fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: "#444" }}
          />
          
          <YAxis 
            stroke="#888" 
            tick={{ fill: "#888", fontFamily: "sans-serif", fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: "#444" }}
          />
          
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            contentStyle={{ backgroundColor: "#111", border: "1px solid #444", borderRadius: "8px", color: "#fff" }}
            itemStyle={{ color: "#fff", fontWeight: "bold" }}
          />
          
          <Bar
            dataKey={dataKey}
            maxBarSize={60}
            radius={[6, 6, 0, 0]} 
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={driverColors[entry.driver] || "#ff1e1e"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}