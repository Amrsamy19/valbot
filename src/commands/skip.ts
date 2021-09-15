import { MusicController } from "../controllers";
import { Command, CommandContext } from "../structures";
import { createEmbed } from "../utils/embed";
import { log } from "../utils/general";
import ValClient from "../ValClient";

export default class Skip extends Command {
	constructor(client: ValClient) {
		super(client, {
			name: "skip",
			category: "Music",
			cooldown: 5 * 1000,
			nOfParams: 0,
			description: "عجلة قدام ياسطا",
			exampleUsage: "-",
			extraParams: false,
			optionalParams: 0,
			auth: {
				method: "ٌROLE",
				required: "AUTH_EVERYONE",
			},
		});
	}

	_run = async ({ member, message, params }: CommandContext) => {
		try {
			const controller = this.client.controllers.get(
				"music",
			) as MusicController;
			const voiceChannel = member.voice.channel;

			if (!voiceChannel) {
				await message.reply(
					createEmbed({
						description: `You're not connected to a voice channel`,
					}),
				);
				return;
			}

			// Extras
			if (params.length > 1) {
				await message.reply(
					createEmbed({
						description: `Skip doesn't take arguments but it is ok`,
					}),
				);
			}

			if (!controller.canUserPlay(voiceChannel)) {
				await message.reply(
					createEmbed({
						description: "You must be in the same channel as the bot",
					}),
				);
				return;
			}

			if (this.client.voice.connections.size === 0) {
				await message.reply(
					createEmbed({
						description: "Bot is not the channel.",
					}),
				);
			}

			const hasMore = await controller.jump("skip");
			if (hasMore) {
				await message.reply(
					createEmbed({
						description: hasMore,
					}),
				);
			}
		} catch (err) {
			log(this.client, err, "error");
		}
	};
}
