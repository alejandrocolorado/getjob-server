const express = require("express");
const router = express.Router();
const axios = require("axios");

//Prueba acceso a datos RestAPI
/* router.get ('/test', async (req, res, next) => {
  
    const response = await axios.get('https://remotive.io/api/remote-jobs?category=software-dev')
  
    res.json(response.data)
  });
 */
router.post("/test", async (req, res, next) => {
 
  const response = await axios.get(
    `https://remotive.io/api/remote-jobs${req.body.query}`
  );

  res.json(response.data.jobs);
});

module.exports = router;
