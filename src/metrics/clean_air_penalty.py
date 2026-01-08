import fastf1
import pandas as pd
fastf1.Cache.enable_cache('../cache')

def clean_air_penalty(year=2025, race='Miami', session_type='R'):
    if year != 2025:
        return None

    session = fastf1.get_session(year, race, session_type)
    session.load()

    results = session.results
    pole_row = results[results['GridPosition'] == 1]
    if pole_row.empty:
        return None

    pole_driver = pole_row['Abbreviation'].iloc[0]

    laps = session.laps
    laps = laps[laps['Driver'] == pole_driver]

    first_pit_lap = laps[laps['PitInTime'].notna()]['LapNumber'].min()
    if first_pit_lap is not None:
        laps = laps[laps['LapNumber'] < first_pit_lap]

    post_start = laps[laps['LapNumber'] > 1]
    if post_start.empty:
        return None

    first_loss = post_start[post_start['Position'] > 1].sort_values('LapNumber').head(1)
    if first_loss.empty:
        return None

    delta = 1 - int(first_loss['Position'].iloc[0])

    return pd.DataFrame([{
    'Driver': pole_driver,
    'Delta': delta
}])


if __name__ == "__main__":
    print(clean_air_penalty())
