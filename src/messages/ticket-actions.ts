import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { BlockBuilder, ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";

import { ZammadTicketApp as AppClass } from "../../ZammadTicketApp";
import { Lang } from "../lang/index";

export async function TicketActionsMessage({ app, block }: {
    app: AppClass;
    block: BlockBuilder;
}) {
    const { lang } = new Lang(app.appLanguage);

    block.addSectionBlock({
        text: block.newMarkdownTextObject(lang.ticket.messageAction.caption),
    });

    block.addActionsBlock({
        elements: [
            block.newButtonElement({
                text: block.newPlainTextObject(lang.ticket.messageAction.button_create),
                actionId: 'ticket-create',
                style: ButtonStyle.PRIMARY,
            }),
        ],
    });
}
