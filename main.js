var path = require("path");
var config = require("./localdata/config.json");
var commando = require("discord.js-commando");
var MongoClient = require('mongodb').MongoClient;
var MongoDBProvider = require('mongodb');
var { initializeServices, services } = require("./services");

var client = new commando.Client({
	owner: config.owners,
	commandEditableDuration: 0,
	nonCommandEditable: false,
	unknownCommandResponse: false,
	commandPrefix: "_"
});

var uri = "mongodb+srv://RenegadeB5:puppies12@cluster0-l1qqw.mongodb.net/test?retryWrites=true";
MongoClient.connect(uri, function(err, client) {
	if (err) {
		console.error('An error occurred connecting to MongoDB: ', err);
	}
	else {
		var query = { partylinks: "https://diep.io" };
		const collection = client.db("partylinks").collection("links");
		collection.find(query).toArray(function(err, result) {
 			if (err) throw err;
			console.log((result[0])['partylink']);
		});
		client.close();
	}
});

client
	.on("ready", () => {
		console.log(`Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
		client.user.setActivity("with sapphires!");
	})
	.on("commandError", (cmd, err) => {
		if (err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on("commandBlocked", (msg, reason) => {
		console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""} blocked. ${reason}`);
	})
	.on("commandPrefixChange", (guild, prefix) => {
		console.log(`Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
		`);
	})
	.on("commandStatusChange", (guild, command, enabled) => {
		console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
		`);
	})
	.on("groupStatusChange", (guild, group, enabled) => {
		console.log(`Group ${group.id} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`);
	});

client.registry
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerGroups([
		["basics", "basic commands"],
		["fun", "fun commands"],
		["moderation", "moderation commands"]
	])
	.registerCommandsIn(path.join(__dirname, "commands"));

client.login(process.env.BOT_TOKEN);
initializeServices(client);
global.services = services;
global.client = client;
global.MongoClient = MongoClient;
global.MongoDBProvider = MongoDBProvider;
