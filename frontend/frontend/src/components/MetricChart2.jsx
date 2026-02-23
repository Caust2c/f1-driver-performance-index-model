import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Rectangle,
  Cell
} from "recharts";

const TEAM_COLORS = {
  "Red Bull Racing": "#3671C6",
  "Ferrari": "#E8002D",
  "Mercedes": "#27F4D2",
  "McLaren": "#FF8000",
  "Aston Martin": "#225941",
  "Alpine": "#0093CC",
  "Williams": "#64C4FF",
  "RB": "#6692FF",
  "Haas": "#B6BABD",
  "Kick Sauber": "#52E252",
  "Default": "#ff1801"
};

const DRIVER_TEAMS = {
  "VER": "Red Bull Racing",
  "LAW": "Red Bull Racing",
  "NOR": "McLaren",
  "PIA": "McLaren",
  "LEC": "Ferrari",
  "HA":  "Ferrari",
  "RUS": "Mercedes",
  "ANT": "Mercedes",
  "ALO": "Aston Martin",
  "STR": "Aston Martin",
  "GAS": "Alpine",
  "DOO": "Alpine",
  "ALB": "Williams",
  "SAI": "Williams",
  "COL": "Williams",
  "TSU": "RB",
  "HAD": "RB",
  "HUL": "Kick Sauber",
  "BOR": "Kick Sauber",
  "OCO": "Haas",
  "BEA": "Haas"
};

const getDriverColor = (driverCode) => {
  const team = DRIVER_TEAMS[driverCode] || "Default";
  return TEAM_COLORS[team] || TEAM_COLORS["Default"];
};

const AnimatedBar = (props) => {
  const { x, y, width, height, fill, isActive } = props;

  return (
    <g>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
      />
      <Rectangle
        {...props}
        fill={fill}
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transform: isActive ? 'scaleX(1)' : 'scaleX(0.2)',
          transition: 'transform 0.2s ease-out',
          pointerEvents: 'none',
        }}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const driverCode = label;
    const teamName = DRIVER_TEAMS[driverCode] || "Unknown Team";
    const teamColor = getDriverColor(driverCode);

    return (
      <div style={{
        backgroundColor: '#15151e',
        border: `1px solid ${teamColor}`,
        padding: '10px',
        color: '#fff',
        fontFamily: '"Orbitron", sans-serif',
        boxShadow: `0 0 15px ${teamColor}40`
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{driverCode}</p>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#bfbfbf' }}>
          {teamName}
        </p>
        <p style={{ margin: '4px 0 0', color: teamColor, fontWeight: 'bold' }}>
          Score: {typeof payload[0].value === 'number' ? payload[0].value.toFixed(3) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function MetricChart2({ title, dataKey, data }) {
  const axisColor = "#bfbfbf";
  const gridColor = "#333333";

  return (
    <div className="mb-5" style={{ 
      background: 'rgba(255,255,255,0.02)', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid rgba(255,255,255,0.1)' 
    }}>
      <h4 className="mb-3" style={{ 
        color: '#fff', 
        fontFamily: '"Orbitron", sans-serif', 
        borderLeft: '4px solid #ff1801', 
        paddingLeft: '10px' 
      }}>
        {title}
      </h4>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

          <XAxis 
            dataKey="driver" 
            stroke={axisColor} 
            tick={{ fill: axisColor, fontSize: 12, fontFamily: 'sans-serif' }}
            tickLine={false}
            axisLine={{ stroke: '#555' }}
          />
          <YAxis 
            stroke={axisColor} 
            tick={{ fill: axisColor, fontSize: 12, fontFamily: 'sans-serif' }}
            tickLine={false}
            axisLine={false} 
          />

          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'transparent' }}
          />

          <Bar 
            dataKey={dataKey} 
            shape={<AnimatedBar />}
            activeBar={<AnimatedBar />}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getDriverColor(entry.driver)} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}