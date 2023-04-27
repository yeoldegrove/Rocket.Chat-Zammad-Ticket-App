export const br = {
    common: {
        confirm: 'Confirmar',
        cancel: 'Cancelar',
        close: 'Fechar',
    },
    date: {
        day: 'Dia',
        monday: 'Segunda',
        tuesday: 'Terça',
        wednesday: 'Quarta',
        thursday: 'Quinta',
        friday: 'Sexta',
        saturday: 'Sábado',
        sunday: 'Domingo',
    },
    reminder: {
        createModal: {
            heading: 'Criar Lembrete',
            ref_message_caption: (channel?: string) => `Você está criando um lembrete para a mensagem ${ channel ? ` do canal **#${channel}**` : '' }:`,
            ref_message_author: (author: string) => `**Autor**: ${author}`,
            ref_message_content: (content: string) => `**Mensagem**: ${content || 'Não foi possível exibir a mensagem...'}`,
            when: 'Lembrar em',
            time: 'Horário',
            repeat: 'Repetir',
            repeat_options: {
                once: 'Não repetir',
                daily: 'Diariamente',
                weekly: 'Semanalmente',
                biweekly: 'Bissemanalmente (2 semanas)',
                weekdays: 'Dias de Trabalho (Seg. a Sex.)',
                weekdays_pure: 'Dias de Trabalho',
                monthly: 'Mensalmente',
            },
            message: 'Mensagem',
            message_placeholder: 'Olá querido, já se hidratou hoje? :cup_with_straw: :cup_with_straw: ',
            remind_to: 'Lembrar',
            target_type: 'Canal ou usuários',
            target_type_options: {
                self: 'Você mesmo',
                user: 'Outros usuários',
                channel: 'Canal',
            },
            target_user: (max: number) => `Destinatários (Max: ${max} usuários)`,
            target_user_placeholder: (max: number) => `Max ${max} usuários`,
            target_channel: 'Canal',
            target_channel_placeholder: 'Nome do Canal',
            create_success: 'Lembrete criado com sucesso! :tada: Agora é só esperar pelo lembrete.',
        },

        listModal: {
            heading: 'Listar lembretes',
            caption_active: (count: number, paused: number) => `Você tem um total de **${count}** lembrete(s) ativo(s)${paused ? ` e **${paused}** lembrete(s) pausado(s)` : ''}.`,
            caption_finished: (count: number) => `Você tem **${count}** lembrete(s) já realizado(s).`,
            no_reminders: 'Crie um novo lembrete digitando `/cukoo-remind`',
            list_active: ':fire: **Lembretes Ativos:**',
            list_paused: ':pause_button: **Lembretes pausados:**',
            list_finished: ':white_check_mark: **Lembretes Concluidos:**',
            view_finished: 'Visualizar lembretes concluidos',
            view_active: 'Visualizar lembretes ativos',
        },

        jobBlock: {
            title_once: (time: string, target?: string) => `:small_blue_diamond: Lembrar ${target ? target : 'me'} em *${time}*`,
            title_repeat: (time: string, repeat: string, target?: string) => `:small_orange_diamond: Lembrar ${target ? target : 'me'} em *${time}* (${repeat})`,
            next_run_at: (time: string) => `Próximo lembrete em: *${time}*`,
            message: 'Mensagem',
            button_pause: 'Pausar',
            button_resume: ':arrow_forward: Continuar',
            button_cancel: 'Cancelar',
            button_remove: 'Remover',
        },

        message: {
            caption_self: ':rotating_light: Você pediu para eu te lembrar',
            caption_user: (owner: string) => `:rotating_light: @${owner} pediu para eu te lembrar`,
            caption_channel: (owner: string) => `:rotating_light: @${owner} pediu para eu avisar esse canal`,
            caption_ref_msg: (msgLink: string, channel?: string) => ` sobre a mensagem${channel ? ` do #${channel}` : ''}`,
            title_ref_msg: (time: string, channel?: string) => `Mensagem${channel ? ` no #${channel}` : ''} enviada em ${time}`,
        },

        messageAction: {
            caption: '- Criar lembrete: `/cukoo-remind create`\n- Visualizar lista de lembretes: `/cukoo-remind list` \n\n Você também pode criar um lembrete para citar uma mensagem, clicando no botão `⏰ Criar lembrete` no menu de ação ao lado de uma mensagem.',
            button_create: 'Criar lembrete',
            button_list: 'Visualizar lista de lembretes',
        },
    },
};
