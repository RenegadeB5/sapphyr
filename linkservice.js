var Discord = require('discord.js');
module.exports = {
	name: "Link sending service",
	description: "When a user reacts with \"🔗\", they will be sent a party link.",
	type: "event",
	on: {
		messageReactionAdd: async function (reaction) {
			let user = reaction.users.map(r => r.id);
			let userid = user[user.length-1];
			let name = reaction.users.map(r => r.username);
			let discrim = reaction.users.map(r => r.discriminator);
			let username = name[name.length-1] + '#' + discrim[discrim.length-1];
			if(reaction.emoji.name === '⚠' && reaction.message.channel.id === '508478089072738314') {
				if(reaction.message.reactions.find(reaction => reaction.emoji.name === '⚠').count >= 2) {
					global.client.users.get(userid).send('Staff have already been notifed of the troll and have aready begun, or will begin their investigation soon.');
				}
				else {
					global.client.users.get(userid).send('Staff have been notifed that the link reported has a troll present, and they will begin their investigation shortly. Thank you.');
					global.client.channels.get('477644168299151375').send('The link created by' + ' ' + username + ' ' + 'has been reported for having a troller present.');
				}
			}		
			if(reaction.emoji.name === '☠' && reaction.message.channel.id === '508478089072738314') {
				if(reaction.message.reactions.find(reaction => reaction.emoji.name === '☠').count >= 3) {
					reaction.message.delete();
				}
			}
			if(reaction.emoji.name === '🔗' && reaction.message.channel.id === '508478089072738314') {
				if (userid === '507323447920033823') return;
				let list = reaction.message.embeds.map(r => r.fields.map(r => r.value))[0];
				let members = list[1, list.length-1];
				let query = { name: username};
				async function sendLink() {
					let result = await global.client.datahandler.fetchLink(query);
					let notes = result[result.length-1].notes;
					if (result[result.length-1] === undefined) {
						global.client.users.get(userid).send('Sorry, this invite link is no longer avalable.');
						console.log(result);
						reaction.message.delete();
					}
					else {
						global.client.users.get(userid).send(result[result.length-1].link + '\nNotes:' + ' ' + notes);               
						if (members.includes(username) === true) {
							return;
						}
						else {
							let embed = new Discord.RichEmbed()
							.setColor(0x0000FF)
							.setTitle(username)
							.addField('Party invite', notes)
							.addField('Members', members + '\n' + username)
							.setFooter('React with 🔗 to recieve the link, \nReact with ☠ if the link is invalid, \n And react with ⚠ if there is a troller present. \n Be aware that false alarms are punishable.')                  
							reaction.message.edit({embed});  
						}
					}
				} 
				sendLink();
			}
		}
	}
};
