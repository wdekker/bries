import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Sunrise, Sunset, Wind } from 'lucide-react-native';
import { getWeatherInfo, formatWindSpeed } from '../utils/weather';
import { WeatherData, WindSpeedUnit } from '../types/weather';

interface HourlyForecastProps {
  hourly: WeatherData['hourly'];
  daily: WeatherData['daily'];
  currentHourString: string;
  windUnit: WindSpeedUnit;
  isDark: boolean;
}

export function HourlyForecast({ hourly, daily, currentHourString, windUnit, isDark }: HourlyForecastProps) {
  const textColor = isDark ? '#f8fafc' : '#ffffff';
  const subTextColor = isDark ? '#cbd5e1' : '#e0f2fe';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.2)';

  let startHourIndexToday = 0;
  const now = new Date();
  const currentHourPrefix = currentHourString.substring(0, 13) + ":00";
  let idx = hourly.time.findIndex((t: string) => t === currentHourPrefix);
  
  if (idx === -1) {
    idx = hourly.time.findIndex((t: string) => new Date(t).getTime() >= now.getTime() - 3600000);
  }
  if (idx !== -1) {
    startHourIndexToday = idx;
  }

  let items: any[] = [];
  
  for (let index = 0; index < 24; index++) {
    const actualIndex = startHourIndexToday + index;
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
      timeStr: index === 0 ? 'Now' : timeStr,
      temp: `${temp}°`,
      icon: info.icon,
      precip,
      wind,
    });
  }

  if (daily && daily.sunrise && daily.sunset) {
    const minTime = items[0].timestamp;
    const maxTime = items[items.length - 1].timestamp + 3600000;
    
    for (let i = 0; i < 3; i++) {
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

  return (
    <View style={styles.hourlyContainer}>
      <Text style={[styles.forecastTitle, { color: textColor }]}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
        {items.map((item: any, index: number) => {
          if (item.type === 'hour') {
            const Icon = item.icon;
            return (
              <View key={`hour-${index}`} style={[styles.hourlyItem, { backgroundColor: cardBg }]}>
                <Text style={[styles.hourlyTime, { color: subTextColor }]} numberOfLines={1}>{item.timeStr}</Text>
                <Icon size={26} color={textColor} style={{ marginVertical: 6 }} />
                
                {item.precip > 0 && (
                  <Text style={{ color: '#38bdf8', fontSize: 11, fontWeight: '600', marginBottom: 2 }}>{item.precip}%</Text>
                )}
                {!item.precip && <View style={{ height: 15, marginBottom: 2 }} />} 
                
                <Text style={[styles.hourlyTemp, { color: textColor }]}>{item.temp}</Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, opacity: 0.7 }}>
                  <Wind size={12} color={subTextColor} style={{marginRight: 2}}/>
                  <Text style={{ fontSize: 11, color: subTextColor }} numberOfLines={1}>{formatWindSpeed(item.wind, windUnit)}</Text>
                </View>
              </View>
            );
          } else {
            const isSunrise = item.type === 'sunrise';
            const SunIcon = isSunrise ? Sunrise : Sunset;
            return (
              <View key={`sun-${index}`} style={[styles.hourlyItem, { backgroundColor: cardBg, justifyContent: 'center' }]}>
                <Text style={[styles.hourlyTime, { color: subTextColor }]} numberOfLines={1}>{item.timeStr}</Text>
                <SunIcon size={32} color={isSunrise ? '#fbbf24' : '#fb923c'} style={{ marginVertical: 10 }} />
                <Text style={[styles.hourlyTime, { color: textColor, fontWeight: '600' }]} numberOfLines={1}>{isSunrise ? 'Sunrise' : 'Sunset'}</Text>
              </View>
            );
          }
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hourlyContainer: { width: '100%', marginBottom: 30 },
  forecastTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  hourlyScroll: { flexDirection: 'row' },
  hourlyItem: { 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 6, 
    borderRadius: 20, 
    marginRight: 10,
    width: 82
  },
  hourlyTime: { fontSize: 14, fontWeight: '500' },
  hourlyTemp: { fontSize: 18, fontWeight: '600' },
});
