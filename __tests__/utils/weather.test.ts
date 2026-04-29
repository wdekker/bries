import { getWeatherInfo, generateHourlyItems } from '../../utils/weather';
import { Sun, CloudRain } from 'lucide-react-native';

const mockHourly = {
  time: Array.from({length: 24}, (_, i) => `2026-04-29T${i.toString().padStart(2, '0')}:00Z`),
  temperature_2m: Array(24).fill(10),
  weathercode: Array(24).fill(0)
};

const mockDaily = {
  time: ['2026-04-29'],
  sunrise: ['2026-04-29T06:00'],
  sunset: ['2026-04-29T20:00']
};

describe('weather utils', () => {
  it('returns correct label and icon for clear sky', () => {
    const info = getWeatherInfo(0);
    expect(info.label).toBe('Clear Sky');
    expect(info.icon).toBe(Sun);
  });

  it('returns correct label and icon for rain', () => {
    const info = getWeatherInfo(61);
    expect(info.label).toBe('Rain');
    expect(info.icon).toBe(CloudRain);
  });

  it('injects sunrise and sunset events correctly', () => {
    const items = generateHourlyItems(mockHourly, mockDaily, 0, 24, true);
    const sunEvents = items.filter(i => i.type === 'sunrise' || i.type === 'sunset');
    expect(sunEvents.length).toBeGreaterThan(0);
    expect(sunEvents[0].type).toBe('sunrise');
  });

  it('injects tide events correctly', () => {
    const mockTideData = {
      extremes: [
        { type: 'high', height: 1.5, time: '2026-04-29T10:00:00Z' }
      ],
      meta: { station: { name: 'Test', distance: 1 } },
      retrievedAt: Date.now()
    };
    
    const items = generateHourlyItems(mockHourly, mockDaily, 0, 24, true, false, mockTideData as any);
    const tideEvents = items.filter(i => i.type === 'tide');
    
    expect(tideEvents.length).toBe(1);
    expect(tideEvents[0].tideType).toBe('high');
    expect(tideEvents[0].height).toBe(1.5);
  });
});
