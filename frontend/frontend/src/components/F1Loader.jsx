import "./F1Loader.css";

export default function F1Loader({ text = "PROCESSING TELEMETRY..." }) {
  return (
    <div className="f1-loader-overlay">
      <div className="tyre-spinner">
        <div className="tyre-inner"></div>
      </div>
      <h2 className="loader-text">{text}</h2>
      <div className="loading-bar-container">
        <div className="loading-bar-fill"></div>
      </div>
    </div>
  );
}