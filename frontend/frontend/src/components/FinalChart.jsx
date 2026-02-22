import { useMemo, useState } from "react";
import MetricChart from "./MetricChart";
import {
	METRIC_CONFIG,
	metricKeys,
	getDefaultWeights,
	computeWeightedFinalScores,
	buildFinalJsonPayload,
} from "../utils/scoreMath";

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
			<h4 className="mb-3">Custom Final Driver Ranking</h4>

			<div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
				{metricKeys.map((key) => (
					<label
						key={key}
						style={{
							display: "grid",
							gridTemplateColumns: "220px 1fr 70px",
							gap: "0.75rem",
							alignItems: "center",
						}}
					>
						<span>{METRIC_CONFIG[key].label}</span>
						<input
							type="range"
							min="0"
							max="10"
							step="0.5"
							value={weights[key]}
							onChange={(event) => updateWeight(key, event.target.value)}
						/>
						<input
							type="number"
							min="0"
							max="10"
							step="0.5"
							value={weights[key]}
							onChange={(event) => updateWeight(key, event.target.value)}
							style={{ width: "70px" }}
						/>
					</label>
				))}
			</div>

			<div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
				<button type="button" onClick={resetWeights}>
					Reset Weights
				</button>
				<button type="button" onClick={downloadFinalJson} disabled={!finalData.length}>
					Download final.json
				</button>
			</div>

			<MetricChart title="Final Driver Ranking (Weighted)" data={finalData} dataKey="value" />
		</section>
	);
}
