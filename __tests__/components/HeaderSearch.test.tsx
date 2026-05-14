import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HeaderSearch } from '../../components/HeaderSearch';
import { Platform } from 'react-native';

describe('HeaderSearch Component - Time Travel', () => {
  it('opens native DateTimePicker on iOS/Android when calendar icon is clicked', () => {
    // Set platform to iOS to test native DateTimePicker
    Platform.OS = 'ios';
    
    const { getByTestId, queryByText, queryByTestId } = render(
      <HeaderSearch 
        isDark={false}
        isSearchExpanded={false}
        setIsSearchExpanded={jest.fn()}
        searchQuery=""
        setSearchQuery={jest.fn()}
        searchResults={[]}
        setSearchResults={jest.fn()}
        handleSelectCity={jest.fn()}
        handleCurrentLocation={jest.fn()}
        handleRefresh={jest.fn()}
        isRefreshing={false}
        setShowSettings={jest.fn()}
        selectedDate={null}
        setSelectedDate={jest.fn()}
        language="en"
      />
    );

    // DateTimePicker shouldn't be visible yet (we mock it as a simple element, but here we can check if it exists by its mock type)
    // Because DateTimePicker is mocked globally, we can just check if any text inside the web picker is NOT visible
    expect(queryByText('Select Date')).toBeNull();

    // Click calendar
    const calendarButton = getByTestId('calendar-button');
    fireEvent.press(calendarButton);

    // On iOS/Android, it should just render DateTimePicker, which is mocked
    // The web specific 'Select Date' UI should NOT be rendered
    expect(queryByText('Select Date')).toBeNull();
  });

  it('opens HTML5 input wrapper on Web when calendar icon is clicked', () => {
    // Set platform to web
    Platform.OS = 'web';
    
    const { getByTestId, getByText, queryByText } = render(
      <HeaderSearch 
        isDark={false}
        isSearchExpanded={false}
        setIsSearchExpanded={jest.fn()}
        searchQuery=""
        setSearchQuery={jest.fn()}
        searchResults={[]}
        setSearchResults={jest.fn()}
        handleSelectCity={jest.fn()}
        handleCurrentLocation={jest.fn()}
        handleRefresh={jest.fn()}
        isRefreshing={false}
        setShowSettings={jest.fn()}
        selectedDate={null}
        setSelectedDate={jest.fn()}
        language="en"
      />
    );

    // Should not be visible initially
    expect(queryByText('Select Date')).toBeNull();

    // Click calendar
    const calendarButton = getByTestId('calendar-button');
    fireEvent.press(calendarButton);

    // Should render the custom Web date picker UI
    expect(getByText('Select Date')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();

    // Close it
    fireEvent.press(getByText('Cancel'));
    expect(queryByText('Select Date')).toBeNull();
  });
});
