const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id)
    
    // If we dont have data , we sent a 404 error
    if (!data || data.length === 0) {
      return next({ status: 404, message: "No vehicles found for this classification" })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name  
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)  
  }
}

/* ***************************
 *  Function to build the dynamic item detail view
 * ************************** */
invCont.buildItemDetail = async function (req, res, next) {
  const itemId = req.params.itemId;  // Getting the Id of the item since the url
  try {
    const item = await invModel.getItemById(itemId);  // calling the funtion getItemById of invModel

    if (!item) {
      return next({ status: 404, message: "Item not found" });  // If the article is not find error 404 will be return
    }

    
    // Call the personalize funtion to format the details of the article.
    const itemHTML = await utilities.formatItemDetails(item);

    const nav = await utilities.getNav();
    // Rendarize the view itemDetail passing 'item' complete with itemHTML
    res.render("inventory/itemDetail", {
      title: `${item.inv_make} ${item.inv_model}`,  // Dinamic Title
      nav,
      itemHTML,  // The details or the articles
      item  //  Pass the 'item' object to the view
    });
  } catch (error) {
    next(error);  // In case of an error , we use el middleware of manage of errors
  }
};

module.exports = invCont