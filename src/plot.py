import matplotlib.pyplot as plt
from fastf1.plotting import get_driver_color

from consistency_rating import compute_driver_consistency

driver_scores, session = compute_driver_consistency()

# Get official FastF1 driver colors
colors = [
    get_driver_color(driver, session)
    for driver in driver_scores['Driver']
]

plt.figure(figsize=(12, 6))
plt.bar(
    driver_scores['Driver'],
    driver_scores['ConsistencyScore'],
    color=colors
)

plt.gca().invert_yaxis()

plt.xlabel('Driver')
plt.ylabel('Consistency Score (lower = better)')
plt.title('Driver Consistency – Hungary GP 2025')

plt.tight_layout()
plt.show()
