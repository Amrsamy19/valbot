import ValClient from '../ValClient';

import { Command, CommandContext } from '../structures';
import { log, notify } from '../utils/general';
import { createClearEmbed } from '../utils/embed';

export default class Clear extends Command {
	/**
	 * Constructs help command
	 * @param {ValClient} client
	 */
	constructor(client: ValClient) {
		super(client, {
			name: `clear`,
			category: 'Moderation',
			cooldown: 1000,
			nOfParams: 1,
			description: `بتمسح رسايل بعدد n`,
			exampleUsage: `5`,
			extraParams: false,
			optionalParams: 0,
			auth: {
				method: 'ROLE',
				required: 'AUTH_MOD'
			}
		});
	}

	_run = async (context: CommandContext) => {
		const { CHANNEL_MOD_LOGS } = this.client.config.CHANNELS;
		const { message, member, params, channel } = context;

		const count = parseInt(params[0]);
		const errors = this.isInputValid(count);

		if (errors) {
			await message.reply(errors);
			return;
		}

		const embed = createClearEmbed({
			moderator: member.id,
			channel: channel.id,
			count
		});

		try {
			await channel.bulkDelete(count + 1);

			const sent = await message.reply(`مسحت ${count} يرايق.`);

			setTimeout(() => {
				sent.delete();
			}, 3 * 1000);

			await notify({
				client: this.client,
				notification: '',
				embed,
				channel: CHANNEL_MOD_LOGS
			});
		} catch (err) {
			log(this.client, err, 'error');
		}
	};

	isInputValid = (count: number) => {
		if (isNaN(count)) return 'لازم تدخل رقم';
		else if (count === 0) return 'هنهزر ولا ايه؟';
		else return undefined;
	};
}
