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
