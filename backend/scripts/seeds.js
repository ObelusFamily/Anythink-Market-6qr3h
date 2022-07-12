const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.connect(process.env.MONGODB_URI);

require("../models/User");
require("../models/Item");
require("../models/Comment");
require("../config/passport");

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

const SEED_AMOUNT = 100;

for(let i = 0; i < SEED_AMOUNT; i++) {
    const seller = new User({
        username: `user${i}`,
        email: `user${i}@anythink.com`
    });
    seller.setPassword(`Password${i}`);

    const item = new Item({
        title: `Item ${i}`,
        description: `Some item ${i}`,
        image: null,
        tagList: [],
        seller
    });

    const comment = new Comment({
        body: `Comment ${i}`,
        item,
        seller
    });

    seller.save().then(() => item.save().then(() => comment.save()));
}
