import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Sunrise, Sunset, Wind, ChevronDown, ChevronUp, Droplets, Umbrella, Thermometer, Sun, Waves } from 'lucide-react-native';
import { formatWindSpeed, generateHourlyItems } from '../utils/weather';
import { WeatherData, WindSpeedUnit, TideData } from '../types/weather';
import { i18n } from '../utils/i18n';

export function HourlyScrollList({ items, windUnit, isDark }: { items: any[], windUnit: WindSpeedUnit, isDark: boolean }) {
  const [showDetails, setShowDetails] = useState(false);
  const textColor = isDark ? '#f8fafc' : '#ffffff';
  const subTextColor = isDark ? '#cbd5e1' : '#e0f2fe';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.2)';

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
        {items.map((item: any, index: number) => {
          if (item.type === 'hour') {
            const Icon = item.icon;
            return (
              <View key={`hour-${index}`} style={[styles.hourlyItem, { backgroundColor: cardBg }]}>
                <Text style={[styles.hourlyTime, { color: subTextColor }]}>{item.timeStr}</Text>
                <Icon size={26} color={textColor} style={{ marginVertical: 6 }} />
                
                <Text style={[styles.hourlyTemp, { color: textColor }]}>{item.temp}</Text>
                
                {showDetails && (
                  <View style={{ alignItems: 'flex-start', marginTop: 16, width: '100%', paddingLeft: 4 }}>
                    <View style={styles.detailRow}>
                      <Umbrella size={12} color={item.precip > 0 ? '#38bdf8' : subTextColor} style={styles.detailIcon}/>
                      <Text style={[styles.detailText, { color: item.precip > 0 ? '#38bdf8' : subTextColor }]}>{item.precip}%</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Wind size={12} color={subTextColor} style={styles.detailIcon}/>
                      <Text style={[styles.detailText, { color: subTextColor }]}>{formatWindSpeed(item.wind, windUnit)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Droplets size={12} color={subTextColor} style={styles.detailIcon}/>
                      <Text style={[styles.detailText, { color: subTextColor }]}>{item.humidity}%</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Thermometer size={12} color={subTextColor} style={styles.detailIcon}/>
                      <Text style={[styles.detailText, { color: subTextColor }]}>{item.feelsLike}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Sun size={12} color={item.uv > 5 ? '#fbbf24' : subTextColor} style={styles.detailIcon}/>
                      <Text style={[styles.detailText, { color: item.uv > 5 ? '#fbbf24' : subTextColor }]}>UV {Math.round(item.uv)}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          }
          if (item.type === 'sunrise' || item.type === 'sunset') {
            const isSunrise = item.type === 'sunrise';
            const SunIcon = isSunrise ? Sunrise : Sunset;
            return (
              <View key={`sun-${index}`} style={[styles.hourlyItem, { backgroundColor: cardBg, justifyContent: 'center' }]}>
                <Text style={[styles.hourlyTime, { color: subTextColor }]}>{item.timeStr}</Text>
                <SunIcon size={32} color={isSunrise ? '#fbbf24' : '#fb923c'} style={{ marginVertical: 10 }} />
                <Text style={[styles.hourlyTime, { color: textColor, fontWeight: '600' }]}>{isSunrise ? i18n.t('sunrise') : i18n.t('sunset')}</Text>
              </View>
            );
          }

          if (item.type === 'tide') {
            const isHigh = item.tideType === 'high';
            return (
              <View key={`tide-${index}`} style={[styles.hourlyItem, { backgroundColor: cardBg, justifyContent: 'center' }]}>
                <Text style={[styles.hourlyTime, { color: subTextColor }]}>{item.timeStr}</Text>
                <Waves size={32} color={isHigh ? '#3b82f6' : '#93c5fd'} style={{ marginVertical: 10 }} />
                <Text style={[styles.hourlyTime, { color: textColor, fontWeight: '600', fontSize: 13 }]}>{isHigh ? i18n.t('highTide') : i18n.t('lowTide')}</Text>
                <Text style={[styles.hourlyTime, { color: subTextColor, fontSize: 12, marginTop: 4 }]}>{item.height.toFixed(2)}m</Text>
              </View>
            );
          }
        })}
      </ScrollView>

      <TouchableOpacity 
        onPress={() => setShowDetails(!showDetails)}
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, opacity: 0.7 }}
        activeOpacity={0.6}
      >
        {showDetails ? <ChevronUp size={16} color={subTextColor} /> : <ChevronDown size={16} color={subTextColor} />}
        <Text style={{ color: subTextColor, fontSize: 13, fontWeight: '500', marginLeft: 4 }}>
          {showDetails ? i18n.t('hideDetails') : i18n.t('moreDetails')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface HourlyForecastProps {
  hourly: WeatherData['hourly'];
  daily: WeatherData['daily'];
  currentHourString: string;
  windUnit: WindSpeedUnit;
  showSunEvents: boolean;
  tideData: TideData | null;
  isDark: boolean;
}

export function HourlyForecast({ hourly, daily, currentHourString, windUnit, showSunEvents, tideData, isDark }: HourlyForecastProps) {
  const textColor = isDark ? '#f8fafc' : '#ffffff';

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

  const items = generateHourlyItems(hourly, daily, startHourIndexToday, 24, true, showSunEvents, tideData);

  return (
    <View style={styles.hourlyContainer}>
      <Text style={[styles.hourlyTitle, { color: textColor }]}>{i18n.t('today')}</Text>
      <HourlyScrollList items={items} windUnit={windUnit} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  hourlyContainer: { width: '100%', marginBottom: 30 },
  hourlyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  forecastTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  hourlyScroll: { flexDirection: 'row' },
  hourlyItem: { 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    marginRight: 10,
    minWidth: 76
  },
  hourlyTime: { fontSize: 14, fontWeight: '500' },
  hourlyTemp: { fontSize: 18, fontWeight: '600' },
  detailRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    opacity: 0.8, 
    marginBottom: 8
  },
  detailIcon: {
    marginRight: 6
  },
  detailText: {
    fontSize: 11,
    fontWeight: '500'
  }
});
