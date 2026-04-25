import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getWeatherInfo } from '../utils/weather';
import { WeatherData } from '../types/weather';

interface DailyForecastProps {
  daily: WeatherData['daily'];
  hourly: WeatherData['hourly'];
  isDark: boolean;
}

export function DailyForecast({ daily, hourly, isDark }: DailyForecastProps) {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

  const textColor = isDark ? '#f8fafc' : '#ffffff';
  const subTextColor = isDark ? '#cbd5e1' : '#e0f2fe';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.2)';

  const forecast = daily.time.slice(1).map((time: string, i: number) => {
    const index = i + 1; // Real index in the daily arrays
    const date = new Date(time);
    const dayStr = date.toLocaleDateString(undefined, { weekday: 'short' });
    const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const info = getWeatherInfo(daily.weathercode[index]);
    const maxTemp = Math.round(daily.temperature_2m_max[index]);
    const minTemp = Math.round(daily.temperature_2m_min[index]);

    return { index, day: dayStr, date: dateStr, temp: `${maxTemp}° / ${minTemp}°`, icon: info.icon };
  });

  const getHourlyForDay = (dayIndex: number) => {
    const startHourIndex = dayIndex * 24;
    return hourly.time.slice(startHourIndex, startHourIndex + 24).map((time: string, index: number) => {
      const actualIndex = startHourIndex + index;
      const date = new Date(time);
      const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      const info = getWeatherInfo(hourly.weathercode[actualIndex]);
      const temp = Math.round(hourly.temperature_2m[actualIndex]);
      
      return { time: timeStr, temp: `${temp}°`, icon: info.icon };
    });
  };

  return (
    <View style={styles.forecastContainer}>
      <Text style={[styles.forecastTitle, { color: textColor }]}>13-Day Forecast</Text>
      
      {forecast.map((item: any, i: number) => {
        const Icon = item.icon;
        const isExpanded = expandedDayIndex === item.index;
        
        return (
          <View key={i} style={[styles.forecastRowWrapper, { backgroundColor: cardBg }]}>
            <TouchableOpacity 
              onPress={() => setExpandedDayIndex(isExpanded ? null : item.index)}
              style={styles.forecastRow}
              activeOpacity={0.7}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', width: 90}}>
                <Text style={[styles.forecastDay, { color: textColor, width: 45 }]}>{item.day}</Text>
                <Text style={{ color: subTextColor, fontSize: 12, marginLeft: 8 }}>{item.date}</Text>
              </View>
              <Icon size={24} color={textColor} />
              <Text style={[styles.forecastTemp, { color: textColor }]}>{item.temp}</Text>
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={styles.expandedHourlyContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
                  {getHourlyForDay(item.index).map((hourItem: any, hIndex: number) => {
                    const HourIcon = hourItem.icon;
                    const itemBg = isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.4)';
                    return (
                      <View key={hIndex} style={[styles.hourlyItem, { backgroundColor: itemBg }]}>
                        <Text style={[styles.hourlyTime, { color: subTextColor }]}>{hourItem.time}</Text>
                        <HourIcon size={28} color={textColor} style={{ marginVertical: 8 }} />
                        <Text style={[styles.hourlyTemp, { color: textColor }]}>{hourItem.temp}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  forecastContainer: { width: '100%' },
  forecastTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  forecastRowWrapper: {
    marginBottom: 10, 
    borderRadius: 16,
    overflow: 'hidden'
  },
  forecastRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16,
  },
  expandedHourlyContainer: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)'
  },
  forecastDay: { fontSize: 18, fontWeight: '500' },
  forecastTemp: { fontSize: 18, fontWeight: '600' },
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
