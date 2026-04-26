import { Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react-native';

export const getWeatherInfo = (code: number) => {
  if (code === 0) return { icon: Sun, label: 'Clear Sky' };
  if (code === 1 || code === 2) return { icon: CloudSun, label: 'Partly Cloudy' }; 
  if (code === 3) return { icon: Cloud, label: 'Overcast' };
  if (code === 45 || code === 48) return { icon: CloudFog, label: 'Fog' };
  if (code >= 51 && code <= 55) return { icon: CloudDrizzle, label: 'Drizzle' };
  if (code >= 61 && code <= 65) return { icon: CloudRain, label: 'Rain' };
  if (code >= 71 && code <= 77) return { icon: CloudSnow, label: 'Snow' };
  if (code >= 95 && code <= 99) return { icon: CloudLightning, label: 'Thunderstorm' };
  return { icon: Sun, label: 'Clear' };
};

import { WindSpeedUnit } from '../types/weather';

export function formatWindSpeed(speedKmh: number, unit: WindSpeedUnit): string {
  if (unit === 'Knots') {
    const knots = speedKmh * 0.539957;
    return `${knots.toFixed(1)} kn`;
  }
  if (unit === 'Beaufort') {
    let bft = 0;
    if (speedKmh < 1) bft = 0;
    else if (speedKmh < 6) bft = 1;
    else if (speedKmh < 12) bft = 2;
    else if (speedKmh < 20) bft = 3;
    else if (speedKmh < 29) bft = 4;
    else if (speedKmh < 39) bft = 5;
    else if (speedKmh < 50) bft = 6;
    else if (speedKmh < 62) bft = 7;
    else if (speedKmh < 75) bft = 8;
    else if (speedKmh < 89) bft = 9;
    else if (speedKmh < 103) bft = 10;
    else if (speedKmh < 118) bft = 11;
    else bft = 12;
    return `Bft ${bft}`;
  }
  
  return `${speedKmh.toFixed(1)} km/h`;
}
