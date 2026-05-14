import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    clearSky: 'Clear Sky',
    partlyCloudy: 'Partly Cloudy',
    overcast: 'Overcast',
    fog: 'Fog',
    drizzle: 'Drizzle',
    rain: 'Rain',
    snow: 'Snow',
    thunderstorm: 'Thunderstorm',
    clear: 'Clear',
    today: 'Today',
    now: 'Now',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    highTide: 'High Tide',
    lowTide: 'Low Tide',
    moreDetails: 'More Details',
    hideDetails: 'Hide Details',
    localTime: 'Local Time',
    updated: 'Updated',
    wind: 'Wind',
    high: 'High',
    low: 'Low',
    todaysTides: 'Today\'s Tides',
    station: 'Station',
    retrieved: 'Retrieved',
    loading: 'Loading...',
    retry: 'Retry',
    searchCity: 'Search for a city...',
    currentLocation: 'Current Location',
    cancel: 'Cancel',
    settings: 'Settings',
    temperatureUnit: 'Temperature Unit',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    windSpeedUnit: 'Wind Speed Unit',
    timelineEvents: 'Timeline Events',
    sunriseAndSunset: 'Sunrise & Sunset',
    moonPhase: 'Moon Phase',
    tideEvents: 'Tide Events',
    aboutBries: 'About Bries',
    aboutText: 'Bries was created to provide a free, privacy-first, ad-free, and open-source alternative to current weather apps. It relies primarily on the Open-Meteo API, requiring no personal data tracking. Optional tide information requires a free, user-provided Stormglass API key.',
    viewSource: 'View Source on GitHub',
    contactDeveloper: 'Contact Developer',
    appInstallation: 'App Installation',
    installBries: 'Install Bries to Home Screen',
    dailyForecast: 'Daily Forecast',
    language: 'Language',
    system: 'System Default'
  },
  de: {
    clearSky: 'Klarer Himmel',
    partlyCloudy: 'Leicht bewölkt',
    overcast: 'Bedeckt',
    fog: 'Nebel',
    drizzle: 'Nieselregen',
    rain: 'Regen',
    snow: 'Schnee',
    thunderstorm: 'Gewitter',
    clear: 'Klar',
    today: 'Heute',
    now: 'Jetzt',
    sunrise: 'Sonnenaufgang',
    sunset: 'Sonnenuntergang',
    highTide: 'Flut',
    lowTide: 'Ebbe',
    moreDetails: 'Mehr Details',
    hideDetails: 'Weniger Details',
    localTime: 'Ortszeit',
    updated: 'Aktualisiert',
    wind: 'Wind',
    high: 'Max',
    low: 'Min',
    todaysTides: 'Gezeiten Heute',
    station: 'Station',
    retrieved: 'Abgerufen',
    loading: 'Laden...',
    retry: 'Wiederholen',
    searchCity: 'Stadt suchen...',
    currentLocation: 'Aktueller Standort',
    cancel: 'Abbrechen',
    settings: 'Einstellungen',
    temperatureUnit: 'Temperatureinheit',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    windSpeedUnit: 'Windgeschwindigkeit',
    timelineEvents: 'Ereignisse',
    sunriseAndSunset: 'Sonnenauf- & untergang',
    moonPhase: 'Mondphase',
    tideEvents: 'Gezeiten',
    aboutBries: 'Über Bries',
    aboutText: 'Bries wurde entwickelt, um eine kostenlose, datenschutzfreundliche, werbefreie und Open-Source-Alternative zu aktuellen Wetter-Apps zu bieten. Es verwendet hauptsächlich die Open-Meteo-API und erfordert kein Tracking persönlicher Daten. Für optionale Gezeiteninformationen ist ein kostenloser, vom Benutzer bereitgestellter Stormglass-API-Schlüssel erforderlich.',
    viewSource: 'Quellcode auf GitHub',
    contactDeveloper: 'Entwickler kontaktieren',
    appInstallation: 'App-Installation',
    installBries: 'Bries installieren',
    dailyForecast: 'Tagesvorhersage',
    language: 'Sprache',
    system: 'Systemstandard'
  },
  fr: {
    clearSky: 'Ciel Dégagé',
    partlyCloudy: 'Partiellement Nuageux',
    overcast: 'Couvert',
    fog: 'Brouillard',
    drizzle: 'Bruine',
    rain: 'Pluie',
    snow: 'Neige',
    thunderstorm: 'Orage',
    clear: 'Dégagé',
    today: 'Aujourd\'hui',
    now: 'Maintenant',
    sunrise: 'Lever du Soleil',
    sunset: 'Coucher du Soleil',
    highTide: 'Marée Haute',
    lowTide: 'Marée Basse',
    moreDetails: 'Plus de Détails',
    hideDetails: 'Moins de Détails',
    localTime: 'Heure Locale',
    updated: 'Mis à jour',
    wind: 'Vent',
    high: 'Max',
    low: 'Min',
    todaysTides: 'Marées du Jour',
    station: 'Station',
    retrieved: 'Récupéré',
    loading: 'Chargement...',
    retry: 'Réessayer',
    searchCity: 'Rechercher une ville...',
    currentLocation: 'Position Actuelle',
    cancel: 'Annuler',
    settings: 'Paramètres',
    temperatureUnit: 'Unité de Température',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    windSpeedUnit: 'Vitesse du Vent',
    timelineEvents: 'Événements',
    sunriseAndSunset: 'Lever et Coucher du Soleil',
    moonPhase: 'Phase de la Lune',
    tideEvents: 'Marées',
    aboutBries: 'À propos de Bries',
    aboutText: 'Bries a été créé pour fournir une alternative gratuite, respectueuse de la vie privée, sans publicité et open-source aux applications météorologiques actuelles. Il s\'appuie principalement sur l\'API Open-Meteo, ne nécessitant aucun suivi des données personnelles. Les informations optionnelles sur les marées nécessitent une clé API Stormglass gratuite fournie par l\'utilisateur.',
    viewSource: 'Voir le code source sur GitHub',
    contactDeveloper: 'Contacter le développeur',
    appInstallation: 'Installation de l\'application',
    installBries: 'Installer Bries',
    dailyForecast: 'Prévisions Quotidiennes',
    language: 'Langue',
    system: 'Par défaut du système'
  },
  nl: {
    clearSky: 'Heldere Lucht',
    partlyCloudy: 'Gedeeltelijk Bewolkt',
    overcast: 'Bewolkt',
    fog: 'Mist',
    drizzle: 'Motregen',
    rain: 'Regen',
    snow: 'Sneeuw',
    thunderstorm: 'Onweer',
    clear: 'Helder',
    today: 'Vandaag',
    now: 'Nu',
    sunrise: 'Zonsopkomst',
    sunset: 'Zonsondergang',
    highTide: 'Hoogwater',
    lowTide: 'Laagwater',
    moreDetails: 'Meer Details',
    hideDetails: 'Minder Details',
    localTime: 'Lokale Tijd',
    updated: 'Bijgewerkt',
    wind: 'Wind',
    high: 'Max',
    low: 'Min',
    todaysTides: 'Getijden Vandaag',
    station: 'Station',
    retrieved: 'Opgehaald',
    loading: 'Laden...',
    retry: 'Opnieuw Proberen',
    searchCity: 'Zoek een stad...',
    currentLocation: 'Huidige Locatie',
    cancel: 'Annuleren',
    settings: 'Instellingen',
    temperatureUnit: 'Temperatuur Eenheid',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    windSpeedUnit: 'Windsnelheid',
    timelineEvents: 'Tijdlijn Gebeurtenissen',
    sunriseAndSunset: 'Zonsopkomst & -ondergang',
    moonPhase: 'Maanfase',
    tideEvents: 'Getijden',
    aboutBries: 'Over Bries',
    aboutText: 'Bries is gemaakt om een gratis, privacyvriendelijk, advertentievrij en open-source alternatief te bieden voor huidige weer-apps. Het maakt voornamelijk gebruik van de Open-Meteo API en vereist geen tracking van persoonlijke gegevens. Voor optionele getijdeninformatie is een gratis, door de gebruiker opgegeven Stormglass API-sleutel vereist.',
    viewSource: 'Bekijk broncode op GitHub',
    contactDeveloper: 'Contacteer Ontwikkelaar',
    appInstallation: 'App Installatie',
    installBries: 'Bries Installeren',
    dailyForecast: 'Dagelijkse Verwachting',
    language: 'Taal',
    system: 'Systeemtaal'
  }
};

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const LANGUAGE_KEY = '@app_language';

export const initI18n = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang) {
      i18n.locale = savedLang;
    } else {
      const deviceLanguage = getLocales()[0]?.languageCode;
      i18n.locale = deviceLanguage || 'en';
    }
  } catch (e) {
    const deviceLanguage = getLocales()[0]?.languageCode;
    i18n.locale = deviceLanguage || 'en';
  }
};

export const setLanguage = async (lang: string) => {
  if (lang === 'system') {
    const deviceLanguage = getLocales()[0]?.languageCode;
    i18n.locale = deviceLanguage || 'en';
    await AsyncStorage.removeItem(LANGUAGE_KEY);
  } else {
    i18n.locale = lang;
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }
};
