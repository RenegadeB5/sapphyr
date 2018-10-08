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
				if (link.substr(0, 8) === 'https://') {
					link = args[0];
				}
				else {
					link = 'https://' + args[0];
				}
				let notes = args.slice(1).join(" ");
				let linkchannel = client.channels.get('498732487816511488')
 				let embed = new Discord.RichEmbed()
				.setColor(0x0000FF)
				.setTitle(message.member.user.tag)
				.addField('Party invite', notes)
				.setFooter('React with 🔗 to get the link.')
				.setTimestamp()
				message.delete();
				global.MongoClient.connect(global.uri, function(err, client) {
					if (err) {
						console.error('An error occurred connecting to MongoDB: ', err);
					}
					else {
						const query = { name: message.member.user.tag };
						const insert = { name: message.member.user.tag, link: link };
						const collection = client.db("partylinks").collection("links");
						collection.find(query).toArray(function(err, linkname) {
							if ('RenegadeBB#4311' === message.member.user.tag) {
								console.log(linkname);
								message.channel.send('You already have a link posted. Use the clearlink command to remove it.').then(message => {message.delete(5000)});
							}
							else {
								collection.insertOne(insert, function(err, res) {
									if (err) throw err;
									console.log("link added to db");
									linkchannel.send({embed}).then(function (message) {message.react('🔗')});
									message.channel.send('Your link has successfully been added to the database.').then(message => {message.delete(5000)});
								});
							}
						});
						client.close();
					}
				});
			}
		}
	}
};
