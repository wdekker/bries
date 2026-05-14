import { useState, useEffect } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, LocationState, TemperatureUnit, WindSpeedUnit, TideData } from '../types/weather';
import { i18n, initI18n, setLanguage, LANGUAGE_KEY } from '../utils/i18n';

const CACHE_KEY = '@weather_cache';
const UNIT_KEY = '@weather_unit';
const WIND_UNIT_KEY = '@weather_wind_unit';
const SUN_EVENTS_KEY = '@weather_sun_events';
const MOON_PHASE_KEY = '@weather_moon_phase';
const SHOW_TIDES_KEY = '@weather_show_tides';
const TIDES_API_KEY = '@weather_tides_api_key';
const TIDES_CACHE_KEY = '@weather_tides_cache';

const getAccurateLocation = async (): Promise<Location.LocationObject> => {
  const steps = [
    { accuracy: Location.Accuracy.Highest, timeout: 4000 },
    { accuracy: Location.Accuracy.High, timeout: 3000 },
    { accuracy: Location.Accuracy.Balanced, timeout: 3000 }
  ];

  for (const step of steps) {
    try {
      const locationPromise = Location.getCurrentPositionAsync({ accuracy: step.accuracy });
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Location timeout')), step.timeout)
      );
      return await Promise.race([locationPromise, timeoutPromise]) as Location.LocationObject;
    } catch (error) {
      if (step === steps[steps.length - 1]) {
        throw error;
      }
    }
  }
  throw new Error('Failed to get location');
};

import { useWeatherStore } from '../store/weatherStore';

