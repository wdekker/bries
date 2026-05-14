import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Switch, Platform, TextInput, ScrollView } from 'react-native';
import { X, Download, Sunrise, Moon, Waves, ChevronDown, ChevronUp } from 'lucide-react-native';
import { TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { i18n } from '../utils/i18n';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  windUnit: WindSpeedUnit;
  onToggleWindUnit: (unit: WindSpeedUnit) => void;
  showSunEvents: boolean;
  onToggleSunEvents: (value: boolean) => void;
  showMoonPhase: boolean;
  onToggleMoonPhase: (value: boolean) => void;
  showTides: boolean;
  onToggleTides: (value: boolean) => void;
  stormglassApiKey: string;
  onChangeApiKey: (value: string) => void;
  isDark: boolean;
  language: string;
  onChangeLanguage: (lang: string) => void;
}

export function SettingsModal({ visible, onClose, unit, onToggleUnit, windUnit, onToggleWindUnit, showSunEvents, onToggleSunEvents, showMoonPhase, onToggleMoonPhase, showTides, onToggleTides, stormglassApiKey, onChangeApiKey, isDark, language, onChangeLanguage }: SettingsModalProps) {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languageNames = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    nl: 'Nederlands'
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>{i18n.t('settings')}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#cbd5e1' : '#64748b'} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b', zIndex: 2 }]}>{i18n.t('language')}</Text>
            
            <View style={{ zIndex: 10, marginBottom: 10 }}>
              <TouchableOpacity 
                style={[styles.dropdownHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                onPress={() => setLangDropdownOpen(!langDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={{ color: isDark ? '#ffffff' : '#000000', fontSize: 15, fontWeight: '500' }}>
                  {languageNames[language as keyof typeof languageNames] || 'English'}
                </Text>
                {langDropdownOpen ? <ChevronUp size={20} color={isDark ? '#cbd5e1' : '#64748b'} /> : <ChevronDown size={20} color={isDark ? '#cbd5e1' : '#64748b'} />}
              </TouchableOpacity>

              {langDropdownOpen && (
                <View style={[styles.dropdownList, { backgroundColor: isDark ? '#334155' : '#f8fafc' }]}>
                  {['en', 'de', 'fr', 'nl'].map(lang => (
                    <TouchableOpacity 
                      key={lang}
                      style={[styles.dropdownItem, language === lang && { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(56, 189, 248, 0.1)' }]}
                      onPress={() => {
                        onChangeLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                    >
                      <Text style={{ color: language === lang ? '#38bdf8' : (isDark ? '#ffffff' : '#000000'), fontSize: 15, fontWeight: language === lang ? '600' : '400' }}>
                        {languageNames[lang as keyof typeof languageNames]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b', marginTop: 16 }]}>{i18n.t('temperatureUnit')}</Text>
          <View style={styles.unitToggleRow}>
            <TouchableOpacity 
              style={[
                styles.unitBtn, 
                unit === 'C' ? { backgroundColor: '#38bdf8' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                { marginRight: 5 }
              ]}
              onPress={() => onToggleUnit('C')}
            >
              <Text style={{ color: unit === 'C' ? '#ffffff' : (isDark ? '#ffffff' : '#000000'), fontWeight: '600' }}>{i18n.t('celsius')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.unitBtn, 
                unit === 'F' ? { backgroundColor: '#38bdf8' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                { marginLeft: 5 }
              ]}
              onPress={() => onToggleUnit('F')}
            >
              <Text style={{ color: unit === 'F' ? '#ffffff' : (isDark ? '#ffffff' : '#000000'), fontWeight: '600' }}>{i18n.t('fahrenheit')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b', marginTop: 16 }]}>{i18n.t('windSpeedUnit')}</Text>
          <View style={styles.unitToggleRow}>
            <TouchableOpacity 
              style={[
                styles.unitBtn, 
                windUnit === 'km/h' ? { backgroundColor: '#38bdf8' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                { marginRight: 4 }
              ]}
              onPress={() => onToggleWindUnit('km/h')}
            >
              <Text style={{ color: windUnit === 'km/h' ? '#ffffff' : (isDark ? '#ffffff' : '#000000'), fontWeight: '600', fontSize: 13 }}>km/h</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.unitBtn, 
                windUnit === 'Beaufort' ? { backgroundColor: '#38bdf8' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                { marginHorizontal: 4 }
              ]}
              onPress={() => onToggleWindUnit('Beaufort')}
            >
              <Text style={{ color: windUnit === 'Beaufort' ? '#ffffff' : (isDark ? '#ffffff' : '#000000'), fontWeight: '600', fontSize: 13 }}>Beaufort</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.unitBtn, 
                windUnit === 'Knots' ? { backgroundColor: '#38bdf8' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                { marginLeft: 4 }
              ]}
              onPress={() => onToggleWindUnit('Knots')}
            >
              <Text style={{ color: windUnit === 'Knots' ? '#ffffff' : (isDark ? '#ffffff' : '#000000'), fontWeight: '600', fontSize: 13 }}>Knots</Text>
            </TouchableOpacity>
          </View>

          {isInstallable && (
            <View style={styles.aboutContainer}>
              <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b' }]}>{i18n.t('appInstallation')}</Text>
              <TouchableOpacity 
                onPress={promptInstall} 
                style={[styles.linkButton, { backgroundColor: '#38bdf8', flexDirection: 'row', justifyContent: 'center' }]}
              >
                <Download size={18} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={[styles.linkText, { color: '#ffffff' }]}>{i18n.t('installBries')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.aboutContainer}>
            <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b' }]}>{i18n.t('timelineEvents')}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Sunrise size={20} color={isDark ? '#fbbf24' : '#d97706'} style={{ marginRight: 8 }} />
                <Text style={{ color: isDark ? '#ffffff' : '#000000', fontSize: 15, fontWeight: '500' }}>{i18n.t('sunriseAndSunset')}</Text>
              </View>
              <Switch
                value={showSunEvents}
                onValueChange={onToggleSunEvents}
                trackColor={{ false: isDark ? '#334155' : '#cbd5e1', true: '#38bdf8' }}
                thumbColor={Platform.OS === 'ios' ? '#ffffff' : showSunEvents ? '#ffffff' : '#f8fafc'}
                ios_backgroundColor={isDark ? '#334155' : '#cbd5e1'}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Moon size={20} color={isDark ? '#e2e8f0' : '#475569'} style={{ marginRight: 8 }} />
                <Text style={{ color: isDark ? '#ffffff' : '#000000', fontSize: 15, fontWeight: '500' }}>{i18n.t('moonPhase')}</Text>
              </View>
              <Switch
                value={showMoonPhase}
                onValueChange={onToggleMoonPhase}
                trackColor={{ false: isDark ? '#334155' : '#cbd5e1', true: '#38bdf8' }}
                thumbColor={Platform.OS === 'ios' ? '#ffffff' : showMoonPhase ? '#ffffff' : '#f8fafc'}
                ios_backgroundColor={isDark ? '#334155' : '#cbd5e1'}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: showTides ? 8 : 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Waves size={20} color={isDark ? '#93c5fd' : '#3b82f6'} style={{ marginRight: 8 }} />
                <Text style={{ color: isDark ? '#ffffff' : '#000000', fontSize: 15, fontWeight: '500' }}>{i18n.t('tideEvents')}</Text>
              </View>
              <Switch
                value={showTides}
                onValueChange={onToggleTides}
                trackColor={{ false: isDark ? '#334155' : '#cbd5e1', true: '#38bdf8' }}
                thumbColor={Platform.OS === 'ios' ? '#ffffff' : showTides ? '#ffffff' : '#f8fafc'}
                ios_backgroundColor={isDark ? '#334155' : '#cbd5e1'}
              />
            </View>

            {showTides && (
              <View style={{ marginTop: 8, marginBottom: 8, paddingLeft: 28 }}>
                <TextInput
                  style={[styles.apiKeyInput, { color: isDark ? '#ffffff' : '#000000', borderColor: isDark ? '#475569' : '#cbd5e1', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }]}
                  placeholder="Stormglass.io API Key"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={stormglassApiKey}
                  onChangeText={onChangeApiKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => Linking.openURL('https://stormglass.io/')}>
                  <Text style={{ color: '#38bdf8', fontSize: 12, marginTop: 4 }}>Get a free API key at stormglass.io</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.aboutContainer, isInstallable ? { marginTop: 0 } : {}]}>
            <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b', marginTop: 10 }]}>{i18n.t('aboutBries')}</Text>
            <Text style={[styles.aboutText, { color: isDark ? '#f1f5f9' : '#334155' }]}>
              {i18n.t('aboutText')}
            </Text>
            
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/wdekker/bries')} style={styles.linkButton}>
              <Text style={styles.linkText}>{i18n.t('viewSource')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => Linking.openURL('http://dekker.dev/contact')} style={styles.linkButton}>
              <Text style={styles.linkText}>{i18n.t('contactDeveloper')}</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  modalContent: {
    width: '100%', 
    maxHeight: '85%',
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 20,
  },
  scrollViewContent: {
    marginTop: 8,
  },
  modalHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24
  },
  modalTitle: {
    fontSize: 22, 
    fontWeight: '700'
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  unitToggleRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 10
  },
  unitBtn: {
    flex: 1, 
    paddingVertical: 14, 
    alignItems: 'center', 
    borderRadius: 12, 
  },
  aboutContainer: {
    marginTop: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  linkButton: {
    paddingVertical: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#38bdf8',
    fontWeight: '600',
    fontSize: 14,
  },
  apiKeyInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  dropdownList: {
    marginTop: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  }
});
