import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';

import { ZammadTicketApp as AppClass } from '../../ZammadTicketApp';
import { Lang } from '../lang/index';
import { truncate, getRoomName, generateMsgLink } from '../lib/helpers';

const MAX_MESSAGE_LENGTH = 10000;

export async function ticketCreate({ app, room, user, read, modify, refMessage }: {
    app: AppClass;
    room: IRoom;
    user: IUser;
    read: IRead;
    modify: IModify;
    refMessage?: IMessage;
}): Promise<IUIKitModalViewParam> {
    const { lang } = new Lang(app.appLanguage);
    const block = modify.getCreator().getBlockBuilder();

    // Display ref message
    if (refMessage) {
        const roomName = await getRoomName(read, refMessage.room);

        block
            .addSectionBlock({
                text: block.newMarkdownTextObject(
                    lang.ticket.createModal.ref_message_caption(truncate(roomName, 40))
                ),
            })
            .addContextBlock({
                elements: [
                    block.newMarkdownTextObject(`
                    ${lang.ticket.createModal.ref_message_author(refMessage.sender.username)}
                    ${lang.ticket.createModal.ref_message_content(truncate(refMessage.text || '', 100))}`),
                ]
            })
            .addDividerBlock();
    }

    // Add group selection first
    const groups = app.ticketGroups.split(',').map(g => g.trim());
    block.addInputBlock({
        blockId: 'ticketData',
        optional: false,
        label: block.newPlainTextObject(lang.ticket.createModal.group),
        element: block.newStaticSelectElement({
            placeholder: block.newPlainTextObject(lang.ticket.createModal.group_placeholder),
            actionId: 'group',
            initialValue: groups[0],
            options: groups.map((group) => ({
                text: block.newPlainTextObject(group),
                value: group,
            })),
        }),
    });

    // Then add title input
    const initialTitle = refMessage ? truncate(refMessage.text?.split('\n')[0] || '', 80) : '';
    block.addInputBlock({
        blockId: 'ticketData',
        optional: false,
        label: block.newPlainTextObject(lang.ticket.createModal.title),
        element: block.newPlainTextInputElement({
            actionId: 'title',
            placeholder: block.newPlainTextObject(lang.ticket.createModal.title_placeholder),
            initialValue: initialTitle,
        }),
    });

    // Add message input
    let initialMessage = '';
    if (refMessage) {
        const msgLink = await generateMsgLink(app, refMessage);
        const messageText = (refMessage.text || '')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');
        
        initialMessage = `Rocket.Chat: ${msgLink}\n\n${messageText}`;
    }

    if (initialMessage.length > MAX_MESSAGE_LENGTH) {
        initialMessage = initialMessage.substring(0, MAX_MESSAGE_LENGTH);
    }

    block.addInputBlock({
        blockId: 'ticketData',
        label: block.newPlainTextObject(lang.ticket.createModal.message),
        element: block.newPlainTextInputElement({
            actionId: 'message',
            placeholder: block.newPlainTextObject(lang.ticket.createModal.message_placeholder),
            multiline: true,
            initialValue: initialMessage,
        }),
    });

    return {
        id: `modal-ticket-create--${room.id}${refMessage ? `--${refMessage.id}` : ''}`,
        title: block.newPlainTextObject(lang.ticket.createModal.heading),
        submit: block.newButtonElement({
            text: block.newPlainTextObject(lang.common.confirm),
            style: ButtonStyle.PRIMARY,
        }),
        close: block.newButtonElement({
            text: block.newPlainTextObject(lang.common.cancel),
        }),
        blocks: block.getBlocks(),
    };
}

