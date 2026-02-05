const invModel = require("../models/inventory-model")
const Utilities = {}

/* ************************
 *  Build Navigation
 * ************************ */
Utilities.getNav = async function () {
  const data = await invModel.getClassifications()

  let nav = `<ul>
    <li><a href="/" title="Home page">Home</a></li>`

  data.rows.forEach((row) => {
    nav += `<li>
      <a href="/inv/type/${row.classification_id}"
         title="See our inventory of ${row.classification_name}">
         ${row.classification_name}
      </a>
    </li>`
  })

  nav += "</ul>"
  return nav
}

/* ************************
 *  Build Classification Grid
 * ************************ */
Utilities.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <div class="namePrice">
          <hr>
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
 *  Build Classification Select List
 * ************************ */
Utilities.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let list =
    '<select name="classification_id" id="classificationList" required>'
  list += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"`
    if (classification_id == row.classification_id) {
      list += " selected"
    }
    list += `>${row.classification_name}</option>`
  })
  list += "</select>"
  return list
}

/* ************************
 *  Error Handler Wrapper
 * ************************ */
Utilities.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Utilities
