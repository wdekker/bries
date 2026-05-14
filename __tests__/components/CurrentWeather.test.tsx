import React from 'react';
import { render } from '@testing-library/react-native';
import { CurrentWeather } from '../../components/CurrentWeather';
import { mockWeatherData } from '../../__mocks__/mockData';

import { useWeatherStore } from '../../store/weatherStore';

jest.mock('../../store/weatherStore');

describe('CurrentWeather Component', () => {
  beforeEach(() => {
    (useWeatherStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        weatherData: mockWeatherData,
        cityName: "Berlin",
        lastFetchedTime: new Date('2023-10-10T12:00:00Z'),
        isDark: true,
        showMoonPhase: true,
        showTides: true,
        tideData: null,
        windUnit: "km/h",
        selectedDate: null,
      };
      return selector(state);
    });
  });

  it('renders correctly with given weather data', () => {
    const { getByText } = render(<CurrentWeather />);

    expect(getByText('Berlin')).toBeTruthy();
    expect(getByText('16°')).toBeTruthy(); 
    expect(getByText('Partly Cloudy')).toBeTruthy();
    expect(getByText('10.2 km/h')).toBeTruthy();
  });
});
