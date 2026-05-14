import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react-native';
import { i18n } from './i18n';

export const getWeatherInfo = (code: number, isDay: boolean = true) => {
  if (code === 0) return { icon: isDay ? Sun : Moon, label: i18n.t('clearSky') };
  if (code === 1 || code === 2) return { icon: isDay ? CloudSun : CloudMoon, label: i18n.t('partlyCloudy') }; 
  if (code === 3) return { icon: Cloud, label: i18n.t('overcast') };
  if (code === 45 || code === 48) return { icon: CloudFog, label: i18n.t('fog') };
  if (code >= 51 && code <= 55) return { icon: CloudDrizzle, label: i18n.t('drizzle') };
  if (code >= 61 && code <= 65) return { icon: CloudRain, label: i18n.t('rain') };
  if (code >= 71 && code <= 77) return { icon: CloudSnow, label: i18n.t('snow') };
  if (code >= 95 && code <= 99) return { icon: CloudLightning, label: i18n.t('thunderstorm') };
  return { icon: isDay ? Sun : Moon, label: i18n.t('clear') };
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

export function getMoonPhaseInfo(phase: number): string {
  if (phase <= 0.03 || phase >= 0.97) return i18n.t('newMoon');
  if (phase < 0.22) return i18n.t('waxingCrescent');
  if (phase <= 0.28) return i18n.t('firstQuarter');
  if (phase < 0.47) return i18n.t('waxingGibbous');
  if (phase <= 0.53) return i18n.t('fullMoon');
  if (phase < 0.72) return i18n.t('waningGibbous');
  if (phase <= 0.78) return i18n.t('lastQuarter');
  return i18n.t('waningCrescent');
}

export function getLunarPhase(date: Date): number {
  const knownNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const lunarCycle = 29.53058868 * 24 * 60 * 60 * 1000;
  const diff = date.getTime() - knownNewMoon;
  let phase = (diff % lunarCycle) / lunarCycle;
  if (phase < 0) phase += 1;
  return phase;
}

import { TideData } from '../types/weather';

export function generateHourlyItems(hourly: any, daily: any, startIndex: number, count: number, isToday: boolean, showSunEvents: boolean = true, tideData: TideData | null = null) {
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
    const isDay = hourly.is_day ? hourly.is_day[actualIndex] === 1 : true;
    const info = getWeatherInfo(hourly.weathercode[actualIndex], isDay);
    const precip = hourly.precipitation_probability ? hourly.precipitation_probability[actualIndex] : 0;
    const wind = hourly.windspeed_10m ? hourly.windspeed_10m[actualIndex] : 0;
    const humidity = hourly.relativehumidity_2m ? hourly.relativehumidity_2m[actualIndex] : 0;
    const uv = hourly.uv_index ? hourly.uv_index[actualIndex] : 0;
    const feelsLike = hourly.apparent_temperature ? hourly.apparent_temperature[actualIndex] : 0;
    
    items.push({
      type: 'hour',
      timestamp: date.getTime(),
      timeStr: (isToday && index === 0) ? 'Now' : timeStr,
      temp: `${Math.round(hourly.temperature_2m[actualIndex])}°`,
      icon: info.icon,
      precip,
      wind,
      humidity,
      uv,
      feelsLike: `${Math.round(feelsLike)}°`
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

  if (tideData && items.length > 0) {
    const minTime = items[0].timestamp;
    const maxTime = items[items.length - 1].timestamp + 3600000;
    for (const extreme of tideData.extremes) {
      const t = new Date(extreme.time).getTime();
      if (t > minTime && t < maxTime) {
        items.push({
          type: 'tide',
          tideType: extreme.type,
          height: extreme.height,
          timestamp: t,
          timeStr: new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        });
      }
    }
  }

  items.sort((a, b) => a.timestamp - b.timestamp);
  return items;
}
