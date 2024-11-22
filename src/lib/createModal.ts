import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { ZammadTicketApp as AppClass } from '../../ZammadTicketApp';
import { ticketCreate } from '../modals/ticketCreate';

export async function openCreateModal({ app, user, room, read, modify, triggerId, refMessage }: {
    app: AppClass;
    user: IUser;
    room: IRoom;
    read: IRead;
    modify: IModify;
    triggerId: string;
    refMessage?: IMessage;
}): Promise<void> {
    const modal = await ticketCreate({
        app,
        room,
        user,
        read,
        modify,
        refMessage,
    });

    await modify.getUiController().openModalView(modal, { triggerId }, user);
} 