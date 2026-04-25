import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, LocationState, TemperatureUnit } from '../types/weather';

const CACHE_KEY = '@weather_cache';
const UNIT_KEY = '@weather_unit';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cityName, setCityName] = useState('Locating...');
  const [lastFetchedTime, setLastFetchedTime] = useState<Date | null>(null);
  const [locationState, setLocationState] = useState<LocationState | null>(null);
  
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
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

  const fetchWeather = async (lat: number, lon: number, city: string, overrideUnit?: TemperatureUnit) => {
    try {
      setError(null);
      const activeUnit = overrideUnit || unit;
      const unitParam = activeUnit === 'F' ? '&temperature_unit=fahrenheit' : '';
      
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=14${unitParam}`
      );
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      const now = new Date();
      setWeatherData(data);
      setLastFetchedTime(now);
      setCityName(city);
      setLocationState({ lat, lon, city });
      setLoading(false);

      try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
          data, city, lat, lon, time: now.toISOString()
        }));
      } catch (e) {
        console.log('Failed to save cache', e);
      }
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError('Unable to fetch weather data. Please check your connection.');
      setLoading(false); 
    }
  };

  const handleSelectCity = async (city: any) => {
    setIsSearchExpanded(false);
    setSearchQuery('');
    setSearchResults([]);
    setLoading(true);
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
        let location = await Location.getCurrentPositionAsync({});
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

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const initData = async () => {
      let loadedUnit: TemperatureUnit = 'C';
      try {
        const savedUnit = await AsyncStorage.getItem(UNIT_KEY);
        if (savedUnit === 'F') {
          loadedUnit = 'F';
          setUnit('F');
        }

        const cachedStr = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          setWeatherData(cached.data);
          setCityName(cached.city);
          setLocationState({ lat: cached.lat, lon: cached.lon, city: cached.city });
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
          let location = await Location.getCurrentPositionAsync({});
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
      
      await fetchWeather(lat!, lon!, city, loadedUnit);

      intervalId = setInterval(() => {
        if (locationState) {
          fetchWeather(locationState.lat, locationState.lon, locationState.city);
        }
      }, 900000); 
    };

    initData();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return {
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
    showSettings,
    setShowSettings,
    handleSelectCity,
    handleCurrentLocation,
    onRefresh,
    toggleUnit,
  };
}
