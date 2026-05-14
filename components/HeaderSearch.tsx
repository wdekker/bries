import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { Search, MapPin, X, Settings as SettingsIcon, RefreshCcw, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { i18n } from '../utils/i18n';

interface HeaderSearchProps {
  isDark: boolean;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: any[];
  setSearchResults: (val: any[]) => void;
  handleSelectCity: (city: any) => void;
  handleCurrentLocation: () => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
  setShowSettings: (val: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  language: string;
}

export function HeaderSearch({
  isDark, isSearchExpanded, setIsSearchExpanded, searchQuery, setSearchQuery, 
  searchResults, setSearchResults, handleSelectCity, handleCurrentLocation, handleRefresh, isRefreshing, setShowSettings,
  selectedDate, setSelectedDate, language
}: HeaderSearchProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const textColor = isDark ? '#f8fafc' : '#ffffff';
  const subTextColor = isDark ? '#cbd5e1' : '#e0f2fe';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.2)';
  const activeCardBg = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.4)';

  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [isRefreshing, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <>
      <View style={styles.headerRow}>
        {isSearchExpanded ? (
          <View style={[styles.searchContainer, { backgroundColor: cardBg }]}>
            <Search size={20} color={subTextColor} />
            <TextInput
              style={[styles.searchInput, { color: textColor }, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholder={i18n.t('searchCity')}
              placeholderTextColor={subTextColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setIsSearchExpanded(false); setSearchQuery(''); setSearchResults([]); }}>
              <X size={20} color={subTextColor} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setIsSearchExpanded(true)} style={[styles.iconBtn, { backgroundColor: cardBg }]}>
              <Search size={22} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCurrentLocation} style={[styles.iconBtn, { backgroundColor: cardBg }]}>
              <MapPin size={22} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRefresh} style={[styles.iconBtn, { backgroundColor: cardBg }]} disabled={isRefreshing}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <RefreshCcw size={22} color={textColor} />
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity testID="calendar-button" onPress={() => setShowDatePicker(true)} style={[styles.iconBtn, { backgroundColor: cardBg }]}>
              <Calendar size={22} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettings(true)} style={[styles.iconBtn, { backgroundColor: cardBg }]}>
              <SettingsIcon size={22} color={textColor} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {selectedDate && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
          <View style={{ backgroundColor: activeCardBg, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Calendar size={16} color={textColor} style={{ marginRight: 8 }} />
            <Text style={{ color: textColor, fontWeight: '600', marginRight: 10 }}>
              {selectedDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </Text>
            <TouchableOpacity onPress={() => setSelectedDate(null)}>
              <X size={16} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (event.type === 'set' && date) {
              setSelectedDate(date);
            }
          }}
        />
      )}

      {showDatePicker && Platform.OS === 'web' && (
        <View style={{ backgroundColor: activeCardBg, padding: 15, borderRadius: 16, marginBottom: 15, alignItems: 'center' }}>
          <Text style={{ color: textColor, marginBottom: 10, fontWeight: '600' }}>{i18n.t('selectDate')}</Text>
          {React.createElement('input', {
            type: 'date',
            max: new Date().toISOString().split('T')[0],
            defaultValue: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            onChange: (e: any) => {
              if (e.target.value) {
                const d = new Date(e.target.value);
                d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
                setSelectedDate(d);
                setShowDatePicker(false);
              }
            },
            style: { padding: 10, borderRadius: 8, border: 'none', fontSize: 16, width: '100%', maxWidth: 250, outline: 'none' }
          })}
          <TouchableOpacity onPress={() => setShowDatePicker(false)} style={{ marginTop: 15, paddingVertical: 8, paddingHorizontal: 24, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20 }}>
            <Text style={{ color: textColor, fontWeight: '600' }}>{i18n.t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isSearchExpanded && searchResults.length > 0 && (
        <View style={[styles.autocompleteInline, { backgroundColor: activeCardBg }]}>
          {searchResults.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.autocompleteItem, idx === searchResults.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => handleSelectCity(item)}
            >
              <Text style={{ color: textColor, fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
              <Text style={{ color: subTextColor, fontSize: 12, marginTop: 2 }}>
                {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 48,
    marginBottom: 10,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  autocompleteInline: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  autocompleteItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
});
