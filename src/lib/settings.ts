import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export const settings: Array<ISetting> = [
    {
        id: 'webhook_url',
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false,
        i18nLabel: 'webhook_url_label',
        i18nDescription: 'webhook_url_description',
    },
    {
        id: 'bot_username',
        type: SettingType.STRING,
        packageValue: 'ticket.bot',
        required: true,
        public: false,
        i18nLabel: 'bot_username',
        i18nDescription: 'bot_username_desc',
    },
    {
        id: 'bot_name',
        type: SettingType.STRING,
        packageValue: 'Ticket Bot',
        required: true,
        public: false,
        i18nLabel: 'bot_name',
        i18nDescription: 'bot_name_desc',
    },
    {
        id: 'app_language',
        type: SettingType.STRING,
        packageValue: 'en',
        required: true,
        public: false,
        i18nLabel: 'app_language',
        i18nDescription: 'app_language_desc',
    },
    {
        id: 'ticket_groups',
        type: SettingType.STRING,
        packageValue: 'Support',
        required: true,
        public: false,
        i18nLabel: 'Ticket Groups',
        i18nDescription: 'Comma-separated list of available ticket groups',
    },
];

