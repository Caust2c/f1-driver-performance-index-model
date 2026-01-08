import fastf1
import pandas as pd

fastf1.Cache.enable_cache('../cache')


def first_lap_delta(year=2025, race='Hungary', session_type='R'):
    session = fastf1.get_session(year, race, session_type)
    session.load()

    results = session.results
    num_to_abbr = dict(zip(results['DriverNumber'], results['Abbreviation']))

    grid = dict(zip(results['DriverNumber'], results['GridPosition']))

    laps = session.laps.pick_drivers(results['DriverNumber'])

    lap1_end = (
        laps[laps['LapNumber'] == 1]
        .sort_values('Time')
        .groupby('DriverNumber', as_index=False)
        .last()
    )

    records = []

    for _, row in lap1_end.iterrows():
        num = row['DriverNumber']
        if num not in grid:
            continue

        start = grid[num]
        end = row['Position']

        if pd.isna(end):
            continue

        delta = start - end

        records.append({
            'Driver': num_to_abbr[num],
            'Delta': int(delta)
        })

    return pd.DataFrame(records)
