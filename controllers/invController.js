const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 * Inventory by Classification
 * ************************** */
invCont.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const nav = await utilities.getNav()

  res.render("inventory/classification", {
    title: "Inventory",
    nav,
    grid: await utilities.buildClassificationGrid(data.rows),
  })
}

/* ***************************
 * Inventory Detail
 * ************************** */
invCont.buildByInventoryId = async function (req, res) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: `${data.rows[0].inv_make} ${data.rows[0].inv_model}`,
    nav,
    item: utilities.formatItemDetails(data.rows[0]),
  })
}

/* ***************************
 * Management View
 * ************************** */
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 * Add Classification
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
  })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("success", "Classification added.")
    res.redirect("/inv/")
  } else {
    req.flash("error", "Failed to add classification.")
    res.redirect("/inv/add-classification")
  }
}

/* ***************************
 * Add Inventory
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
  })
}

invCont.addInventory = async function (req, res) {
  const result = await invModel.addInventory(req.body)

  if (result) {
    req.flash("success", "Vehicle added.")
    res.redirect("/inv/")
  } else {
    req.flash("error", "Failed to add vehicle.")
    res.redirect("/inv/add-inventory")
  }
}

module.exports = invCont
