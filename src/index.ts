import ValClient from './ValClient';

// failsafe
if (!process.env.MODE) {
	process.env.MODE = 'DEVELOPMENT';
}

const client: ValClient = new ValClient({
	fetchAllMembers: true,
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.init(process.env.AUTH_TOKEN);
client.on('error', (err: Error) => {
	console.log('An error occured with ValClient', err);
	process.exit(1);
});
