export const de = {
    common: {
        confirm: 'Bestätigen',
        cancel: 'Abbrechen',
        close: 'Schließen',
    },
    date: {
        day: 'Tag',
        monday: 'Montag',
        tuesday: 'Dienstag',
        wednesday: 'Mittwoch',
        thursday: 'Donnerstag',
        friday: 'Freitag',
        saturday: 'Samstag',
        sunday: 'Sonntag',
    },
    ticket: {
        createModal: {
            heading: 'Ticket erstellen',
            title: 'Titel',
            title_placeholder: 'Geben Sie einen kurzen Titel ein (max. 80 Zeichen)',
            message: 'Beschreibung',
            message_placeholder: 'Geben Sie die Ticketbeschreibung ein',
            group: 'Gruppe',
            group_placeholder: 'Wählen Sie eine Ticketgruppe',
            ref_message_caption: (channel?: string) => `Referenzierte Nachricht aus ${channel || 'unbekanntem Kanal'}`,
            ref_message_author: (username?: string) => `Autor: ${username}`,
            ref_message_content: (content?: string) => `Inhalt: ${content}`,
            create_success: (ticket: any) => `Ticket ${ticket.url} wurde erfolgreich erstellt!`,
            channel_prefix: (channel?: string) => `Kanal: ${channel}`,
        },
        messageAction: {
            caption: 'Was möchten Sie tun?',
            button_create: 'Ticket erstellen',
        },
    },
};
