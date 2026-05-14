jest.mock('expo/src/winter/runtime.native.ts', () => ({}));
jest.mock('expo/src/winter/installGlobal.ts', () => ({}));

/* eslint-env jest */
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 52.52, longitude: 13.41 } }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([{ city: 'Berlin' }]),
}));

jest.mock('expo-localization', () => ({
  getLocales: jest.fn().mockReturnValue([{ languageCode: 'en' }]),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

// Provide basic fetch polyfill
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

jest.mock('lucide-react-native', () => ({
  Sun: 'SunIcon',
  CloudRain: 'CloudRainIcon',
  Cloud: 'CloudIcon',
  CloudSun: 'CloudSunIcon',
  CloudMoon: 'CloudMoonIcon',
  CloudFog: 'CloudFogIcon',
  CloudDrizzle: 'CloudDrizzleIcon',
  CloudSnow: 'CloudSnowIcon',
  CloudLightning: 'CloudLightningIcon',
  Wind: 'WindIcon',
  Search: 'SearchIcon',
  MapPin: 'MapPinIcon',
  X: 'XIcon',
  Settings: 'SettingsIcon',
  Moon: 'MoonIcon',
  Waves: 'WavesIcon',
  Sunrise: 'SunriseIcon',
  Sunset: 'SunsetIcon',
  ChevronDown: 'ChevronDownIcon',
  ChevronUp: 'ChevronUpIcon',
  Calendar: 'CalendarIcon',
  Thermometer: 'ThermometerIcon',
  Droplets: 'DropletsIcon',
  RefreshCcw: 'RefreshCcwIcon'
}));
