import fastf1
import pandas as pd

fastf1.Cache.enable_cache('../cache')

def qualifying_relative_to_car(year=2025, race='Hungary', session_type='Q'):
    session = fastf1.get_session(year, race, session_type)
    session.load()

    results = session.results[['Abbreviation', 'TeamName', 'Position']].dropna()
    results['Position'] = results['Position'].astype(int)

    team_avg = (
        results
        .groupby('TeamName')['Position']
        .mean()
        .rename('TeamAvgPos')
        .reset_index()
    )

    merged = results.merge(team_avg, on='TeamName')
    merged['QualiDelta'] = merged['TeamAvgPos'] - merged['Position']

    return (
        merged[['Abbreviation', 'TeamName', 'Position', 'TeamAvgPos', 'QualiDelta']]
        .sort_values('QualiDelta', ascending=False)
        .reset_index(drop=True)
    )


if __name__ == "__main__":
    df = qualifying_relative_to_car()
    print(df)
