import fastf1
import pandas as pd

fastf1.Cache.enable_cache('../cache')

def tyre_whisperer(year=2025, race='Las Vegas', session_type='R', std_tol=0.15, min_laps=5):
    
    session = fastf1.get_session(year, race, session_type)
    session.load()
    results = session.results
    finished_drivers = results[
        ~results['Status'].str.contains('Retired|Accident|DNF', case=False, na=False)
    ]['Abbreviation']

    laps = session.laps
    laps = laps[laps['Driver'].isin(finished_drivers)]
    laps = laps[laps['LapTime'].notna()]
    laps_clean = laps[
        laps['PitInTime'].isna() &
        laps['PitOutTime'].isna() &
        (laps['TrackStatus'] == '1') &
        (laps['LapNumber'] != 1)
    ].copy()

    laps_clean['LapTimeSeconds'] = laps_clean['LapTime'].dt.total_seconds()

    stint_stats = (
        laps_clean
        .groupby(['Driver', 'Compound', 'Stint'])
        .agg(
            LapsInStint=('LapNumber', 'count'),
            StdDevLapTime=('LapTimeSeconds', 'std'),
            StartPos=('Position', 'first'),
            EndPos=('Position', 'last')
        )
        .reset_index()
    )
    
    stint_stats['DeltaPos'] = stint_stats['StartPos'] - stint_stats['EndPos']
    compound_baseline = (
        stint_stats
        .groupby('Compound')
        .agg(
            AvgStintLaps=('LapsInStint', 'mean'),
            AvgStdDev=('StdDevLapTime', lambda x: x.mean())
        )
        .reset_index()
    )
    stint_stats = stint_stats.merge(compound_baseline, on='Compound', how='left')
    stint_stats['ExtraLaps'] = stint_stats['LapsInStint'] - stint_stats['AvgStintLaps']
    stint_stats['ExtraLaps'] = stint_stats['ExtraLaps'].clip(lower=0)
    def classify_stint(row):
        if row['ExtraLaps'] <= 0 or row['DeltaPos'] < 0 or row['LapsInStint'] < min_laps:
            return 'NULL'
        elif row['StdDevLapTime'] > row['AvgStdDev'] * (1 + std_tol):
            return 'LOW'
        else:
            return 'HIGH'

    stint_stats['Whisperer'] = stint_stats.apply(classify_stint, axis=1)
    driver_whisperer = (
        stint_stats.groupby('Driver')
        .agg(
            TyreWhisperer=('Whisperer', lambda x: 'HIGH' if 'HIGH' in x.values else ('LOW' if 'LOW' in x.values else 'NULL')),
            ExtraLaps=('ExtraLaps', 'sum'),
            Stints=('Stint', 'count')
        )
        .reset_index()
    )

    return driver_whisperer
if __name__ == "__main__":
    df, session = tyre_whisperer()
    print(df)
