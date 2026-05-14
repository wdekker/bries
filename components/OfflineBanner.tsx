import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';

interface OfflineBannerProps {
  lastFetchedTime: Date | null;
}

export function OfflineBanner({ lastFetchedTime }: OfflineBannerProps) {
  let timeStr = '';
  if (lastFetchedTime) {
    const diffHours = Math.round((Date.now() - lastFetchedTime.getTime()) / (1000 * 60 * 60));
    if (diffHours === 0) {
      timeStr = 'recently';
    } else {
      timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
  }

  return (
    <View style={styles.container}>
      <WifiOff size={16} color="#fff" style={styles.icon} />
      <Text style={styles.text}>
        You are offline. Showing cached data {timeStr ? `from ${timeStr}` : ''}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ef4444', // red-500
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    zIndex: 50,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
