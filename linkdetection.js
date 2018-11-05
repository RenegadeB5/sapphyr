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
			if (diepregex.test(args[0])) {
				function clearLink () {
					global.client.datahandler.remove1Link();
				}
				let link = args[0];
				if (link.substr(0, 8) !== 'https://') {
					link = 'https://' + args[0];
				}
				let notes = args.slice(1).join(" ");
				if (notes.length < 1) {
					notes = 'No informtion provided.'
				}
				let linkchannel = client.channels.get('508478089072738314')
				let insert = { name: message.member.user.tag, notes: notes, link: link }
 				let embed = new Discord.RichEmbed()
				.setColor(0x0000FF)
				.setTitle(message.member.user.tag)
				.addField('Party invite', notes)
				.addField('Members', message.member.user.tag)
				.setFooter('React with 🔗 to recieve the link,\nReact with ☠ if the link is invalid, \nAnd react with ⚠ if there is a troller present. \nBe aware that false alarms are punishable.')
				linkchannel.send({embed}).then(function (message) {message.react('🔗')});
				global.client.datahandler.insertLink(insert);
				message.delete(1000);
				message.channel.send('Your link has successfully been posted.').then(message => {message.delete(5000)});
				setTimeout(clearLink, 3600000);
			}
		}
	}
};
