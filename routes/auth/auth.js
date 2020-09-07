const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");

// HELPER FUNCTIONS
const {
  isLoggedin,
  isNotLoggedIn,
  validationLogIn,
} = require("../../helpers/middlewares");

const uploader = require("./../../configs/cloudinary-setup");
//  POST '/signup'

router.post("/upload", uploader.single("photo"), (req, res, next) => {
  // console.log('file is: ', req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  // get secure_url from the file object and save it in the
  // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
  res.json({ secure_url: req.file.secure_url });
});


router.post(
  "/signup",
  // revisamos si el user no está ya logueado usando la función helper (chequeamos si existe req.session.currentUser)
  isNotLoggedIn(),
  // revisa que se hayan completado los valores de email y password usando la función helper
  validationLogIn(),
  async (req, res, next) => {
    const {
      firstname,
      lastname,
      email,
      password,
      city,
      country,
      phone,
      image,
      linkedin
    } = req.body;
console.log(req.body);
    try {
      // chequea si el email ya existe en la BD
      const emailExists = await User.findOne({ email }, "email");
      // si el usuario ya existe, pasa el error a middleware error usando next()


      if (emailExists) return next(createError(400));
      else {
        // en caso contratio, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);

        const userPortfolio = await Portfolio.create({
          technologies: [
            
          ],
        });

        const newUser = await User.create({
          firstname,
          lastname,
          email,
          password: hashPass,
          city,
          country,
          phone,
          image,
          linkedin,
          portfolio: userPortfolio._id,
        });
        // luego asignamos el nuevo documento user a req.session.currentUser y luego enviamos la respuesta en json
        newUser.portfolio = userPortfolio;
        console.log("userPortfolio", newUser);

        //Siempre despues de actualizar portfolio
        req.session.currentUser = newUser;

        res.status(200).json(newUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

//  POST '/login'

// chequea que el usuario no esté logueado usando la función helper (chequea si existe req.session.currentUser)
// revisa que el email y el password se estén enviando usando la función helper
router.post(
  "/login",
  isNotLoggedIn(),
  validationLogIn(),
  async (req, res, next) => {
    const { email, password } = req.body;
   
    try {
      // revisa si el usuario existe en la BD
      const user = await User.findOne({ email });
      // si el usuario no existe, pasa el error al middleware error usando next()
      if (!user) {
        next(createError(404));
      }
      // si el usuario existe, hace hash del password y lo compara con el de la BD
      // loguea al usuario asignando el document a req.session.currentUser, y devuelve un json con el user
      else if (bcrypt.compareSync(password, user.password)) {
        const portfolioId = user.portfolio;

        const userPortfolio = await Portfolio.findById(portfolioId);

        user.portfolio = userPortfolio;

        req.session.currentUser = user;

        console.log(req.session.currentUser)
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
router.post("/logout", isLoggedin(), (req, res, next) => {
  req.session.destroy();
  //  - setea el código de estado y envía de vuelta la respuesta
  res
    .status(204) //  No Content
    .send();
  return;
});

// GET '/private'   --> Only for testing

// revisa si el usuario está logueado usando la función helper (chequea si existe la sesión), y devuelve un mensaje
router.get("/private", isLoggedin(), (req, res, next) => {
  //  - setea el código de estado y devuelve un mensaje de respuesta json
  res
    .status(200) // OK
    .json({ message: "Test - User is logged in" });
});

// GET '/me'

// chequea si el usuario está logueado usando la función helper (chequea si existe la sesión)
router.get("/me", isLoggedin(), (req, res, next) => {
  // si está logueado, previene que el password sea enviado y devuelve un json con los datos del usuario (disponibles en req.session.currentUser)
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;
