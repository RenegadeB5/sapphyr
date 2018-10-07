module.exports = {
	name: "Link sending service",
	description: "When a user reacts with \"🔗\", they will be sent a party link.",
	type: "event",
	on: {
		messageReactionAdd: async function (reaction) {
			if(reaction.emoji.name === '🔗' && reaction.message.channel.id === '451417402119421952') {
				const dm = reaction.users.map(r => r.id);
				const dmsend = dm[dm.length-1];
				client.users.get(dmsend).send('link');
		}
	}
};
