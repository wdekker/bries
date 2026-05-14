import { renderHook, waitFor } from '@testing-library/react-native';
import { useWeather } from '../../hooks/useWeather';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 52.52, longitude: 13.41 } }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([{ city: 'Berlin' }]),
  Accuracy: { Balanced: 3, High: 4, Low: 2, Lowest: 1 },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

globalThis.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      latitude: 52.52,
      longitude: 13.41,
      current_weather: { temperature: 15.5, weathercode: 1, windspeed: 10, is_day: 1, time: '2023-10-10T12:00' },
      daily: { temperature_2m_max: [20], temperature_2m_min: [10], time: ['2023-10-10'] },
      hourly: { temperature_2m: [15], time: ['2023-10-10T12:00'], weathercode: [1] }
    }),
  })
) as jest.Mock;

describe('useWeather Hook', () => {
  it('initializes and fetches weather data', async () => {
    const { result, unmount } = renderHook(() => useWeather());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.cityName).toBe('Berlin');
    expect(result.current.weatherData).toBeTruthy();
    expect(result.current.weatherData?.current_weather.temperature).toBe(15.5);

    unmount();
  });
});
