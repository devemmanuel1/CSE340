const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
 * Normaliza la ruta de imagen del inventario (vehículos en /images/vehicles/)
 * ************************************ */
function imagePath(relativePath) {
  if (!relativePath) return '/images/vehicles/no-image-tn.png'
  if (relativePath.startsWith('/images/vehicles/')) return relativePath
  if (relativePath.startsWith('/images/')) return '/images/vehicles/' + relativePath.slice(8)
  return relativePath
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      const thumbSrc = imagePath(vehicle.inv_thumbnail)
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + thumbSrc 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the inventory item detail view HTML
 * ************************************ */
Util.buildDetailHTML = async function (vehicle) {
  if (!vehicle) return '<p class="notice">Vehicle not found.</p>'
  const imgSrc = imagePath(vehicle.inv_image)
  const priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)
  const milesFormatted = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
  let html = '<div class="vehicle-detail">'
  html += '<div class="vehicle-detail__image">'
  html += '<img src="' + imgSrc + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
  html += '</div>'
  html += '<div class="vehicle-detail__content">'
  html += '<h2 class="vehicle-detail__name">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
  html += '<p class="vehicle-detail__year"><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
  html += '<p class="vehicle-detail__price"><strong>Price:</strong> ' + priceFormatted + '</p>'
  html += '<p class="vehicle-detail__miles"><strong>Mileage:</strong> ' + milesFormatted + ' miles</p>'
  html += '<p class="vehicle-detail__color"><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
  html += '<p class="vehicle-detail__description"><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
  html += '</div>'
  html += '</div>'
  return html
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util