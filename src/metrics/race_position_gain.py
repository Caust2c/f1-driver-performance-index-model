import fastf1
import pandas as pd

fastf1.Cache.enable_cache('../cache')


def race_position_gain(year=2025, race='Hungary', session_type='R'):

    session = fastf1.get_session(year, race, session_type)
    session.load()

    results = session.results

    df = pd.DataFrame({
        'Driver': results['Abbreviation'],
        'Grid': results['GridPosition'],
        'Finish': results['Position']
    })
    df = df.dropna(subset=['Grid', 'Finish'])

    df['PositionGain'] = df['Grid'] - df['Finish']

    return df[['Driver', 'PositionGain']]
