import fastf1
fastf1.Cache.enable_cache('../cache')

def first_lap_delta(year=2025, race='Hungary', session_type='R'):
    session = fastf1.get_session(year, race, session_type)
    session.load()

    grid = dict(zip(session.results['Abbreviation'], session.results['GridPosition']))

    lap1 = session.laps[session.laps['LapNumber'] == 1]
    lap1_end = lap1.sort_values('Time').groupby('Driver').tail(1)

    return {
        d: grid[d] - p
        for d, p in zip(lap1_end['Driver'], lap1_end['Position'])
        if d in grid
    }

if __name__ == "__main__":
    print(first_lap_delta())