export function useWeather() {
  const store = useWeatherStore();
  
  const weatherData = store.weatherData;
  const setWeatherData = store.setWeatherData;
  const loading = store.loading;
  const setLoading = store.setLoading;
  const error = store.error;
  const setError = store.setError;
  const isOffline = store.isOffline;
  const setIsOffline = store.setIsOffline;
  const refreshing = store.refreshing;
  const setRefreshing = store.setRefreshing;
  const cityName = store.cityName;
  const setCityName = store.setCityName;
  const lastFetchedTime = store.lastFetchedTime;
  const setLastFetchedTime = store.setLastFetchedTime;
  const locationState = store.locationState;
  const setLocationState = store.setLocationState;
  const language = store.language;
  const setLanguageState = store.setLanguage;
  const selectedDate = store.selectedDate;
  const setSelectedDate = store.setSelectedDate;
  
  const isSearchExpanded = store.isSearchExpanded;
  const setIsSearchExpanded = store.setIsSearchExpanded;
  const searchQuery = store.searchQuery;
  const setSearchQuery = store.setSearchQuery;
  const searchResults = store.searchResults;
  const setSearchResults = store.setSearchResults;

  const unit = store.unit;
  const setUnit = store.setUnit;
  const windUnit = store.windUnit;
  const setWindUnit = store.setWindUnit;
  const showSunEvents = store.showSunEvents;
  const setShowSunEvents = store.setShowSunEvents;
  const showMoonPhase = store.showMoonPhase;
  const setShowMoonPhase = store.setShowMoonPhase;
  const showTides = store.showTides;
  const setShowTides = store.setShowTides;
  const stormglassApiKey = store.stormglassApiKey;
  const setStormglassApiKey = store.setStormglassApiKey;
  const tideData = store.tideData;
  const setTideData = store.setTideData;
  const showSettings = store.showSettings;
  const setShowSettings = store.setShowSettings;

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
          const data = await res.json();
          setSearchResults(data.results || []);
        } catch (e) {
          console.log('Autocomplete failed', e);
        }
      }, 400);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchWeather = async (lat: number, lon: number, city: string, overrideUnit?: TemperatureUnit, targetDate?: Date | null) => {
    try {
      setError(null);
      const activeUnit = overrideUnit || unit;
      const unitParam = activeUnit === 'F' ? '&temperature_unit=fahrenheit' : '';
      const activeDate = targetDate !== undefined ? targetDate : selectedDate;
      
      const now = new Date();
      // Consider historical if the date is more than 5 days in the past (Open-Meteo forecast handles up to ~5 days past, archive handles further back)
      const isHistorical = activeDate && (now.getTime() - activeDate.getTime() > 5 * 24 * 60 * 60 * 1000);
      
      let url = '';
      if (isHistorical && activeDate) {
        const startStr = activeDate.toISOString().split('T')[0];
        const endDate = new Date(activeDate);
        endDate.setDate(endDate.getDate() + 13);
        const endStr = endDate.toISOString().split('T')[0];
        
        url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startStr}&end_date=${endStr}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature,is_day&timezone=auto${unitParam}`;
      } else {
        url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m,relativehumidity_2m,uv_index,apparent_temperature,is_day&timezone=auto&forecast_days=14${unitParam}`;
      }
      
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      if (isHistorical && activeDate) {
        const startStr = activeDate.toISOString().split('T')[0];
        const targetTimeStr = startStr + "T12:00";
        let hourIndex = data.hourly.time.indexOf(targetTimeStr);
        if (hourIndex === -1) hourIndex = 12;

        data.current_weather = {
          temperature: data.hourly.temperature_2m[hourIndex],
          windspeed: data.hourly.windspeed_10m[hourIndex],
          weathercode: data.hourly.weathercode[hourIndex],
          is_day: data.hourly.is_day[hourIndex],
          time: data.hourly.time[hourIndex],
          is_historical: true
        };
        
        // Patch missing arrays for UI
        data.hourly.precipitation_probability = new Array(data.hourly.time.length).fill(0);
        data.hourly.uv_index = new Array(data.hourly.time.length).fill(0);
      }
      
      setWeatherData(data);
      setLastFetchedTime(new Date());
      setCityName(city);
      setLocationState(prev => ({ lat, lon, city, isAutoLocation: prev ? prev.isAutoLocation : false }));
      setLoading(false);
      setIsOffline(false);

      try {
        const savedShowTidesStr = await AsyncStorage.getItem(SHOW_TIDES_KEY);
        const shouldShowTides = savedShowTidesStr !== null ? JSON.parse(savedShowTidesStr) : showTides;
        const savedApiKey = await AsyncStorage.getItem(TIDES_API_KEY);
        const apiKey = savedApiKey !== null ? savedApiKey : stormglassApiKey;

        if (shouldShowTides && apiKey) {
          const tideCacheStr = await AsyncStorage.getItem(TIDES_CACHE_KEY);
          let tideCache: any = null;
          if (tideCacheStr) tideCache = JSON.parse(tideCacheStr);

          const nowMs = Date.now();
          if (tideCache && (nowMs - tideCache.retrievedAt < 24 * 60 * 60 * 1000) && Math.abs(tideCache.lat - lat) < 0.1 && Math.abs(tideCache.lon - lon) < 0.1) {
            setTideData(tideCache.data);
          } else {
             const start = new Date();
             start.setHours(0, 0, 0, 0);
             const end = new Date(start);
             end.setDate(end.getDate() + 14);
             
             const startStr = start.toISOString();
             const endStr = end.toISOString();

             const tideRes = await fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lon}&start=${startStr}&end=${endStr}`, {
               headers: { 'Authorization': apiKey }
             });
             if (tideRes.ok) {
               const tData = await tideRes.json();
               const formattedTideData: TideData = {
                 extremes: tData.data,
                 meta: tData.meta,
                 retrievedAt: nowMs
               };
               setTideData(formattedTideData);
               await AsyncStorage.setItem(TIDES_CACHE_KEY, JSON.stringify({
                 data: formattedTideData,
                 lat,
                 lon,
                 retrievedAt: nowMs
               }));
             } else {
               if (tideCache) setTideData(tideCache.data);
             }
          }
        } else {
          setTideData(null);
        }
      } catch (err) {
        console.log('Failed to fetch or load tide data', err);
      }

      try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
          data, city, lat, lon, time: now.toISOString()
        }));
      } catch (e) {
        console.log('Failed to save cache', e);
      }
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      // Fallback logic
      try {
        const cachedStr = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          setWeatherData(cached.data);
          setCityName(cached.city);
          setLocationState({ lat: cached.lat, lon: cached.lon, city: cached.city, isAutoLocation: false });
          setLastFetchedTime(new Date(cached.time));
          setIsOffline(true);
          setError(null);
        } else {
          setError('Unable to fetch weather data. Please check your connection.');
        }
      } catch (cacheErr) {
        setError('Unable to fetch weather data. Please check your connection.');
      }
      setLoading(false); 
    }
  };

  const handleSelectCity = async (city: any) => {
    setIsSearchExpanded(false);
    setSearchQuery('');
    setSearchResults([]);
    setLoading(true);
    setLocationState({ lat: city.latitude, lon: city.longitude, city: city.name, isAutoLocation: false });
    await fetchWeather(city.latitude, city.longitude, city.name);
  };

  const handleCurrentLocation = async () => {
    setLoading(true);
    setIsSearchExpanded(false);
    setSearchQuery('');
    setSearchResults([]);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await getAccurateLocation();
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;
        let city = 'Local Weather';
        
        if (Platform.OS === 'web') {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          const data = await res.json();
          city = data.city || data.locality || 'Local Weather';
        } else {
          let reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
          if (reverseGeocode.length > 0) {
            city = reverseGeocode[0].city || reverseGeocode[0].region || 'Local Weather';
          }
        }
        setLocationState({ lat, lon, city, isAutoLocation: true });
        await fetchWeather(lat, lon, city);
      } else {
        alert("Location permission denied. Please allow location access.");
        setLoading(false);
      }
    } catch (e) {
      alert("Failed to get your current location.");
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!locationState) return;
    setRefreshing(true);
    await fetchWeather(locationState.lat, locationState.lon, locationState.city);
    setRefreshing(false);
  };

  const toggleUnit = async (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    setShowSettings(false);
    try {
      await AsyncStorage.setItem(UNIT_KEY, newUnit);
    } catch (e) {}

    if (locationState) {
      setLoading(true);
      await fetchWeather(locationState.lat, locationState.lon, locationState.city, newUnit);
    }
  };

  const toggleWindUnit = async (newUnit: WindSpeedUnit) => {
    setWindUnit(newUnit);
    setShowSettings(false);
    try {
      await AsyncStorage.setItem(WIND_UNIT_KEY, newUnit);
    } catch (e) {}
  };

  const toggleSunEvents = async (value: boolean) => {
    setShowSunEvents(value);
    try {
      await AsyncStorage.setItem(SUN_EVENTS_KEY, JSON.stringify(value));
    } catch (e) {}
  };

  const toggleMoonPhase = async (value: boolean) => {
    setShowMoonPhase(value);
    try {
      await AsyncStorage.setItem(MOON_PHASE_KEY, JSON.stringify(value));
    } catch (e) {}
  };

  const toggleShowTides = async (value: boolean) => {
    setShowTides(value);
    try {
      await AsyncStorage.setItem(SHOW_TIDES_KEY, JSON.stringify(value));
      if (value && stormglassApiKey && locationState) {
        fetchWeather(locationState.lat, locationState.lon, locationState.city);
      }
    } catch (e) {}
  };

  const saveTideApiKey = async (value: string) => {
    setStormglassApiKey(value);
    try {
      await AsyncStorage.setItem(TIDES_API_KEY, value);
      if (showTides && value && locationState) {
        fetchWeather(locationState.lat, locationState.lon, locationState.city);
      }
    } catch (e) {}
  };

  const changeLanguage = async (lang: string) => {
    await setLanguage(lang);
    setLanguageState(i18n.locale);
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const initData = async () => {
      await initI18n();
      setLanguageState(i18n.locale);
      let loadedUnit: TemperatureUnit = 'C';
      try {
        const savedUnit = await AsyncStorage.getItem(UNIT_KEY);
        if (savedUnit === 'F') {
          loadedUnit = 'F';
          setUnit('F');
        }

        const savedWindUnit = await AsyncStorage.getItem(WIND_UNIT_KEY);
        if (savedWindUnit && (savedWindUnit === 'km/h' || savedWindUnit === 'Beaufort' || savedWindUnit === 'Knots')) {
          setWindUnit(savedWindUnit as WindSpeedUnit);
        }

        try {
          const savedSunEvents = await AsyncStorage.getItem(SUN_EVENTS_KEY);
          if (savedSunEvents !== null) {
            setShowSunEvents(JSON.parse(savedSunEvents));
          }
        } catch (err) {
          console.log('Failed to parse sun events setting');
        }

        try {
          const savedMoonPhase = await AsyncStorage.getItem(MOON_PHASE_KEY);
          if (savedMoonPhase !== null) {
            setShowMoonPhase(JSON.parse(savedMoonPhase));
          }
        } catch (err) {
          console.log('Failed to parse moon phase setting');
        }

        try {
          const savedShowTides = await AsyncStorage.getItem(SHOW_TIDES_KEY);
          if (savedShowTides !== null) setShowTides(JSON.parse(savedShowTides));
          const savedApiKey = await AsyncStorage.getItem(TIDES_API_KEY);
          if (savedApiKey !== null) setStormglassApiKey(savedApiKey);
          const tideCacheStr = await AsyncStorage.getItem(TIDES_CACHE_KEY);
          if (tideCacheStr) setTideData(JSON.parse(tideCacheStr).data);
        } catch (err) {}

        const cachedStr = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          setWeatherData(cached.data);
          setCityName(cached.city);
          setLocationState({ lat: cached.lat, lon: cached.lon, city: cached.city, isAutoLocation: false });
          setLastFetchedTime(new Date(cached.time));
          setLoading(false); 
        }
      } catch (e) {
        console.log('Failed to read cache', e);
      }

      let lat: number | null = null;
      let lon: number | null = null;
      let city = 'Unknown Location';

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await getAccurateLocation();
          lat = location.coords.latitude;
          lon = location.coords.longitude;
          
          if (Platform.OS === 'web') {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const data = await res.json();
            city = data.city || data.locality || 'Local Weather';
          } else {
            let reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
            if (reverseGeocode.length > 0) {
              city = reverseGeocode[0].city || reverseGeocode[0].region || 'Local Weather';
            }
          }
        } else {
          throw new Error('Permission denied');
        }
      } catch (error) {
        console.log('Location permission denied or error:', error);
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          const ipData = await ipRes.json();
          lat = ipData.latitude;
          lon = ipData.longitude;
          city = ipData.city || 'Network Location';
        } catch (ipError) {
          console.log('IP Location failed', ipError);
          lat = 51.5074; 
          lon = -0.1278;
          city = 'London (Fallback)';
        }
      }
      
      setLocationState(prev => prev ? prev : { lat: lat!, lon: lon!, city, isAutoLocation: true });
      await fetchWeather(lat!, lon!, city, loadedUnit);

    };

    initData();
  }, []);

  useEffect(() => {
    if (!locationState) return;
    
    const intervalId = setInterval(() => {
      fetchWeather(locationState.lat, locationState.lon, locationState.city);
    }, 900000);
    
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        if (locationState.isAutoLocation) {
          try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              let location = await getAccurateLocation();
              const lat = location.coords.latitude;
              const lon = location.coords.longitude;
              fetchWeather(lat, lon, locationState.city);
            } else {
              fetchWeather(locationState.lat, locationState.lon, locationState.city);
            }
          } catch(e) {
            fetchWeather(locationState.lat, locationState.lon, locationState.city);
          }
        } else {
          fetchWeather(locationState.lat, locationState.lon, locationState.city);
        }
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [locationState, unit]);

  return {
    weatherData,
    loading,
    error,
    isOffline,
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
    language,
    changeLanguage,
    selectedDate,
    setSelectedDate: async (date: Date | null) => {
      setSelectedDate(date);
      setLoading(true);
      if (locationState) {
        await fetchWeather(locationState.lat, locationState.lon, locationState.city, unit, date);
      }
    }
  };
}
