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
                        if (diepregex.test(args[0])) {
                                let link = args[0];
				let notes = args.slice(1).join(" ");
                                let linkchannel = client.channels.get('451417402119421952')
 				let embed = new Discord.RichEmbed()
				.setColor(0x00FF00)
				.setTitle('Party invite')
                                .addField('Notes', notes, true)
				.addfield('Owner', message.member.user.tag, true)
                                .setTimestamp()
				.setFooter('React with \"🔗\" to get the link.')
				message.delete();
				linkchannel.send({embed}).then(function (message) {message.react('🔗')});
			}
		}
	}
};
