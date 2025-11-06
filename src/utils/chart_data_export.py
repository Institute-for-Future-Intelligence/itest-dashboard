import requests
import pandas as pd

location = {
    "name": "Pearl Harbor",
    "latitude": 21.3629,
    "longitude": -157.9565,
    "timezone": "Pacific/Honolulu"
}

hourly_variables = [
    "temperature_2m", "relative_humidity_2m", "precipitation",
]

daily_variables = [
    "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean",
]

#  Open-Meteo Archive API Request 
url = "https://archive-api.open-meteo.com/v1/archive"
params = {
    "latitude": location["latitude"],
    "longitude": location["longitude"],
    "timezone": location["timezone"],
    "hourly": ",".join(hourly_variables),
    "daily": ",".join(daily_variables)
}

response = requests.get(url, params=params)
data = response.json()

#  Convert to pandas 
hourly_df = pd.DataFrame(data["hourly"])
daily_df = pd.DataFrame(data["daily"])

#  Export to CSV 
hourly_df.to_csv("pearl_harbor_hourly.csv", index=False)
daily_df.to_csv("pearl_harbor_daily.csv", index=False)

#  Export to Excel with 2 sheets 
with pd.ExcelWriter("pearl_harbor_weather.xlsx", engine="openpyxl") as writer:
    hourly_df.to_excel(writer, sheet_name="Hourly", index=False)
    daily_df.to_excel(writer, sheet_name="Daily", index=False)