const express = require("express");
const router = express.Router();
const axios = require ('axios')


//Prueba acceso a datos RestAPI
router.get ('/test', async (req, res, next) => {
    const response = await axios.get('https://remotive.io/api/remote-jobs?category=software-dev')
  
    res.json(response.data)
  });

  module.exports = router;