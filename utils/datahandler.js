const { MongoClient } = require("mongodb");

class dataHandler {
    constructor(host = 27017, databaseName = "partylinks") {
        if (typeof host === "number")
            host = "localhost:" + host;
        this._host = "mongodb+srv://RenegadeB5:" + global.password + "@cluster0-l1qqw.mongodb.net/test?retryWrites=true";
        this._databaseName = databaseName;
        this.client = new MongoClient(this._host, { useNewUrlParser: true });
        this.initialized = false;
    }

    async initialize() {
        await this.client.connect();
        this.db = this.client.db(this._databaseName);
        this.initialized = true;
    }

    get isInitialized() {
        return this.initialized;
    }

    async close() {
        await this.client.close();
        this.db = null;
    }

    async getGuilds() {
        let guilds = await this.db.collection("guilds");
        return await guilds.find().toArray();
    }

    async getGuild(guild) {
        let guilds = await this.db.collection("guilds");
        return await guilds.find({ id: guild.id }).toArray();
    }

    async getOrAddGuild(guild) {
        let guildData = await this.getGuild(guild);
        if (Array.isArray(guildData) && guildData.length < 1)
            await this.addGuild(guild);
        let data = await this.getGuild(guild);
        return data[0];
    }

    async addGuild(guild) {
        let guilds = await this.db.collection("guilds");
        return await guilds.insertOne({
            id: guild.id,
            prefix: "_",
            permissions: [],
            linkdetection: { enabled: false },
            nadekoconnector: { enabled: false },
            beta: false
        });
    }

    async removeGuild(guild) {
        let guilds = await this.db.collection("guilds");
        if (typeof guild.id === "undefined") return;
        return await guilds.deleteMany({ id: guild.id });
    }

    async removeAllGuilds() {
        let guilds = await this.db.collection("guilds");
        return await guilds.deleteMany({});
    }

    async editGuild(guild, settings = {}, removeSettings = false) {
        let guilds = await this.db.collection("guilds");
        if (typeof removeSettings !== "boolean") return;
        if (removeSettings)
            return await guilds.updateOne({ id: guild.id }, { $unset: settings });
        return await guilds.updateOne({ id: guild.id }, { $set: settings });
    }
    async insertLink(insert) {
        let links = await this.db.collection("partylinks");
        return await links.insertOne(insert);
    }
    async fetchLink(query) {
        let links = await this.db.collection("partylinks");
        return await links.find(query).sort({_id:-1}).limit(1).toArray();
        
    }
    async remove1Link() {
        let links = await this.db.collection("partylinks");
        return await links.findOneAndDelete({});
    }
    
    async purgeLinks() {
        let links = await this.db.collection("partylinks");
        links.deleteMany({});
    }
}

module.exports = dataHandler;
