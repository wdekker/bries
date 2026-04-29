import React from 'react';
import { StyleSheet, Text, ScrollView, useColorScheme, Platform, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useWeather } from '../hooks/useWeather';

import { SettingsModal } from '../components/SettingsModal';
import { HeaderSearch } from '../components/HeaderSearch';
import { CurrentWeather } from '../components/CurrentWeather';
import { HourlyForecast } from '../components/HourlyForecast';
import { DailyForecast } from '../components/DailyForecast';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    weatherData,
    loading,
    error,
    refreshing,
    cityName,
    lastFetchedTime,
    isSearchExpanded,
    setIsSearchExpanded,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    unit,
    windUnit,
    showSunEvents,
    showMoonPhase,
    showSettings,
    setShowSettings,
    handleSelectCity,
    handleCurrentLocation,
    onRefresh,
    toggleUnit,
    toggleWindUnit,
    toggleSunEvents,
    toggleMoonPhase,
    showTides,
    toggleShowTides,
    stormglassApiKey,
    saveTideApiKey,
    tideData,
  } = useWeather();

  const gradientColors = (isDark ? ['#0f172a', '#1e293b'] : ['#38bdf8', '#0ea5e9']) as readonly [string, string, ...string[]];

  const textColor = isDark ? '#f8fafc' : '#ffffff';

  if (loading && !weatherData && !error) {
    return (
      <LinearGradient colors={gradientColors} style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={textColor} />
        <Text style={{ color: textColor, marginTop: 10 }}>Loading...</Text>
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
          <Text style={{ color: textColor, fontWeight: '600', fontSize: 16 }}>Retry</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (!weatherData) return null;

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SettingsModal 
        visible={showSettings} 
        onClose={() => setShowSettings(false)} 
        unit={unit} 
        onToggleUnit={toggleUnit} 
        windUnit={windUnit}
        onToggleWindUnit={toggleWindUnit}
        showSunEvents={showSunEvents}
        onToggleSunEvents={toggleSunEvents}
        showMoonPhase={showMoonPhase}
        onToggleMoonPhase={toggleMoonPhase}
        showTides={showTides}
        onToggleTides={toggleShowTides}
        stormglassApiKey={stormglassApiKey}
        onChangeApiKey={saveTideApiKey}
        isDark={isDark} 
      />

      <ScrollView 
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
          setShowSettings={setShowSettings}
        />

        <CurrentWeather 
          weatherData={weatherData}
          cityName={cityName}
          lastFetchedTime={lastFetchedTime}
          showMoonPhase={showMoonPhase}
          showTides={showTides}
          tideData={tideData}
          isDark={isDark}
          windUnit={windUnit}
        />

        <HourlyForecast 
          hourly={weatherData.hourly}
          daily={weatherData.daily}
          currentHourString={weatherData.current_weather.time}
          windUnit={windUnit}
          showSunEvents={showSunEvents}
          tideData={tideData}
          isDark={isDark}
        />

        <DailyForecast 
          daily={weatherData.daily}
          hourly={weatherData.hourly}
          windUnit={windUnit}
          showSunEvents={showSunEvents}
          showMoonPhase={showMoonPhase}
          tideData={tideData}
          isDark={isDark}
        />

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
