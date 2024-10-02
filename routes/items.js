const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

// GET Route - All items
router.get("/", function (req, res) {
  res.json({ items })
});


// GET Route - Single item
router.get("/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404)
    }
    res.json({ item: foundItem })
  });

  // router.get('/:name', (req, res, next) => {
  //   try {
  //     let foundItem = Item.find(req.params.name);
  //     return res.json({item:foundItem});
  //   } catch(err){
  //     return next(err)
  //   }
  // });

// POST Route
router.post("/", function (req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Item name & price required", 400);
    let newItem = { name: req.body.name , price: req.body.price}
    items.push(newItem)
    return res.status(201).json({ item: newItem })
  } catch (err) {
    return next(err)
  }
});


// PATCH Route
router.patch("/:name", function (req, res) {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  res.json({ item: foundItem })
})


// DELETE Route
router.delete("/:name", function (req, res) {
  const foundItem = items.findIndex(item => item.name === req.params.name)
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404)
  }
  items.splice(foundItem, 1)
  res.json({ message: "Deleted" })
})

module.exports = router;