import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon } from 'lucide-react-native';
import { getWeatherInfo, generateHourlyItems, getMoonPhaseInfo, getLunarPhase } from '../utils/weather';
import { WeatherData, WindSpeedUnit, TideData } from '../types/weather';
import { HourlyScrollList } from './HourlyForecast';
import { i18n } from '../utils/i18n';

interface DailyForecastProps {
  daily: WeatherData['daily'];
  hourly: WeatherData['hourly'];
  windUnit: WindSpeedUnit;
  showSunEvents: boolean;
  showMoonPhase: boolean;
  tideData: TideData | null;
  isDark: boolean;
}

export const DailyForecast = React.memo(function DailyForecast({ daily, hourly, windUnit, showSunEvents, showMoonPhase, tideData, isDark }: DailyForecastProps) {
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
    const phase = getLunarPhase(date);
    const moonPhaseStr = getMoonPhaseInfo(phase);

    return { index, day: dayStr, date: dateStr, temp: `${maxTemp}° / ${minTemp}°`, icon: info.icon, moonPhaseStr };
  });

  const getHourlyForDay = (dayIndex: number) => {
    return generateHourlyItems(hourly, daily, dayIndex * 24, 24, false, showSunEvents, tideData);
  };

  return (
    <View style={styles.forecastContainer}>
      <Text style={[styles.forecastTitle, { color: textColor }]}>{i18n.t('dailyForecast')}</Text>
      
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
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={[styles.forecastDay, { color: textColor, width: 45 }]}>{item.day}</Text>
                <Text style={{ color: subTextColor, fontSize: 12, marginLeft: 8 }}>{item.date}</Text>
              </View>
              
              <View style={{ width: 40, alignItems: 'center' }}>
                <Icon size={24} color={textColor} />
              </View>
              
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                {showMoonPhase && item.moonPhaseStr ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingLeft: 8, opacity: 0.7 }}>
                      <Moon size={12} color={subTextColor} style={{ marginRight: 4 }} />
                      <Text style={{ color: subTextColor, fontSize: 10 }} numberOfLines={1} adjustsFontSizeToFit>{item.moonPhaseStr}</Text>
                    </View>
                    <Text style={[styles.forecastTemp, { color: textColor, textAlign: 'right' }]}>{item.temp}</Text>
                  </>
                ) : (
                  <Text style={[styles.forecastTemp, { color: textColor, textAlign: 'right' }]}>{item.temp}</Text>
                )}
              </View>
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={styles.expandedHourlyContainer}>
                <HourlyScrollList items={getHourlyForDay(item.index)} windUnit={windUnit} isDark={isDark} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
});

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
});
