import { useMemo, useState } from "react";
import MetricChart from "./MetricChart";
import {
    METRIC_CONFIG,
    metricKeys,
    getDefaultWeights,
    computeWeightedFinalScores,
    buildFinalJsonPayload,
} from "../utils/scoreMath";
import "../FinalChart.css";

export default function FinalChart({ metricDataByKey, season = 2025 }) {
    const [weights, setWeights] = useState(getDefaultWeights);

    const finalData = useMemo(() => {
        return computeWeightedFinalScores(metricDataByKey, weights);
    }, [metricDataByKey, weights]);

    function updateWeight(metricKey, nextValue) {
        const safeValue = Number(nextValue);
        setWeights((prev) => ({
            ...prev,
            [metricKey]: Number.isFinite(safeValue) && safeValue >= 0 ? safeValue : 0,
        }));
    }

    function resetWeights() {
        setWeights(getDefaultWeights());
    }

    function downloadFinalJson() {
        const payload = buildFinalJsonPayload(finalData, season);
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "final.json";
        anchor.click();
        URL.revokeObjectURL(url);
    }

    return (
        <section className="mb-5">
            <div className="weight-control-panel">
                {metricKeys.map((key) => (
                    <label key={key} className="weight-row">
                        <span className="weight-label">{METRIC_CONFIG[key].label}</span>
                        <input
                            type="range"
                            className="f1-slider"
                            min="0"
                            max="10"
                            step="0.5"
                            value={weights[key]}
                            onChange={(event) => updateWeight(key, event.target.value)}
                        />
                        <input
                            type="number"
                            className="f1-number-input"
                            min="0"
                            max="10"
                            step="0.5"
                            value={weights[key]}
                            onChange={(event) => updateWeight(key, event.target.value)}
                        />
                    </label>
                ))}
            </div>

            <p className="instruction-text">
                Tweak the telemetry weights above to generate a custom Final Driver Ranking.
            </p>

            <div className="f1-separator"></div>

            <div className="final-chart-wrapper">
                <MetricChart title="Final Weighted Standings" data={finalData} dataKey="value" />
            </div>

            <div className="button-group">
                <button type="button" className="f1-button secondary" onClick={resetWeights}>
                    Reset Weights
                </button>
                <button 
                    type="button" 
                    className="f1-button primary" 
                    onClick={downloadFinalJson} 
                    disabled={!finalData.length}
                >
                    Export JSON Data
                </button>
            </div>

            <div className="checkered-footer"></div>
        </section>
    );
}