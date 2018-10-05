const fs = require("fs");
const regex = require("./links.json");
const diepregex = RegExp(regex.diep);
module.exports = {
	name: "Link detection service",
	description: "Creates an embed for party invites.",
	type: "event",
	on: {
		message: async function (message) {
      let msgArray = msg.content.split(" ");
      args = msgArray.slice(0);
			if (message.channel.id === message.guild.channels.find("name", "art").id && message.attachments.size > 0)
				message.react("🔺");
		}
	}
};
