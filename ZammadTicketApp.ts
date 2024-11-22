import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

import { Ticket } from "./src/classes/Ticket";
import { settings } from "./src/lib/settings";
import {
    IUIKitResponse,
    UIKitActionButtonInteractionContext,
    UIKitBlockInteractionContext,
    UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { ExecuteBlockAction } from "./src/classes/ExecuteBlockAction";
import { ExecuteViewSubmit } from "./src/classes/ExecuteViewSubmit";
import { UIActionButtonContext } from "@rocket.chat/apps-engine/definition/ui";
import { ExecuteActionButton } from "./src/classes/ExecuteActionButton";

export class ZammadTicketApp extends App {
    public webhookUrl: string;
    public botUsername: string;
    public botUser: IUser;
    public botName: string;
    public siteUrl: string;
    public appLanguage: string;
    public ticketGroups: string;
    public ticket: Ticket;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    /**
     * Execute when an action is triggered
     */
    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify
    ) {
        try {
            const handler = new ExecuteBlockAction(this, modify, read, persis);
            return await handler.run(context);
        } catch (err) {
            this.getLogger().log(`${err.message}`);
            return context.getInteractionResponder().errorResponse();
        }
    }

    /**
     * Execute when an action button is clicked
     */
    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        try {
            const handler = new ExecuteActionButton(this, modify, read);
            await handler.run(context);
        } catch (err) {
            this.getLogger().log(`${err.message}`);
            return context.getInteractionResponder().errorResponse();
        }

        return context.getInteractionResponder().successResponse();
    }

    /**
     * Execute when a form is submitted
     */
    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify
    ) {
        try {
            const handler = new ExecuteViewSubmit(this, modify, read, persis, http);
            return await handler.run(context);
        } catch (err) {
            this.getLogger().log(`${err.message}`);
            return context.getInteractionResponder().errorResponse();
        }
    }

    public async onEnable(
        environment: IEnvironmentRead,
        configurationModify: IConfigurationModify
    ): Promise<boolean> {
        this.siteUrl = (
            await environment.getServerSettings().getValueById("Site_Url")
        ).replace(/\/$/, "");
        
        this.ticket = new Ticket(this);

        this.webhookUrl = await environment
            .getSettings()
            .getValueById("webhook_url");

        this.botUsername = await environment
            .getSettings()
            .getValueById("bot_username");
        if (!this.botUsername) {
            return false;
        }
        this.botUser = (await this.getAccessors()
            .reader.getUserReader()
            .getByUsername(this.botUsername)) as IUser;

        this.botName = await environment.getSettings().getValueById("bot_name");

        this.appLanguage = await environment
            .getSettings()
            .getValueById("app_language");

        this.ticketGroups = await environment
            .getSettings()
            .getValueById("ticket_groups");

        return true;
    }

    /**
     * Update values when settings are updated
     */
    public async onSettingUpdated(
        setting: ISetting,
        configModify: IConfigurationModify,
        read: IRead,
        http: IHttp
    ): Promise<void> {
        switch (setting.id) {
            case "webhook_url":
                this.webhookUrl = setting.value;
                break;
            case "bot_username":
                this.botUsername = setting.value;
                if (this.botUsername) {
                    this.botUser = (await read
                        .getUserReader()
                        .getByUsername(this.botUsername)) as IUser;
                }
                break;
            case "bot_name":
                this.botName = setting.value;
                break;
            case "app_language":
                this.appLanguage = setting.value;
                break;
            case "ticket_groups":
                this.ticketGroups = setting.value;
                break;
        }

        return;
    }

    public async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        // Settings
        await Promise.all(
            settings.map((setting) =>
                configuration.settings.provideSetting(setting)
            )
        );

        // Register UI buttons
        configuration.ui.registerButton({
            actionId: "ticket-trigger-message",
            labelI18n: "ticket-trigger-message-label",
            context: UIActionButtonContext.MESSAGE_ACTION,
        });
    }
}

