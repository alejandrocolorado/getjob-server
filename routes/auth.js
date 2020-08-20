const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//  POST '/signup'

router.post(
  "/signup",
  // revisamos si el user no está ya logueado usando la función helper (chequeamos si existe req.session.currentUser)
  isNotLoggedIn(),
  // revisa que se hayan completado los valores de username y password usando la función helper
  validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body;

    try {
      // chequea si el username ya existe en la BD
      const usernameExists = await User.findOne({ username }, "username");
      // si el usuario ya existe, pasa el error a middleware error usando next()
      if (usernameExists) return next(createError(400));
      else {
        // en caso contratio, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const newUser = await User.create({ username, password: hashPass });
        // luego asignamos el nuevo documento user a req.session.currentUser y luego enviamos la respuesta en json
        req.session.currentUser = newUser;
        res
          .status(200) //  OK
          .json(newUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

//  POST '/login'

// chequea que el usuario no esté logueado usando la función helper (chequea si existe req.session.currentUser)
// revisa que el username y el password se estén enviando usando la función helper
router.post(
  "/login",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      // revisa si el usuario existe en la BD
      const user = await User.findOne({ username });
      // si el usuario no existe, pasa el error al middleware error usando next()
      if (!user) {
        next(createError(404));
      }
      // si el usuario existe, hace hash del password y lo compara con el de la BD
      // loguea al usuario asignando el document a req.session.currentUser, y devuelve un json con el user
      else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

// POST '/logout'

// revisa si el usuario está logueado usando la función helper (chequea si la sesión existe), y luego destruimos la sesión
router.post("/logout", isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  //  - setea el código de estado y envía de vuelta la respuesta
  res
    .status(204) //  No Content
    .send();
  return;
});

// GET '/private'   --> Only for testing

// revisa si el usuario está logueado usando la función helper (chequea si existe la sesión), y devuelve un mensaje
router.get("/private", isLoggedIn(), (req, res, next) => {
  //  - setea el código de estado y devuelve un mensaje de respuesta json
  res
    .status(200) // OK
    .json({ message: "Test - User is logged in" });
});

// GET '/me'

// chequea si el usuario está logueado usando la función helper (chequea si existe la sesión)
router.get("/me", isLoggedIn(), (req, res, next) => {
  // si está logueado, previene que el password sea enviado y devuelve un json con los datos del usuario (disponibles en req.session.currentUser)
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;
