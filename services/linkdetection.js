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
                                let linkchannel = message.guild.channels.find("name", "member-links")
                                let embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setFooter('React with \"🔗\" to get the link.')
                                .setTitle('Party invite')
                                .setAuthor(message.member.user.tag)
                                .addField("Notes", notes, true)
                                .setTimestamp()
                                message.delete();
				console.log('test');
                                linkchannel.send({embed}).then(function (message) {message.react('🔗')});
			}
		}
	}
};
