export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    is_day: number;
    time: string;
    is_historical?: boolean;
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
    is_day: number[];
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
  isAutoLocation?: boolean;
}

export type TemperatureUnit = 'C' | 'F';

export type WindSpeedUnit = 'km/h' | 'mph' | 'm/s' | 'Knots' | 'Beaufort';

export interface TideExtreme {
  height: number;
  time: string;
  type: 'high' | 'low';
}

export interface TideData {
  extremes: TideExtreme[];
  meta: {
    station: {
      name: string;
      distance: number;
    };
  };
  retrievedAt: number;
}
