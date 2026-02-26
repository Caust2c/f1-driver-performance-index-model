import { useState, useEffect } from "react";
import "./F1StartLoader.css";

export default function F1StartLoader() {
  const [count, setCount] = useState("READY");
  const [animState, setAnimState] = useState("crossed");

  useEffect(() => {
    const sequence = [
      { time: 600, text: "3", state: "pulsing" },
      { time: 1200, text: "2", state: "pulsing" },
      { time: 1800, text: "1", state: "pulsing" },
      { time: 2400, text: "GO!", state: "go" },
    ];

    const timeouts = sequence.map((item) =>
      setTimeout(() => {
        setCount(item.text);
        setAnimState(item.state);
      }, item.time)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className={`f1-start-loader-overlay state-${animState}`}>
      <div className="flags-stage">
        <FlagSvg className="flag flag-left" />
        {/* ADDED: flipped={true} to mirror the right flag! */}
        <FlagSvg className="flag flag-right" flipped={true} />
      </div>
      <h1 key={count} className="countdown-text">{count}</h1>
      <div className="loader-track-floor"></div>
    </div>
  );
}

// ADDED: Accepts the "flipped" prop
function FlagSvg({ className, flipped }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ADDED: This <g> tag horizontally flips the drawing if flipped=true */}
      <g transform={flipped ? "translate(100, 0) scale(-1, 1)" : ""}>
        <rect x="2" y="0" width="4" height="100" fill="#444" />
        <g fill="#fff">
          <rect x="6" y="5" width="20" height="20" />
          <rect x="46" y="5" width="20" height="20" />
          <rect x="26" y="25" width="20" height="20" />
          <rect x="66" y="25" width="20" height="20" />
          <rect x="6" y="45" width="20" height="20" />
          <rect x="46" y="45" width="20" height="20" />
        </g>
        <g fill="#111">
          <rect x="26" y="5" width="20" height="20" />
          <rect x="66" y="5" width="20" height="20" />
          <rect x="6" y="25" width="20" height="20" />
          <rect x="46" y="25" width="20" height="20" />
          <rect x="26" y="45" width="20" height="20" />
          <rect x="66" y="45" width="20" height="20" />
        </g>
      </g>
    </svg>
  );
}