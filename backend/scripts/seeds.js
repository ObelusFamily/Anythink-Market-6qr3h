'use strict'

const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.connect(process.env.MONGODB_URI);

require("../models/User");
require("../models/Item");
require("../models/Comment");

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

const SEED_AMOUNT = 100;

function seedUser(seedNumber) {
    const user = new User({
        username: `user${seedNumber}`,
        email: `user${seedNumber}@anythink.com`
    });
    user.setPassword(`Password${seedNumber}`);
    return user.save();
}

function seedItem(seedNumber, seller) {
    return Item({
        title: `Item ${seedNumber}`,
        seller
    }).save();
}

function seedComment(seedNumber, seller, item) {
    return new Comment({
        body: `Comment ${seedNumber}`,
        item,
        seller
    }).save();
}

async function seedOne(seedNumber) {
    const seller = await seedUser(seedNumber);
    const item = await seedItem(seedNumber, seller);
    await seedComment(seedNumber, seller, item);
}


async function seed(amount) {
    await Comment.deleteMany();
    await Item.deleteMany();
    await User.deleteMany();
    for(let i = 0; i < amount; i++) {
        console.log(`Seeding with ${i}...`);
        await seedOne(i);
    }
}

return seed(SEED_AMOUNT).then(() => {
    process.exit(0);
});
