var fs = require("fs");
var regex = require("/app/links.json");
var diepregex = RegExp(regex.diep);
var Discord = require('discord.js');
module.exports = {
	name: "Link detection service",
	description: "Creates an embed for party invites.",
	type: "event",
	on: {
		message: async function (message) {
			let notes = message.content.split(" ");
			let args = notes.slice(0);
			if (message.author.bot) return;
			if (message.channel.type === "dm") return;
			if (diepregex.test(args[0])) {
				let link = args[0];
				let notes = args.slice(1).join(" ");
				let linkchannel = client.channels.get('451417402119421952')
 				let embed = new Discord.RichEmbed()
				.setColor(0x0000FF)
				.setTitle(message.member.user.tag)
				.addField('Party invite', notes)
				.setFooter('React with 🔗 to get the link.')
				.setTimestamp()
				message.delete();
				linkchannel.send({embed}).then(function (message) {message.react('🔗')});
				global.MongoClient.connect(global.uri, function(err, client) {
					if (err) {
						console.error('An error occurred connecting to MongoDB: ', err);
					}
					else {
						const insert = { name: message.member.user.tag, link: link };
						const collection = client.db("partylinks").collection("links");
						collection.insertOne(insert, function(err, res) {
							if (err) throw err;
							console.log("link added to db");
						});
						client.close();
					}
				});
			}
		}
	}
};
