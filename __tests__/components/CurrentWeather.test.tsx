import React from 'react';
import { render } from '@testing-library/react-native';
import { CurrentWeather } from '../../components/CurrentWeather';
import { mockWeatherData } from '../../__mocks__/mockData';

describe('CurrentWeather Component', () => {
  it('renders correctly with given weather data', () => {
    const { getByText } = render(
      <CurrentWeather 
        weatherData={mockWeatherData} 
        cityName="Berlin" 
        lastFetchedTime={new Date('2023-10-10T12:00:00Z')} 
        isDark={true} 
        showMoonPhase={true}
        showTides={true}
        tideData={null}
        windUnit="km/h"
        selectedDate={null}
      />
    );

    expect(getByText('Berlin')).toBeTruthy();
    expect(getByText('16°')).toBeTruthy(); 
    expect(getByText('Partly Cloudy')).toBeTruthy();
    expect(getByText('10.2 km/h')).toBeTruthy();
  });
});
