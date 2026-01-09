import fastf1
import pandas as pd
import json
from pathlib import Path

from metrics.quali_rel import qualifying_relative_to_car
from metrics.tyre_whisperer import tyre_whisperer
from metrics.clean_air_penalty import clean_air_penalty
from metrics.firstlap import first_lap_delta
from metrics.consistency_rating import compute_driver_consistency
from metrics.race_position_gain import race_position_gain


QUALI_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

def save_metric_json(df, *,
                     metric_name,
                     value_col,
                     year,
                     out_dir="data"):
    records = [
        {
            "driver": row["Driver"],
            "value": float(row[value_col])
        }
        for _, row in df.iterrows()
    ]

    payload = {
        "metric": metric_name,
        "season": year,
        "unit": "points",
        "data": records
    }

    Path(out_dir).mkdir(exist_ok=True)

    filename = metric_name.lower().replace(" ", "_")

    with open(f"{out_dir}/{filename}.json", "w") as f:
        json.dump(payload, f, indent=2)



def run_season_tables(year=2025):
    schedule = fastf1.get_event_schedule(year)
    races = schedule['EventName'].tolist()
    all_drivers = set()
    for race in races:
        session = fastf1.get_session(year, race, 'Q')
        session.load()
        all_drivers.update(session.results['Abbreviation'].tolist())
    all_drivers = sorted(all_drivers)
    race_gain_points = {d: 0 for d in all_drivers}
    quali_points = {d: 0 for d in all_drivers}
    tyre_points = {d: 0 for d in all_drivers}
    clean_air_points = {d: 0 for d in all_drivers}
    firstlap_points = {d: 0 for d in all_drivers}
    consistency_values = {d: [] for d in all_drivers}

    for race in races:
        print(f"Processing {race} {year}...")
        quali_df = qualifying_relative_to_car(year, race)
        for i, row in quali_df.head(10).iterrows():
            driver = row['Abbreviation']
            if driver in quali_points:
                quali_points[driver] += QUALI_POINTS[i]
        tyre_df = tyre_whisperer(year, race)
        for _, row in tyre_df.iterrows():
            driver = row['Driver']
            extra_laps = row['ExtraLaps']
            whisper = row['TyreWhisperer']

            if whisper == 'HIGH':
                pts = 2 * extra_laps
            elif whisper == 'LOW':
                pts = 1 * extra_laps
            else:
                pts = 0

            if driver in tyre_points:
                tyre_points[driver] += pts
        clean_air_df = clean_air_penalty(year, race)
        if clean_air_df is not None and not clean_air_df.empty:
            for _, row in clean_air_df.iterrows():
                driver = row['Driver']
                laps_lost = row['Delta']
                if driver in clean_air_points:
                    clean_air_points[driver] -= laps_lost * 1

        firstlap_df = first_lap_delta(year, race)
        for _, row in firstlap_df.iterrows():
            driver = row['Driver']
            delta = row['Delta']

            if delta == 0:
                pts = 1
            elif delta > 0:
                pts = delta + 1
            else:
                pts = delta

            if driver in firstlap_points:
                firstlap_points[driver] += pts

        cons_df = compute_driver_consistency(year, race)
        for _, row in cons_df.iterrows():
            driver = row['Driver']
            score = row['ConsistencyScore']
            if driver in consistency_values:
                consistency_values[driver].append(score)

        race_gain_df = race_position_gain(year, race)
        for _, row in race_gain_df.iterrows():
            driver = row['Driver']
            gain = row['PositionGain']
            pts = gain * 1  
            if driver in race_gain_points:
                race_gain_points[driver] += pts


    df_quali = pd.DataFrame({
        'Driver': quali_points.keys(),
        'QualiPoints': quali_points.values()
    }).sort_values('QualiPoints', ascending=False).reset_index(drop=True)

    df_tyre = pd.DataFrame({
        'Driver': tyre_points.keys(),
        'TyreScore': tyre_points.values()
    }).sort_values('TyreScore', ascending=False).reset_index(drop=True)


    df_clean_air = pd.DataFrame({
        'Driver': clean_air_points.keys(),
        'CleanAirPenalty': clean_air_points.values()
    }).sort_values('CleanAirPenalty', ascending=False).reset_index(drop=True)


    df_firstlap = pd.DataFrame({
        'Driver': firstlap_points.keys(),
        'FirstLapScore': firstlap_points.values()
    }).sort_values('FirstLapScore', ascending=False).reset_index(drop=True)


    df_race_gain = pd.DataFrame({
        'Driver': race_gain_points.keys(),
        'RacePositionGain': race_gain_points.values()
    }).sort_values('RacePositionGain', ascending=False).reset_index(drop=True)


    cons_avg = {
        d: (sum(v) / len(v)) if v else 0
        for d, v in consistency_values.items()
    }

    mean_cons = pd.Series(cons_avg).mean()

    cons_score = {
        d: (val - mean_cons) * -1 if val is not None else 0
        for d, val in cons_avg.items()
    }

    df_consistency = pd.DataFrame({
        'Driver': cons_score.keys(),
        'ConsistencyScore': cons_score.values()
    }).sort_values('ConsistencyScore', ascending=False).reset_index(drop=True)

    save_metric_json(
    df_quali,
    metric_name="Qualifying",
    value_col="QualiPoints",
    year=2025
    )

    save_metric_json(
        df_tyre,
        metric_name="Tyre Whisperer",
        value_col="TyreScore",
        year=2025
    )

    save_metric_json(
        df_clean_air,
        metric_name="Clean Air Penalty",
        value_col="CleanAirPenalty",
        year=2025
    )

    save_metric_json(
        df_firstlap,
        metric_name="First Lap",
        value_col="FirstLapScore",
        year=2025
    )

    save_metric_json(
        df_race_gain,
        metric_name="Race Position Gain",
        value_col="RacePositionGain",
        year=2025
    )

    save_metric_json(
        df_consistency,
        metric_name="Consistency",
        value_col="ConsistencyScore",
        year=2025
    )


    final_df = (
        df_quali
        .merge(df_consistency, on='Driver', how='left')
        .merge(df_tyre, on='Driver', how='left')
        .merge(df_firstlap, on='Driver', how='left')
        .merge(df_clean_air, on='Driver', how='left')
        .merge(df_race_gain, on='Driver', how='left')
    ).fillna(0)

    W_QUALI = 0.50
    W_CONS  = 0.20
    W_TYRE  = 0.03
    W_FIRST = 0.19
    W_CLEAN = 0.15
    W_RACE  = 0.03 

    final_df['FinalScore'] = (
        final_df['QualiPoints']      * W_QUALI +
        final_df['ConsistencyScore'] * W_CONS +
        final_df['TyreScore']        * W_TYRE +
        final_df['FirstLapScore']    * W_FIRST -
        final_df['CleanAirPenalty']  * W_CLEAN +
        final_df['RacePositionGain'] * W_RACE
    )

    final_df = final_df.sort_values('FinalScore', ascending=False).reset_index(drop=True)

    return (
        df_quali,
        df_tyre,
        df_clean_air,
        df_firstlap,
        df_consistency,
        df_race_gain,
        final_df
    )


if __name__ == "__main__":
    (
        quali_table,
        tyre_table,
        clean_air_table,
        firstlap_table,
        consistency_table,
        race_gain_table,
        final_table
    ) = run_season_tables(2025)

    print("\n--- Qualifying ---\n", quali_table)
    print("\n--- Tyre ---\n", tyre_table)
    print("\n--- Clean Air ---\n", clean_air_table)
    print("\n--- First Lap ---\n", firstlap_table)
    print("\n--- Consistency ---\n", consistency_table)
    print("\n--- Race Position Gain ---\n", race_gain_table)
    print("\n--- FINAL DRIVER RANKING ---\n", final_table)
