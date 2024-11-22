import { IModify, IRead, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUIKitModalResponse, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { ticketCreate } from '../modals/ticketCreate';
import { ZammadTicketApp as AppClass } from '../../ZammadTicketApp';

export class ExecuteBlockAction {
    constructor(
        private readonly app: AppClass,
        private readonly modify: IModify,
        private readonly read: IRead,
        private readonly persis: IPersistence,
    ) {}

    public async run(context: UIKitBlockInteractionContext): Promise<IUIKitModalResponse | Record<string, any>> {
        const data = context.getInteractionData();
        const { user, actionId, container } = data;

        let roomId;
        if (container.id.startsWith('modal-ticket-create')) {
            roomId = container.id.split('--')[1];
        }

        const room = await this.read.getRoomReader().getById(roomId);

        if (actionId === 'ticket-create') {
            const modal = await ticketCreate({
                app: this.app,
                room: room as IRoom,
                user,
                read: this.read,
                modify: this.modify,
            });

            return context.getInteractionResponder().updateModalViewResponse(modal);
        }

        return {
            success: true,
            user: data.user.username,
            action: data.actionId,
            value: data.value,
            triggerId: data.triggerId,
        };
    }
}
