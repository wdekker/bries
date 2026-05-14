import { create } from 'zustand';
import { WeatherData, LocationState, TemperatureUnit, WindSpeedUnit, TideData } from '../types/weather';
import { i18n } from '../utils/i18n';

interface WeatherState {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  refreshing: boolean;
  cityName: string;
  lastFetchedTime: Date | null;
  locationState: LocationState | null;
  language: string;
  selectedDate: Date | null;
  
  isSearchExpanded: boolean;
  searchQuery: string;
  searchResults: any[];

  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  showSunEvents: boolean;
  showMoonPhase: boolean;
  showTides: boolean;
  stormglassApiKey: string;
  tideData: TideData | null;
  showSettings: boolean;

  setWeatherData: (data: WeatherData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsOffline: (isOffline: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setCityName: (name: string) => void;
  setLastFetchedTime: (time: Date | null) => void;
  setLocationState: (state: LocationState | null | ((prev: LocationState | null) => LocationState | null)) => void;
  setLanguage: (lang: string) => void;
  setSelectedDate: (date: Date | null) => void;

  setIsSearchExpanded: (expanded: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;

  setUnit: (unit: TemperatureUnit) => void;
  setWindUnit: (unit: WindSpeedUnit) => void;
  setShowSunEvents: (show: boolean) => void;
  setShowMoonPhase: (show: boolean) => void;
  setShowTides: (show: boolean) => void;
  setStormglassApiKey: (key: string) => void;
  setTideData: (data: TideData | null) => void;
  setShowSettings: (show: boolean) => void;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  weatherData: null,
  loading: true,
  error: null,
  isOffline: false,
  refreshing: false,
  cityName: 'Locating...',
  lastFetchedTime: null,
  locationState: null,
  language: i18n.locale,
  selectedDate: null,

  isSearchExpanded: false,
  searchQuery: '',
  searchResults: [],

  unit: 'C',
  windUnit: 'km/h',
  showSunEvents: true,
  showMoonPhase: true,
  showTides: false,
  stormglassApiKey: '',
  tideData: null,
  showSettings: false,

  setWeatherData: (data) => set({ weatherData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setIsOffline: (isOffline) => set({ isOffline }),
  setRefreshing: (refreshing) => set({ refreshing }),
  setCityName: (cityName) => set({ cityName }),
  setLastFetchedTime: (lastFetchedTime) => set({ lastFetchedTime }),
  setLocationState: (updater) => set((state) => ({
    locationState: typeof updater === 'function' ? updater(state.locationState) : updater
  })),
  setLanguage: (language) => set({ language }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),

  setIsSearchExpanded: (isSearchExpanded) => set({ isSearchExpanded }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchResults: (searchResults) => set({ searchResults }),

  setUnit: (unit) => set({ unit }),
  setWindUnit: (windUnit) => set({ windUnit }),
  setShowSunEvents: (showSunEvents) => set({ showSunEvents }),
  setShowMoonPhase: (showMoonPhase) => set({ showMoonPhase }),
  setShowTides: (showTides) => set({ showTides }),
  setStormglassApiKey: (stormglassApiKey) => set({ stormglassApiKey }),
  setTideData: (tideData) => set({ tideData }),
  setShowSettings: (showSettings) => set({ showSettings }),
}));
