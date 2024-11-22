export const en = {
    common: {
        confirm: 'Confirm',
        cancel: 'Cancel',
        close: 'Close',
    },
    date: {
        day: 'Day',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
    },
    ticket: {
        createModal: {
            heading: 'Create Ticket',
            title: 'Title',
            title_placeholder: 'Enter a brief title (max 80 characters)',
            message: 'Description',
            message_placeholder: 'Enter ticket description',
            group: 'Group',
            group_placeholder: 'Select ticket group',
            ref_message_caption: (channel?: string) => `Referenced message from ${channel || 'unknown channel'}`,
            ref_message_author: (username?: string) => `Author: ${username}`,
            ref_message_content: (content?: string) => `Content: ${content}`,
            create_success: (ticket: any) => `Ticket ${ticket.url} created successfully!`,
            channel_prefix: (channel?: string) => `Channel: ${channel}`,
        },
        messageAction: {
            caption: 'What would you like to do?',
            button_create: 'Create Ticket',
        },
    },
};
