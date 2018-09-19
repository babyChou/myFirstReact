import * as i18next from 'i18next';
import { reactI18nextModule } from 'react-i18next';

import enSource from './locales/en';
import zhSource from './locales/zh_tw';
import zhSourceCn from './locales/zh_cn';

const i18n = i18next.use(reactI18nextModule).init(
    {
        fallbackLng: 'en',
        debug: false,
        ns: ['translations'],
        defaultNS: 'translations',
        resources: {
            en: {
                translation: enSource
            },
            zh_tw: {
                translation: zhSource
            },
            zh_cn: {
                translation: zhSourceCn
            }
        },
        keySeparator: false,
        interpolation: {
            escapeValue: false,
            formatSeparator: ','
        },
        react: {
            wait: false
        }
    },
    err => {
        if (err) {
            console.error('i18next', err);
        }
    }
);

export default i18n;
