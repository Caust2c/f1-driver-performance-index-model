import fastf1

from metrics.clean_air_penalty import clean_air_penalty
from metrics.consistency_rating import compute_driver_consistency
from metrics.firstlap import first_lap_delta
from metrics.quali_rel import qualifying_relative_to_car
from metrics.tyre_whisperer import tyre_whisperer

def run_season(year=2025):
    schedule = fastf1.get_event_schedule(year)
    races = schedule['EventName'].tolist()

    season_results = []

    for race in races:
        print(f'Processing {race} {year}...')
        race_result = {
            'race': race,
            'consistency': compute_driver_consistency(year, race),
            'tyre_whisperer': tyre_whisperer(year, race),
            'first_lap': first_lap_delta(year, race),
            'pole_loss': clean_air_penalty(year, race),
            'qualifying': qualifying_relative_to_car(year, race)
        }
        season_results.append(race_result)

    return season_results


if __name__ == "__main__":
    season_results = run_season(2025)

    # Optional: print summary of each race
    for race_res in season_results:
        print(f"\n--- {race_res['race']} ---")
        print("Consistency:")
        print(race_res['consistency'])
        print("Tyre Whisperer:")
        print(race_res['tyre_whisperer'])
        print("First Lap Delta:")
        print(race_res['first_lap'])
        print("Clean Air Penalty:")
        print(race_res['pole_loss'])
        print("Qualifying Relative:")
        print(race_res['qualifying'])
