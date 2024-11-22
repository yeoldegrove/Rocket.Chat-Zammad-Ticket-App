import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ZammadTicketApp } from '../../ZammadTicketApp';
import { ITicketFormData } from '../interfaces/ITicket';
import { Lang } from '../lang/index';
import { notifyUser } from '../lib/helpers';

const MAX_MESSAGE_LENGTH = 10000;

interface ITicketResponse {
    ticket: {
        id: number;
        url: string;
    };
}

export class Ticket {
    constructor(private readonly app: ZammadTicketApp) {}

    public async create({ formData, room, read, modify, persis, user, refMsgId, http }: {
        formData: ITicketFormData,
        room: IRoom,
        read: IRead;
        modify: IModify;
        persis: IPersistence,
        user: IUser,
        refMsgId?: string,
        http: IHttp,
    }) {
        const { lang } = new Lang(this.app.appLanguage);

        // Validate form data
        const validation = this.formValidation({ formData });

        if (validation !== true) {
            throw validation;
        }

        // Prepare the data to send to the webhook
        const webhookData = {
            formData,
            user: {
                id: user.id,
                username: user.username,
                email: user.emails[0].address,
                name: user.name,
            },
            refMsgId,
            room: {
                id: room.id,
                name: room.displayName || room.slugifiedName,
                type: room.type,
            }
        };

        // Send data to webhook URL
        try {
            const response = await http.post(this.app.webhookUrl, {
                data: webhookData,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.statusCode >= 400) {
                throw new Error(`Webhook returned status code ${response.statusCode}`);
            }

            const ticketResponse = response.data as ITicketResponse;
            if (!ticketResponse || !ticketResponse.ticket) {
                throw new Error('Invalid response format from webhook');
            }

            const ticketUrl = ticketResponse.ticket.url;

            // Notify user that the ticket was created successfully
            await notifyUser({
                app: this.app,
                message: lang.ticket.createModal.create_success({ url: ticketUrl }),
                user,
                room,
                modify,
            });
        } catch (error) {
            // Notify user of the failure
            await notifyUser({
                app: this.app,
                message: `Failed to create ticket: ${error.message}`,
                room,
                user,
                modify,
            });
            throw error;
        }
    }

    private formValidation({ formData }: {
        formData: ITicketFormData;
    }): Record<string, string> | true {
        const { title, message, group } = formData;

        // Check if title is empty
        if (!title) {
            return { title: 'Title cannot be empty' };
        }

        // Check if message is empty
        if (!message) {
            return { message: 'Message cannot be empty' };
        }

        // Check message length
        if (message.length > MAX_MESSAGE_LENGTH) {
            return { message: `Message cannot be longer than ${MAX_MESSAGE_LENGTH} characters` };
        }

        // Check if group is empty
        if (!group) {
            return { group: 'Group must be selected' };
        }

        return true;
    }
}

