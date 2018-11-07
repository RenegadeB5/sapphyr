var { Command } = require("discord.js-commando");
module.exports = class SaveDataCommand extends global.utils.baseCommand {
    constructor(client) {
        super(client, {
            name: "purgelinks",
            description: "Purges the party links collection completely.",
            group: "utils",
            memberName: "purgelinks",
            userPermissions: ['ADMINISTRATOR']
        });
    }

    async task(ctx) {
        global.client.datahandler.purgeLinks();
        await ctx.message.channel.send("Partylinks has successfully been purged!");
    }
};
