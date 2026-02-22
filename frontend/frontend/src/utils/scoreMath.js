const DRIVER_ALIASES = {
	DO: "DOO",
	HA: "HAM",
};

const METRIC_CONFIG = {
	qualifying: { label: "Qualifying", invert: false },
	cleanAirPenalty: { label: "Clean Air Penalty", invert: true },
	consistency: { label: "Consistency", invert: false },
	firstLap: { label: "First Lap", invert: false },
	racePositionGain: { label: "Race Position Gain", invert: false },
	tyreWhisperer: { label: "Tyre Whisperer", invert: false },
};

const metricKeys = Object.keys(METRIC_CONFIG);

function normalizeDriverCode(driver) {
	return DRIVER_ALIASES[driver] ?? driver;
}

function asDriverMap(data = []) {
	const map = new Map();

	data.forEach(({ driver, value }) => {
		const normalizedDriver = normalizeDriverCode(driver);
		map.set(normalizedDriver, Number(value ?? 0));
	});

	return map;
}

function normalizeMetricValues(metricMap, invert = false) {
	const values = Array.from(metricMap.values());
	if (!values.length) {
		return new Map();
	}

	const min = Math.min(...values);
	const max = Math.max(...values);

	if (min === max) {
		const equalMap = new Map();
		metricMap.forEach((_, driver) => {
			equalMap.set(driver, 50);
		});
		return equalMap;
	}

	const normalized = new Map();
	metricMap.forEach((value, driver) => {
		const ratio = (value - min) / (max - min);
		const scaled = invert ? (1 - ratio) * 100 : ratio * 100;
		normalized.set(driver, scaled);
	});

	return normalized;
}

export function getDefaultWeights() {
	return metricKeys.reduce((acc, key) => {
		acc[key] = 1;
		return acc;
	}, {});
}

export function computeWeightedFinalScores(metricDataByKey = {}, rawWeights = {}) {
	const weights = { ...getDefaultWeights(), ...rawWeights };

	const normalizedMetricMaps = metricKeys.reduce((acc, key) => {
		const rawMap = asDriverMap(metricDataByKey[key] ?? []);
		acc[key] = normalizeMetricValues(rawMap, METRIC_CONFIG[key].invert);
		return acc;
	}, {});

	const drivers = new Set();
	metricKeys.forEach((key) => {
		normalizedMetricMaps[key].forEach((_, driver) => drivers.add(driver));
	});

	const totalWeight = metricKeys.reduce((sum, key) => sum + Number(weights[key] ?? 0), 0);
	if (!drivers.size || totalWeight <= 0) {
		return [];
	}

	const finalScores = Array.from(drivers).map((driver) => {
		const weightedScore = metricKeys.reduce((sum, key) => {
			const metricScore = normalizedMetricMaps[key].get(driver) ?? 0;
			const metricWeight = Number(weights[key] ?? 0);
			return sum + metricScore * metricWeight;
		}, 0);

		return {
			driver,
			value: Number((weightedScore / totalWeight).toFixed(2)),
		};
	});

	return finalScores.sort((a, b) => b.value - a.value);
}

export function buildFinalJsonPayload(finalData, season = 2025) {
	return {
		metric: "Final Driver Ranking",
		season,
		unit: "points",
		data: finalData,
	};
}

export { METRIC_CONFIG, metricKeys };
