const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Job = require("./../../models/job");
const Portfolio = require("./../../models/portfolio");

//POST route => to save the job
//Validar si la Array
router.post("/project-detail", async (req, res, next) => {
  try {
    //const userId = req.sesion.currentUser._id;

    const {
      title,
      company_name,
      publication_date,
      url,
      tags,
      technologies,
      category,
      candidate_required_location,
    } = req.body;

    const savedJob = await Job.create({
      //userId,
      title,
      company_name,
      publication_date,
      url,
      tags,
      technologies: tags.map((str) => ({ name: str, url: "" })), 
      candidate_required_location,
      isApplication: false,
      category,
    });
    res.json(savedJob);
    console.log(savedJob);
  } catch (error) {
    console.log(error);
  }
});

router.post("/project-detail/technology", async (req, res, next) => {
  const newLink = req.body.inputLink
  const portfolioId = req.session.currentUser.userPortfolio._id
  const {
    title,
    company_name,
    publication_date,
    url,
    tags,
    technologies,
    category,
    candidate_required_location,
  } = req.body;

  if (req.body.githubUrl === "") {
    res.status(400).json({ message: "Github link needed" });
  } 

  try {
    await Job.create({
      title,
      company_name,
      publication_date,
      url,
      tags,
      technologies: tags.map((str) => ({ name: str, url: "" })), 
      candidate_required_location,
      isApplication: false,
      category,
    })

    
    await Portfolio.findByIdAndUpdate({portfolioId}, {
      technologies: {
        ...technologies,
        url: url.push(newLink)
      }
    })

    }
   catch (err) {
    console.log(err)
  }
});

router.post("/project-detail/:id/technology", async (req, res, next) => {
  const newLink = req.body.inputLink
  const jobId = req.params.id
  const portfolioId = req.session.currentUser.userPortfolio._id

  if (req.body.githubUrl === "") {
    res.status(400).send({ message: "Github link needed" });
  } 

  try {
     await Job.findByIdAndUpdate({jobId}, {
        technologies: {
          ...technologies,
          url: newLink
        }
    })
    res.status(200).send({ message: "Ok" })

    await Portfolio.findByIdAndUpdate({portfolioId}, {
      technologies: {
        ...technologies,
        url: url.push(newLink)
      }
    })
    res.status(200).send({ message: "Ok" })

  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
