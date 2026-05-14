import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wind, Moon, Waves } from 'lucide-react-native';
import { getWeatherInfo, formatWindSpeed, getMoonPhaseInfo, getLunarPhase } from '../utils/weather';
import { WeatherData, WindSpeedUnit, TideData } from '../types/weather';
import { i18n } from '../utils/i18n';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  cityName: string;
  lastFetchedTime: Date | null;
  showMoonPhase: boolean;
  showTides: boolean;
  tideData: TideData | null;
  isDark: boolean;
  windUnit: WindSpeedUnit;
}

export function CurrentWeather({ weatherData, cityName, lastFetchedTime, showMoonPhase, showTides, tideData, isDark, windUnit }: CurrentWeatherProps) {
  const isDay = weatherData.current_weather.is_day === 1;
  const currentInfo = getWeatherInfo(weatherData.current_weather.weathercode, isDay);
  const CurrentIcon = currentInfo.icon;
  
  const textColor = isDark ? '#f8fafc' : '#ffffff';
  const subTextColor = isDark ? '#cbd5e1' : '#e0f2fe';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.2)';

  let localTimeStr = null;
  if (weatherData.timezone) {
    try {
      const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (weatherData.timezone !== deviceTz) {
        localTimeStr = new Date().toLocaleTimeString(undefined, { 
          timeZone: weatherData.timezone, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    } catch {}
  }

  const phase = getLunarPhase(new Date());
  const moonPhaseStr = getMoonPhaseInfo(phase);

  // Find today's tides
  let todaysTides: any[] = [];
  if (showTides && tideData && tideData.extremes) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    todaysTides = tideData.extremes.filter(e => {
      const t = new Date(e.time).getTime();
      return t >= today.getTime() && t < tomorrow.getTime();
    });
  }
  
  return (
    <View style={styles.currentWeather}>
      <Text style={[styles.cityText, { color: textColor }]}>{cityName}</Text>
      <Text style={[styles.dateText, { color: subTextColor, marginBottom: localTimeStr ? 4 : 20 }]}>
        {i18n.t('today')}, {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
        {lastFetchedTime ? ` • ${i18n.t('updated')} ${lastFetchedTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}` : ''}
      </Text>
      {showMoonPhase && moonPhaseStr && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: localTimeStr ? 4 : 20 }}>
          <Moon size={14} color={subTextColor} style={{ marginRight: 6 }} />
          <Text style={{ color: subTextColor, fontSize: 14, fontWeight: '500' }}>{moonPhaseStr}</Text>
        </View>
      )}
      {localTimeStr && (
        <Text style={{ color: subTextColor, fontSize: 14, fontWeight: '500', marginBottom: 20 }}>
          {i18n.t('localTime')}: {localTimeStr} ({weatherData.timezone_abbreviation || weatherData.timezone})
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
            {formatWindSpeed(weatherData.current_weather.windspeed, windUnit)}
          </Text>
          <Text style={[styles.statLabel, { color: subTextColor }]}>{i18n.t('wind')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: textColor, fontSize: 18 }]}>
            {Math.round(weatherData.daily.temperature_2m_max[0])}°
          </Text>
          <Text style={[styles.statLabel, { color: subTextColor }]}>{i18n.t('high')}</Text>
        </View>
         <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: textColor, fontSize: 18 }]}>
            {Math.round(weatherData.daily.temperature_2m_min[0])}°
          </Text>
          <Text style={[styles.statLabel, { color: subTextColor }]}>{i18n.t('low')}</Text>
        </View>
      </View>

      {showTides && tideData && todaysTides.length > 0 && (
        <View style={[styles.tideContainer, { backgroundColor: cardBg }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Waves size={18} color={isDark ? '#93c5fd' : '#3b82f6'} style={{ marginRight: 6 }} />
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{i18n.t('todaysTides')}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {todaysTides.slice(0, 4).map((tide, idx) => (
              <View key={`tide-${idx}`} style={{ width: '48%', marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: subTextColor, fontSize: 14, width: 45 }}>
                  {new Date(tide.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={{ color: textColor, fontSize: 14, fontWeight: '500', marginLeft: 8 }}>
                  {tide.type === 'high' ? 'High' : 'Low'}
                </Text>
                <Text style={{ color: subTextColor, fontSize: 12, marginLeft: 'auto' }}>
                  {tide.height.toFixed(2)}m
                </Text>
              </View>
            ))}
          </View>
          
          <Text style={{ color: subTextColor, fontSize: 11, marginTop: 8, textAlign: 'center', opacity: 0.7 }}>
            {i18n.t('station')}: {tideData.meta.station.name} ({tideData.meta.station.distance}km) • {i18n.t('retrieved')}: {new Date(tideData.retrievedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      )}
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
  tideContainer: {
    width: '100%',
    marginTop: 15,
    borderRadius: 20,
    padding: 16,
  }
});
