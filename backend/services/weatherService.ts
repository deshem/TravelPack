export interface WeatherHint {
  temperatureC: number;
  conditions: string;
  recommendation: string;
}

export async function getWeatherHint(destination: string): Promise<WeatherHint> {
  // In production: call OpenWeather API by destination.
  return {
    temperatureC: 20,
    conditions: "partly_cloudy",
    recommendation: `Погода в ${destination}: возьмите легкую куртку и зонт на случай дождя.`
  };
}
