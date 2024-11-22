import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUIKitErrorResponse, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";

import { ZammadTicketApp as AppClass } from "../../ZammadTicketApp";
import { ITicketFormData } from '../interfaces/ITicket';

export class ExecuteViewSubmit {
    constructor(
        private readonly app: AppClass,
        private readonly modify: IModify,
        private readonly read: IRead,
        private readonly persis: IPersistence,
        private readonly http: IHttp,
    ) {}

    public async run(context: UIKitViewSubmitInteractionContext): Promise<IUIKitErrorResponse | Record<string, any>> {
        const data = context.getInteractionData();
        const { state, id } = data.view;

        if (id.startsWith('modal-ticket-create')) {
            const [modalName, roomId, ...refMsgId] = id.split('--');
            const room = await this.read.getRoomReader().getById(roomId);

            const { ticketData } = state as Record<'ticketData', ITicketFormData>;

            try {
                await this.app.ticket.create({
                    formData: ticketData,
                    room: room as IRoom,
                    user: data.user,
                    read: this.read,
                    modify: this.modify,
                    persis: this.persis,
                    refMsgId: refMsgId[0],
                    http: this.http,
                });
            } catch (err) {
                return context.getInteractionResponder().viewErrorResponse({
                    viewId: id,
                    errors: err,
                });
            }
        }

        return {
            success: true,
            state,
            user: data.user.username,
        };
    }
}

