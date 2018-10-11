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
				if (dmsend === '407593823921766410') return;
				const name = reaction.users.map(r => r.username)
				const discrim = reaction.users.map(r => r.discriminator)
				const user = name[name.length-1] + '#' + discrim[discrim.length-1]
				const messageid = reaction.users.map(r => r.lastMessageID);
				reaction.message.embeds.forEach((embed) => {console.log(embed.fields(r => r.value))});
				global.MongoClient.connect(global.uri, function(err, client) {
					if (err) {
						console.error('An error occurred connecting to MongoDB: ', err);
					}
					else {
						const query = { name: user };
						const collection = client.db("partylinks").collection("links");
						collection.find(query).toArray(function(err, result) {
							global.client.users.get(dmsend).send(result[result.length-1].link);
							let embed = new Discord.RichEmbed()
							.setColor(0x0000FF)
							.setTitle(user)
							.addField('Party invite', result[result.length-1].notes)
							.setFooter('React with 🔗 to get the link.')
							reaction.message.channel.fetchMessage(messageid).then(message =>message.edit({embed}));        
						});
						client.close();
					}
				});
			}
		}
	}
};
