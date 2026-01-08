import fastf1
fastf1.Cache.enable_cache('../cache')

def pole_loss_penalty_2025(session_type='R'):
    year = 2025
    schedule = fastf1.get_event_schedule(year)
    outputs = []

    for _, event in schedule.iterrows():
        race = event['EventName']

        session = fastf1.get_session(year, race, session_type)
        session.load()

        results = session.results
        pole_row = results[results['GridPosition'] == 1]
        if pole_row.empty:
            continue

        pole_driver = pole_row['Abbreviation'].iloc[0]

        laps = session.laps
        laps = laps[laps['Driver'] == pole_driver]
        lap1 = laps[laps['LapNumber'] == 1]
        if lap1.empty or lap1['Position'].iloc[0] != 1:
            continue
        first_pit_lap = laps[laps['PitInTime'].notna()]['LapNumber'].min()
        if first_pit_lap is not None:
            laps = laps[laps['LapNumber'] < first_pit_lap]
        post_lap1 = laps[laps['LapNumber'] > 1]
        if post_lap1.empty:
            continue

        first_loss = (
            post_lap1[post_lap1['Position'] > 1]
            .sort_values('LapNumber')
            .head(1)
        )

        if first_loss.empty:
            continue

        outputs.append({
            'race': race,
            'driver': pole_driver,
            'positions_lost': int(first_loss['Position'].iloc[0] - 1),
            'lap': int(first_loss['LapNumber'].iloc[0])
        })

    return outputs


if __name__ == "__main__":
    print(pole_loss_penalty_2025())
