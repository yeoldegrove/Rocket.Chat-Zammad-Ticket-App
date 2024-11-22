import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { UIKitActionButtonInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';

import { ZammadTicketApp as AppClass } from '../../ZammadTicketApp';
import { openCreateModal } from '../lib/createModal';

export class ExecuteActionButton {
    constructor(
        private readonly app: AppClass,
        private readonly modify: IModify,
        private readonly read: IRead,
    ) {}

    public async run(context: UIKitActionButtonInteractionContext): Promise<void> {
        const { room, user, actionId, triggerId } = context.getInteractionData();

        if (actionId === 'ticket-trigger-message') {
            const { message } = context.getInteractionData();

            await openCreateModal({
                app: this.app,
                user,
                room,
                read: this.read,
                modify: this.modify,
                triggerId,
                refMessage: message,
            });
        }
    }
}
