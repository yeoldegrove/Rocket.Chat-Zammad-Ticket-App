import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage, IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';

import { ZammadTicketApp as AppClass } from '../../ZammadTicketApp';
import { Lang } from '../lang/index';
import { AppConfig } from '../lib/config';
import { formatMsgInAttachment, generateMsgLink, getRoomName, sendMessage, truncate } from '../lib/helpers';

export async function TicketMessage({ app, owner, message, read, modify, room, refMsg }: {
    app: AppClass;
    owner: IUser;
    message: string;
    read: IRead;
    modify: IModify;
    room: IRoom;
    refMsg?: IMessage;
}) {
    const { lang } = new Lang(app.appLanguage);

    let refMsgAttachment: IMessageAttachment | null = null;
    if (refMsg) {
        const msgLink = await generateMsgLink(app, refMsg);
        const roomName = await getRoomName(read, refMsg.room);
        const msgAvatar = refMsg.avatarUrl
            ? `${app.siteUrl}${refMsg.avatarUrl}`
            : `${app.siteUrl}/avatar/${refMsg.sender.username}`;

        const msgTextFormat = formatMsgInAttachment(refMsg.text || '');

        refMsgAttachment = {
            color: AppConfig.attachmentColor,
            text: msgTextFormat,
            title: {
                link: msgLink,
                value: lang.ticket.createModal.ref_message_caption(roomName),
            },
            author: {
                name: refMsg.sender.username,
                icon: msgAvatar,
            },
        };
    }

    // Send message to activity room
    const msg = await sendMessage({
        app,
        modify,
        room,
        message: message,
        attachments: refMsgAttachment ? [refMsgAttachment] : [],
        group: true,
    });

    return msg;
}

export async function getTicketActionsBlocks({ app, read, modify, room, user, message }: {
    app: AppClass;
    read: IRead;
    modify: IModify;
    room: IRoom;
    user: IUser;
    message: IMessage;
}) {
    const { lang } = new Lang(app.appLanguage);
    const block = modify.getCreator().getBlockBuilder();

    block.addSectionBlock({
        text: block.newMarkdownTextObject(lang.ticket.messageAction.caption),
    });

    block.addActionsBlock({
        elements: [
            block.newButtonElement({
                text: block.newPlainTextObject(lang.ticket.messageAction.button_create),
                value: 'create',
                actionId: 'ticket-trigger-message',
                style: ButtonStyle.PRIMARY,
            }),
        ],
    });

    return block;
}
