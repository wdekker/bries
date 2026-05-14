import React, { Suspense } from 'react';
import { StyleSheet, Text, ScrollView, useColorScheme, Platform, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useWeather } from '../hooks/useWeather';
import { i18n } from '../utils/i18n';

import { HeaderSearch } from '../components/HeaderSearch';
import { CurrentWeather } from '../components/CurrentWeather';
import { OfflineBanner } from '../components/OfflineBanner';

const SettingsModal = React.lazy(() => import('../components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const HourlyForecast = React.lazy(() => import('../components/HourlyForecast').then(m => ({ default: m.HourlyForecast })));
const DailyForecast = React.lazy(() => import('../components/DailyForecast').then(m => ({ default: m.DailyForecast })));

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    weatherData,
    loading,
    error,
    isOffline,
    refreshing,
    lastFetchedTime,
    isSearchExpanded,
    setIsSearchExpanded,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    showSettings,
    setShowSettings,
    handleSelectCity,
    handleCurrentLocation,
    onRefresh,
    toggleUnit,
    toggleWindUnit,
    toggleSunEvents,
    toggleMoonPhase,
    toggleShowTides,
    saveTideApiKey,
    language,
    changeLanguage,
    selectedDate,
    setSelectedDate,
  } = useWeather();

  const gradientColors = (isDark ? ['#0f172a', '#1e293b'] : ['#38bdf8', '#0ea5e9']) as readonly [string, string, ...string[]];

  const textColor = isDark ? '#f8fafc' : '#ffffff';

  if (loading && !weatherData && !error) {
    return (
      <LinearGradient colors={gradientColors} style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={textColor} />
        <Text style={{ color: textColor, marginTop: 10 }}>{i18n.t('loading')}</Text>
      </LinearGradient>
    );
  }

  if (error && !weatherData) {
    return (
      <LinearGradient colors={gradientColors} style={[styles.container, styles.center]}>
        <Text style={{ color: textColor, fontSize: 18, marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 }}>
          {error}
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 8, paddingHorizontal: 24 }}
          onPress={() => onRefresh()}
        >
          <Text style={{ color: textColor, fontWeight: '600', fontSize: 16 }}>{i18n.t('retry')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (!weatherData) return null;

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      {isOffline && <OfflineBanner lastFetchedTime={lastFetchedTime} />}
      <Suspense fallback={null}>
        <SettingsModal 
          visible={showSettings} 
          onClose={() => setShowSettings(false)} 
          onToggleUnit={toggleUnit} 
          onToggleWindUnit={toggleWindUnit}
          onToggleSunEvents={toggleSunEvents}
          onToggleMoonPhase={toggleMoonPhase}
          onToggleTides={toggleShowTides}
          onChangeApiKey={saveTideApiKey}
          onChangeLanguage={changeLanguage}
        />
      </Suspense>

      <ScrollView 
        key={language}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={textColor} colors={[textColor]} />
        }
      >
        <HeaderSearch 
          isDark={isDark}
          isSearchExpanded={isSearchExpanded}
          setIsSearchExpanded={setIsSearchExpanded}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSelectCity={handleSelectCity}
          handleCurrentLocation={handleCurrentLocation}
          handleRefresh={onRefresh}
          isRefreshing={refreshing}
          setShowSettings={setShowSettings}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          language={language}
        />

        <CurrentWeather />
        <Suspense fallback={null}>
          <HourlyForecast />
          <DailyForecast />
        </Suspense>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});
