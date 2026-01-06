import fastf1
import matplotlib.pyplot as plt
fastf1.Cache.enable_cache('../cache')

session = fastf1.get_session(2025, 'Hungary', 'R')
session.load()

laps = session.laps.pick_drivers("RUS")
laps = laps[laps['LapTime'].notna()]

laps_clean = laps[
    laps['PitInTime'].isna() &
    laps['PitOutTime'].isna() &
    (laps['TrackStatus'] == '1')
]
laps_clean = laps_clean[laps_clean['LapNumber'] != 1]
lap_numbers = laps_clean['LapNumber']
lap_times = laps_clean['LapTime'].dt.total_seconds()

compound_colors = {
    'SOFT': 'red',
    'MEDIUM': 'yellow',
    'HARD': 'white',
    'INTERMEDIATE': 'green',
    'WET': 'blue'
}

colors = laps_clean['Compound'].map(compound_colors)

fig, ax = plt.subplots()
fig.patch.set_facecolor('black')
ax.set_facecolor('black')

ax.plot(lap_numbers, lap_times, color='gray', alpha=0.7)
ax.scatter(lap_numbers, lap_times, c=colors)

ax.set_xlabel('Lap Number', color='white')
ax.set_ylabel('Lap Time (seconds)', color='white')

results = session.results
full_name = results.loc[results['Abbreviation'] == 'RUS', 'FullName'].iloc[0]
ax.set_title(full_name + ' – Hungary GP Race Lap Times', color='white')

ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

plt.show()


laps_clean['LapTimeSeconds'] = laps_clean['LapTime'].dt.total_seconds()

stint_stats = (
    laps_clean
    .groupby('Stint')
    .agg(
        Compound=('Compound', 'first'),
        LapsInStint=('LapNumber', 'count'),
        AvgLapTime=('LapTimeSeconds', 'mean'),
        StdDevLapTime=('LapTimeSeconds', 'std')
    )
    .reset_index()
)

print("\nStint-wise consistency:")
print(stint_stats)
