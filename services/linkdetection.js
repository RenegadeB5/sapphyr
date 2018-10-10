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
			function clearLink () {
				global.MongoClient.connect(global.uri, function(err, client) {
					if (err) {
						console.error('An error occurred connecting to MongoDB: ', err);
					}
					else {
						const collection = client.db("partylinks").collection("links");
						collection.find({}).toArray(function(err, result) {
							if (err) throw err;
							const collection = client.db("partylinks").collection("links");
							const query = { name: result[result.length-1].link }
							collection.deleteOne(query, function(err, obj) {
								if (err) throw err;
  								console.log("1 link cleared");
							});
						});
						client.close();
					}
				});
			}
			let notes = message.content.split(" ");
			let args = notes.slice(0);
			if (message.author.bot) return;
			if (message.channel.type === "dm") return;
			if (diepregex.test(args[0])) {
				let link = args[0];
				if (link.substr(0, 8) !== 'https://') {
					link = 'https://' + args[0];
				}
				let notes = args.slice(1).join(" ");
				if (notes.length < 1) {
					notes = 'No informtion provided.'
				}
				let linkchannel = client.channels.get('498736242905710592')
 				let embed = new Discord.RichEmbed()
				.setColor(0x0000FF)
				.setTitle(message.member.user.tag)
				.addField('Party invite', notes)
				.setFooter('React with 🔗 to get the link.')
				.setTimestamp()
				global.MongoClient.connect(global.uri, function(err, client) {
					if (err) {
						console.error('An error occurred connecting to MongoDB: ', err);
					}
					else {
						const insert = { name: message.member.user.tag, link: link };
						const collection = client.db("partylinks").collection("links");
						collection.insertOne(insert, function(err, res) {
							if (err) throw err;
							message.delete();
							console.log("link added to db");
							linkchannel.send({embed}).then(function (message) {message.react('🔗')});
							message.channel.send('Your link has successfully been posted.').then(message => {message.delete(5000)});
							setInterval(clearLink, 10000);
						});
						client.close();
					}
				});
			}
		}
	}
};
