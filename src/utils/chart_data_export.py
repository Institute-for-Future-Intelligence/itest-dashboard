import requests
import pandas as pd

# Define locations
locations = {
    "1": {
        "name": "Pearl Harbor",
        "latitude": 21.3629,
        "longitude": -157.9565,
        "timezone": "Pacific/Honolulu"
    },
    "2": {
        "name": "Kaneohe",
        "latitude": 21.4014,
        "longitude": -157.7979,
        "timezone": "Pacific/Honolulu"
    },
    "3": {
        "name": "Makapu'u",
        "latitude": 21.3096,
        "longitude": -157.6499,
        "timezone": "Pacific/Honolulu"
    }
}

# Variables to request
hourly_variables = [
   "temperature_2m", "relative_humidity_2m", "precipitation",
   "surface_pressure", "cloud_cover", "cloud_cover_low",
   "cloud_cover_mid", "cloud_cover_high", "et0_fao_evapotranspiration",
   "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
   "shortwave_radiation", "diffuse_radiation"
]

daily_variables = [
    "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean",
    "daylight_duration", "sunshine_duration", "precipitation_hours",
    "shortwave_radiation_sum"
]

# Archive API base URL
url = "https://archive-api.open-meteo.com/v1/archive"

# Loop through locations
for loc in locations.values():
    params = {
        "latitude": loc["latitude"],
        "longitude": loc["longitude"],
        "timezone": loc["timezone"],
        "hourly": ",".join(hourly_variables),
        "daily": ",".join(daily_variables)
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "hourly" not in data or "daily" not in data:
        print(f"No data returned for {loc['name']}")
        continue

    # Convert JSON to DataFrames
    hourly_df = pd.DataFrame(data["hourly"])
    daily_df = pd.DataFrame(data["daily"])

    # Export to CSV
    hourly_df.to_csv(f"{loc['name'].lower().replace(' ', '_')}_hourly.csv", index=False)
    daily_df.to_csv(f"{loc['name'].lower().replace(' ', '_')}_daily.csv", index=False)

    # Export to Excel with two sheets
    with pd.ExcelWriter(f"{loc['name'].lower().replace(' ', '_')}_weather.xlsx", engine="openpyxl") as writer:
        hourly_df.to_excel(writer, sheet_name="Hourly", index=False)
        daily_df.to_excel(writer, sheet_name="Daily", index=False)