# Bries

A beautiful, high-performance, cross-platform weather application built with Expo and React Native.

## About Bries
Bries was created to provide a free, privacy-first, ad-free, and open-source alternative to current weather apps (much in line with the philosophy behind [deqr.dekker.dev](https://deqr.dekker.dev)). It relies purely on the Open-Meteo API, requiring no API keys or personal data tracking.

- **GitHub Repository**: [https://github.com/wdekker/bries](https://github.com/wdekker/bries)
- **Contact**: [http://dekker.dev/contact](http://dekker.dev/contact)

## Features
- **Cross-Platform:** Runs seamlessly on iOS, Android, and the Web.
- **Robust Architecture:** Clean Container/Presenter split using custom React hooks for business logic.
- **13-Day Forecast:** Detailed daily metrics in a sleek accordion UI.
- **Hourly Timeline:** Smooth horizontal scrolling timeline for the next 24 hours.
- **Offline First:** Caches the last known weather data via `AsyncStorage` and displays it when offline or network fails.
- **Dynamic Localization:** Automatically converts fetched timezones into your local device time if you search for distant cities.
- **Intelligent Autocomplete:** Search for any city globally with real-time geocoding suggestions.

## Tech Stack
- **Framework:** Expo & React Native
- **Language:** TypeScript
- **State Management:** Custom React Hooks (`useWeather`)
- **API:** [Open-Meteo](https://open-meteo.com/) (No API Key Required!)
- **Testing:** Jest, `@testing-library/react-native`
- **Icons:** Lucide React Native

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on your mobile device (optional, for physical device testing)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather.git
   cd weather
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
To start the Expo development server:
```bash
npm start
```
- Press `w` to open the web version.
- Press `i` to open the iOS simulator.
- Press `a` to open the Android emulator.
- Scan the QR code with the Expo Go app to run on a physical device.

## Testing
To run the automated Jest test suite:
```bash
npm test
```
