import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Switch, Platform } from 'react-native';
import { X, Download, Sunrise } from 'lucide-react-native';
import { TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  windUnit: WindSpeedUnit;
  onToggleWindUnit: (unit: WindSpeedUnit) => void;
  showSunEvents: boolean;
  onToggleSunEvents: (value: boolean) => void;
  isDark: boolean;
}

export function SettingsModal({ visible, onClose, unit, onToggleUnit, windUnit, onToggleWindUnit, showSunEvents, onToggleSunEvents, isDark }: SettingsModalProps) {
  const { isInstallable, promptInstall } = usePWAInstall();

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#cbd5e1' : '#64748b'} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b' }]}>Temperature Unit</Text>
          <View style={styles.unitToggleRow}>
            <TouchableOpacity 
              style={[
                styles.unitBtn, 
                unit === 'C' ? { backgroundColor: '#38bdf8' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                { marginRight: 5 }
              ]}
              onPress={() => onToggleUnit('C')}
            >
              <Text style={{ color: unit === 'C' ? '#ffffff' : (isDark ? '#ffffff' : '#000000'), fontWeight: '600' }}>Celsius (°C)</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.unitBtn, 
                unit === 'F' ? { backgroundColor: '#38bdf8' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                { marginLeft: 5 }
              ]}
              onPress={() => onToggleUnit('F')}
            >
              <Text style={{ color: unit === 'F' ? '#ffffff' : (isDark ? '#ffffff' : '#000000'), fontWeight: '600' }}>Fahrenheit (°F)</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b', marginTop: 16 }]}>Wind Speed Unit</Text>
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
              <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b' }]}>App Installation</Text>
              <TouchableOpacity 
                onPress={promptInstall} 
                style={[styles.linkButton, { backgroundColor: '#38bdf8', flexDirection: 'row', justifyContent: 'center' }]}
              >
                <Download size={18} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={[styles.linkText, { color: '#ffffff' }]}>Install Bries to Home Screen</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.aboutContainer}>
            <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b' }]}>Timeline Events</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Sunrise size={20} color={isDark ? '#fbbf24' : '#d97706'} style={{ marginRight: 8 }} />
                <Text style={{ color: isDark ? '#ffffff' : '#000000', fontSize: 15, fontWeight: '500' }}>Sunrise & Sunset</Text>
              </View>
              <Switch
                value={showSunEvents}
                onValueChange={onToggleSunEvents}
                trackColor={{ false: isDark ? '#334155' : '#cbd5e1', true: '#38bdf8' }}
                thumbColor={Platform.OS === 'ios' ? '#ffffff' : showSunEvents ? '#ffffff' : '#f8fafc'}
                ios_backgroundColor={isDark ? '#334155' : '#cbd5e1'}
              />
            </View>
          </View>

          <View style={[styles.aboutContainer, isInstallable ? { marginTop: 0 } : {}]}>
            <Text style={[styles.modalLabel, { color: isDark ? '#cbd5e1' : '#64748b', marginTop: 10 }]}>About Bries</Text>
            <Text style={[styles.aboutText, { color: isDark ? '#f1f5f9' : '#334155' }]}>
              Bries was created to provide a free, privacy-first, ad-free, and open-source alternative to current weather apps. It relies purely on the Open-Meteo API, requiring no API keys or personal data tracking.
            </Text>
            
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/wdekker/bries')} style={styles.linkButton}>
              <Text style={styles.linkText}>View Source on GitHub</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => Linking.openURL('http://dekker.dev/contact')} style={styles.linkButton}>
              <Text style={styles.linkText}>Contact Developer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  modalContent: {
    width: 320, 
    borderRadius: 24, 
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
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
});
