var { Command } = require("discord.js-commando");
module.exports = class ClearLinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: "clearlink",
            description: "Removes the users current party link from the database",
            group: "basics",
            memberName: "clearlink"
        });
    }
    
    async run(msg) {
        global.MongoClient.connect(global.uri, function(err, client) {
            if (err) {
                console.error('An error occurred connecting to MongoDB: ', err);
			}
			else {
				const query = { name: msg.member.user.tag };
				const collection = client.db("partylinks").collection("links");
				collection.deleteOne(query, function(err, result) {
				    console.log('link removed from db');
                    msg.channel.send('Your link has successfully been removed from the database.').then(message => {message.delete(5000)});
			    });
		    	client.close();
			}
        });
    }
};
