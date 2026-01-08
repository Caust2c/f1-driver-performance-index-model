import fastf1
fastf1.Cache.enable_cache('../cache')

def compute_driver_consistency(year=2025, race='Hungary', session_type='R'):
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
        .groupby(['Driver', 'Stint'])
        .agg(
            LapsInStint=('LapNumber', 'count'),
            StdDevLapTime=('LapTimeSeconds', 'std')
        )
        .reset_index()
    )
    stint_stats['WeightedStd'] = (
        stint_stats['LapsInStint'] * stint_stats['StdDevLapTime']
    )
    driver_scores = (
        stint_stats
        .groupby('Driver')
        .agg(
            ConsistencyScore=('WeightedStd', 'sum'),
            TotalLaps=('LapsInStint', 'sum'),
            Stints=('Stint', 'count')
        )
        .reset_index()
        .sort_values('ConsistencyScore')
    )

    return driver_scores
if __name__ == "__main__":
    driver_scores = compute_driver_consistency()

    print("\nDriver Consistency Ranking (lower = better):\n")
    print(driver_scores)
