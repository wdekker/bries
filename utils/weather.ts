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

export function generateHourlyItems(hourly: any, daily: any, startIndex: number, count: number, isToday: boolean, showSunEvents: boolean = true) {
  let items: any[] = [];
  
  for (let index = 0; index < count; index++) {
    const actualIndex = startIndex + index;
    if (actualIndex >= hourly.time.length) break;
    const date = new Date(hourly.time[actualIndex]);
    const isMidnight = date.getHours() === 0;
    let timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (isMidnight && index > 0) {
      timeStr = date.toLocaleDateString(undefined, { weekday: 'short' });
    }
    const info = getWeatherInfo(hourly.weathercode[actualIndex]);
    const temp = Math.round(hourly.temperature_2m[actualIndex]);
    const precip = hourly.precipitation_probability ? hourly.precipitation_probability[actualIndex] : 0;
    const wind = hourly.windspeed_10m ? hourly.windspeed_10m[actualIndex] : 0;

    items.push({
      type: 'hour',
      timestamp: date.getTime(),
      timeStr: (isToday && index === 0) ? 'Now' : timeStr,
      temp: `${temp}°`,
      icon: info.icon,
      precip,
      wind,
    });
  }

  if (showSunEvents && daily && daily.sunrise && daily.sunset && items.length > 0) {
    const minTime = items[0].timestamp;
    const maxTime = items[items.length - 1].timestamp + 3600000;
    
    for (let i = 0; i < daily.time.length; i++) {
      if (daily.sunrise[i]) {
        const t = new Date(daily.sunrise[i]).getTime();
        if (t > minTime && t < maxTime) {
          items.push({
            type: 'sunrise',
            timestamp: t,
            timeStr: new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          });
        }
      }
      if (daily.sunset[i]) {
        const t = new Date(daily.sunset[i]).getTime();
        if (t > minTime && t < maxTime) {
          items.push({
            type: 'sunset',
            timestamp: t,
            timeStr: new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          });
        }
      }
    }
  }

  items.sort((a, b) => a.timestamp - b.timestamp);
  return items;
}
