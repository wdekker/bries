import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getWeatherInfo } from '../utils/weather';
import { WeatherData } from '../types/weather';

interface HourlyForecastProps {
  hourly: WeatherData['hourly'];
  currentHourString: string;
  isDark: boolean;
}

export function HourlyForecast({ hourly, currentHourString, isDark }: HourlyForecastProps) {
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

  const todayHourlyForecast = hourly.time.slice(startHourIndexToday, startHourIndexToday + 24).map((time: string, index: number) => {
    const actualIndex = startHourIndexToday + index;
    const date = new Date(time);
    const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const info = getWeatherInfo(hourly.weathercode[actualIndex]);
    const temp = Math.round(hourly.temperature_2m[actualIndex]);
    
    return {
      time: index === 0 ? 'Now' : timeStr,
      temp: `${temp}°`,
      icon: info.icon,
    };
  });

  return (
    <View style={styles.hourlyContainer}>
      <Text style={[styles.forecastTitle, { color: textColor }]}>Hourly Forecast - Today</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
        {todayHourlyForecast.map((item: any, index: number) => {
          const Icon = item.icon;
          return (
            <View key={index} style={[styles.hourlyItem, { backgroundColor: cardBg }]}>
              <Text style={[styles.hourlyTime, { color: subTextColor }]}>{item.time}</Text>
              <Icon size={28} color={textColor} style={{ marginVertical: 8 }} />
              <Text style={[styles.hourlyTemp, { color: textColor }]}>{item.temp}</Text>
            </View>
          );
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
    paddingHorizontal: 15, 
    borderRadius: 20, 
    marginRight: 12,
    minWidth: 70
  },
  hourlyTime: { fontSize: 14, fontWeight: '500' },
  hourlyTemp: { fontSize: 18, fontWeight: '600' },
});
