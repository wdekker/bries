import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wind } from 'lucide-react-native';
import { getWeatherInfo } from '../utils/weather';
import { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  cityName: string;
  lastFetchedTime: Date | null;
  isDark: boolean;
}

export function CurrentWeather({ weatherData, cityName, lastFetchedTime, isDark }: CurrentWeatherProps) {
  const currentInfo = getWeatherInfo(weatherData.current_weather.weathercode);
  const CurrentIcon = currentInfo.icon;
  
  const textColor = isDark ? '#f8fafc' : '#ffffff';
  const subTextColor = isDark ? '#cbd5e1' : '#e0f2fe';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.2)';

  let localTimeStr = null;
  if (weatherData.timezone) {
    try {
      const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (weatherData.timezone !== deviceTz) {
        localTimeStr = new Date().toLocaleTimeString('en-US', { 
          timeZone: weatherData.timezone, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    } catch {}
  }
  
  return (
    <View style={styles.currentWeather}>
      <Text style={[styles.cityText, { color: textColor }]}>{cityName}</Text>
      <Text style={[styles.dateText, { color: subTextColor, marginBottom: localTimeStr ? 4 : 20 }]}>
        Today, {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
        {lastFetchedTime ? ` • Updated ${lastFetchedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
      </Text>
      {localTimeStr && (
        <Text style={{ color: subTextColor, fontSize: 14, fontWeight: '500', marginBottom: 20 }}>
          Local Time: {localTimeStr} ({weatherData.timezone_abbreviation || weatherData.timezone})
        </Text>
      )}
      
      <View style={styles.tempContainer}>
        <CurrentIcon size={80} color={textColor} strokeWidth={1.5} />
        <Text style={[styles.temperatureText, { color: textColor }]}>
          {Math.round(weatherData.current_weather.temperature)}°
        </Text>
      </View>
      <Text style={[styles.conditionText, { color: textColor }]}>{currentInfo.label}</Text>
      
      <View style={[styles.statsRow, { backgroundColor: cardBg }]}>
        <View style={styles.stat}>
          <Wind size={20} color={subTextColor} />
          <Text style={[styles.statValue, { color: textColor }]}>
            {weatherData.current_weather.windspeed} km/h
          </Text>
          <Text style={[styles.statLabel, { color: subTextColor }]}>Wind</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: textColor, fontSize: 18 }]}>
            {Math.round(weatherData.daily.temperature_2m_max[0])}°
          </Text>
          <Text style={[styles.statLabel, { color: subTextColor }]}>High</Text>
        </View>
         <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: textColor, fontSize: 18 }]}>
            {Math.round(weatherData.daily.temperature_2m_min[0])}°
          </Text>
          <Text style={[styles.statLabel, { color: subTextColor }]}>Low</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  currentWeather: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
  cityText: { fontSize: 36, fontWeight: '300', letterSpacing: 1, textAlign: 'center' },
  dateText: { fontSize: 16, marginTop: 4, marginBottom: 20, fontWeight: '500' },
  tempContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  temperatureText: { fontSize: 84, fontWeight: '200', marginLeft: 10 },
  conditionText: { fontSize: 24, fontWeight: '400', marginTop: 10, letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row', marginTop: 30, borderRadius: 20, padding: 20,
    width: '100%', justifyContent: 'space-around',
  },
  stat: { alignItems: 'center', minWidth: 60 },
  statValue: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  statLabel: { fontSize: 14, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
});
