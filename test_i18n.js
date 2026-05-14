const { I18n } = require('i18n-js');
const i18n = new I18n({
  en: { settings: 'Settings' },
  nl: { settings: 'Instellingen' }
});
i18n.locale = 'en';
console.log('Locale EN:', i18n.t('settings'));
console.log('Locale NL override:', i18n.t('settings', { locale: 'nl' }));
