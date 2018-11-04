var fs = require("fs");
var regex = require("/app/links.json");
var diepregex = RegExp(regex.diep);
var Discord = require('discord.js');
var dataHandler = new global.utils.datahandler();
module.exports = {
	name: "Link detection service",
	description: "Creates an embed for party invites.",
	type: "event",
	on: {
		message: async function (message) {
			let notes = message.content.split(" ");
			let args = notes.slice(0);
			if (message.author.bot) return;
			if (diepregex.test(args[0])) {
				function clearLink () {
  					console.log("1 link cleared");
					new dataHandler().remove1Link();
				}
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
				.addField('Members', message.member.user.tag)
				.setFooter('React with 🔗 to recieve the link, \nReact with ☠ if the link is invalid, \n And react with ⚠ if there is a troller present. \n Be aware that false alarms are punishable.')
				const insert = { name: message.member.user.tag, notes: notes, link: link };
				new dataHandler().insertLink(insert);
				message.delete();
				console.log("link added to db");
				linkchannel.send({embed}).then(function (message) {message.react('🔗')});
				message.channel.send('Your link has successfully been posted.').then(message => {message.delete(5000)});
				setTimeout(clearLink, 3600000);
			}
		}
	}
};
