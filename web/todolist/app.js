const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");



const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));




// mongoose connect
mongoose.connect("mongodb+srv://Admin-royan:Jack-admin@clustermongodb.ecqxfgp.mongodb.net/todolistDB")
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log("mongo error", err));


// schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String
    }
})

// model // create
const Item = mongoose.model("item", itemSchema);


// item
const firstItem = new Item({
    name: "HelloWorld"
});







// read
app.get("/", (req, res) => {

    Item.find().then((foundItems) => {
        if (foundItems.length === 0) {

            Item.insertMany(firstItem);
            res.redirect("/");
        } else {

            res.render("list", { listTitle: "Home", newListItems: foundItems });
        }
    });
})



// update
app.post("/", (req, res) => {

    const itemName = req.body.newItem;

    const newItem = new Item({
        name: itemName
    });

    const listName = req.body.list;


    if (listName === "Home") {

        Item.insertMany(newItem);
        res.redirect("/");
    } else {

        List.findOne({ name: listName })
            .then((foundList) => {
                foundList.items.push(newItem);
                foundList.save();
            })

        res.redirect("/" + listName);
    }
})


// delete
app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Home") {
        Item.findByIdAndRemove({ _id: checkedItemId }).then();
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then((foundList) => {
                res.redirect("/" + listName);
            });
    }

});








// schema
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});


// model
const List = new mongoose.model("list", listSchema);


// list -> array
// const defaultItems = [];





// new model
app.get("/:customListName", (req, res) => {

    const customListName = _.capitalize(req.params.customListName);

    const newList = new List({
        name: customListName,
        items: []
    })


    List.findOne({ name: customListName })
        .then((foundList) => {
            if (foundList) {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            } else {
                List.insertMany(newList).then();
                res.redirect("/" + customListName);
            }
        })

})






app.listen(process.env.PORT || 3000, () => {
    console.log("server started on port 3000");
})