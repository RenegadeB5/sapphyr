module.exports = {
	name: "Link sending service",
	description: "When a user reacts with \"🔗\", they will be sent a party link.",
	type: "event",
	on: {
		messageReactionAdd: async function (reaction) {
			if(reaction.emoji.name === '🔗' && reaction.message.channel.id === '451417402119421952') {
				if (reaction.users.map(r => r.id); === '407593823921766410') {
					return;
				}
				else {
					const dm = reaction.users.map(r => r.id);
					const dmsend = dm[dm.length-1];
					const log1 = reaction.users.map(r => r.username)
					const log2 = reaction.users.map(r => r.discriminator)
					const loguser = log1[log1.length-1] + '#' + log2[log2.length-1]
					const messageid = reaction.users.map(r => r.lastMessageID);
					global.MongoClient.connect(global.uri, function(err, client) {
						if (err) {
							console.error('An error occurred connecting to MongoDB: ', err);
						}
						else {
							const query = { link: loguser + ' ' + * };
							const collection = client.db("partylinks").collection("links");
							collection.find(query).toArray(function(err, result) {
								if (err) throw err;
								client.users.get(dmsend).send(result);
							});
							client.close();
						}
					}
				}
			}
		}
	}
};
