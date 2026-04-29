export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
    precipitation_probability: number[];
    windspeed_10m: number[];
    relativehumidity_2m: number[];
    uv_index: number[];
    apparent_temperature: number[];
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface LocationState {
  lat: number;
  lon: number;
  city: string;
}

export type TemperatureUnit = 'C' | 'F';

export type WindSpeedUnit = 'km/h' | 'Beaufort' | 'Knots';
