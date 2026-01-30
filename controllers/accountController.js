const utilities = require("../utilities/index")
const accountModel = require("../controllers/account-model.js")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {  // Make sure you have a 'register.ejs' view
    title: "Register",
    nav,
    errors: null
  });
}

// Handle user registration - accountController.js
async function handleRegister(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;  // Extraer campos del formulario

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match.");  // Agregar mensaje flash
      return res.redirect("/account/register");  // Redirigir si hay error
    }

    // Mostrar los datos en consola por ahora (para pruebas)
    console.log(`User: ${name}, Email: ${email}`);

    // Aquí podrías agregar lógica para guardar el usuario en la base de datos.
    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/account/login");  // Redirigir al login si el registro fue exitoso
  } catch (error) {
    next(error);  // Pasar errores al middleware
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = { buildLogin, buildRegister, handleRegister,registerAccount };


  