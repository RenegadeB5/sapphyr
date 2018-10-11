var Discord = require('discord.js');
module.exports = {
	name: "Link sending service",
	description: "When a user reacts with \"🔗\", they will be sent a party link.",
	type: "event",
	on: {
		messageReactionAdd: async function (reaction) {
			if(reaction.emoji.name === '🔗' && reaction.message.channel.id === '498736242905710592') {
				const dm = reaction.users.map(r => r.id);
				const dmsend = dm[dm.length-1];
				const name = reaction.users.map(r => r.username)
				const discrim = reaction.users.map(r => r.discriminator)
				const user = name[name.length-1] + '#' + discrim[discrim.length-1]
				const messageid = reaction.users.map(r => r.lastMessageID);
				const list = reaction.message.embeds.map(r => r.fields.map(r => r.value))[0]
				const members = list[1, list.length-1]
				if (dmsend === '407593823921766410') return;
				global.MongoClient.connect(global.uri, function(err, client) {
					if (err) {
						console.error('An error occurred connecting to MongoDB: ', err);
					}
					else {
						const query = { name: user };
						const collection = client.db("partylinks").collection("links");
						collection.find(query).toArray(function(err, result) {
							if ((result[result.length-1].link).length === 0) {
								global.client.users.get(dmsend).send('Sorry, this invite link is no longer avalable.');
								reaction.message.delete();
							}
							else {
								global.client.users.get(dmsend).send(result[result.length-1].link);
								let embed = new Discord.RichEmbed()
								.setColor(0x0000FF)
								.setTitle(user)
								.addField('Party invite', result[result.length-1].notes)
								.addField('Members', members + '\n' + user)
								.setFooter('React with 🔗 to get the link.')
								reaction.message.edit({embed});  
							}
						});
						client.close();
					}
				});
			}
		}
	}
};
