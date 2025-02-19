import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage, IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { BlockBuilder } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ZammadTicketApp as appClass } from '../../ZammadTicketApp';

/**
 * Sends a message using bot
 */
export async function sendMessage({ app, modify, room, message, attachments, blocks, avatar, group }: {
    app: appClass,
    modify: IModify,
    room: IRoom,
    message?: string,
    attachments?: Array<IMessageAttachment>,
    blocks?: BlockBuilder,
    avatar?: string,
    group?: boolean,
}): Promise<string | undefined> {
    const msg = modify.getCreator().startMessage()
        .setGroupable(group || false)
        .setSender(app.botUser)
        .setUsernameAlias(app.botName)
        .setAvatarUrl(avatar || '/avatar/ticket.bot')
        .setRoom(room);

    if (message && message.length > 0) {
        msg.setText(message);
    }
    if (attachments && attachments.length > 0) {
        msg.setAttachments(attachments);
    }
    if (blocks !== undefined) {
        msg.setBlocks(blocks);
    }

    try {
        return await modify.getCreator().finish(msg);
    } catch (error) {
        app.getLogger().log(error);
        return;
    }
}

/**
 * Notifies user using bot
 */
export async function notifyUser({ app, message, user, room, modify, blocks, attachments }: {
    app: appClass,
    message: string,
    user: IUser,
    room: IRoom,
    modify: IModify,
    attachments?: Array<IMessageAttachment>,
    blocks?: BlockBuilder,
}): Promise<void> {
    const msg = modify.getCreator().startMessage()
        .setSender(app.botUser)
        .setUsernameAlias(app.botName)
        .setAvatarUrl('/avatar/ticket.bot')
        .setText(message)
        .setRoom(room);

    if (blocks !== undefined) {
        msg.setBlocks(blocks);
    }
    if (attachments && attachments.length > 0) {
        msg.setAttachments(attachments);
    }

    const finalMsg = msg.getMessage();

    try {
        await modify.getNotifier().notifyUser(user, finalMsg);
    } catch (error) {
        app.getLogger().log(error);
    }
}

/**
 * Truncate a string
 */
export function truncate(str: string, length: number): string {
    if (str.length > length) {
        return `${str.substring(0, length)}...`;
    }
    return str;
}

/**
 * Generate message link
 */
export async function generateMsgLink(app: appClass, message: IMessage): Promise<string> {
    const roomName = message.room.slugifiedName || message.room.id;
    const roomType = message.room.type === RoomType.DIRECT_MESSAGE ? 'direct' : 
                    message.room.type === RoomType.PRIVATE_GROUP ? 'group' : 'channel';
    return `${app.siteUrl}/${roomType}/${roomName}?msg=${message.id}`;
}

/**
 * Get room name
 */
export async function getRoomName(read: IRead, room: IRoom): Promise<string> {
    if (room.type === RoomType.DIRECT_MESSAGE) {
        return 'direct';
    }
    return room.displayName || room.slugifiedName || room.id;
}

/**
 * Format message in attachment
 */
export function formatMsgInAttachment(msg: string): string {
    if (!msg) return msg;
    return msg.replace(/<http(.*)\|(.*?)>/g, '[$2]($1)');
}
