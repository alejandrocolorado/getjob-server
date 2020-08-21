const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Job = require("./../../models/job");
const Portfolio = require("./../../models/portfolio");

//POST route => to save the job
//Validar si la Array
router.post("/project-detail", async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;

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
    console.log(tags);

    const savedJob = await Job.create({
      userId,
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
  const userId = req.session.currentUser._id;

  const portfolioId = req.session.currentUser.portfolio._id;
  const portfolio = req.session.currentUser.portfolio;
  console.log(portfolio);
  const {
    title,
    company_name,
    publication_date,
    url,
    tags,
    //debe ser un objeto, para enviar desde el frontend.
    technology,
    category,
    candidate_required_location,
  } = req.body;

  if (technology.url === "") {
    res.status(400).json({ message: "Github link needed" });
  }
  //Array de las tecnlogias que hay en el portfolio y añadiendo la nueva, proveniente de solicitud.
  
  
  
  const updatedTechnologies = [...portfolio.technologies, technology];
  //filtras las tencologias que hay en el portfolio y que coincidan con tags
  const currentTechnologies = updatedTechnologies.filter((tech) => {
    //aqui compar alas technologies con tags.
    return tags.includes(tech.name);
  });

  // array de solo nombres de tags del portfolio y de la que añades en la pagina, que ya tengo
  const currentTags = currentTechnologies.map((tech) => tech.name);

  //
  const missingTechnologies = tags.map((tag) => {
    //{ name: str, url: "" }
    if (!currentTags.includes(tag)) {
      return { name: tag, url: "" };
    }
  });

  try {
    await Job.create({
      userId,
      title,
      company_name,
      publication_date,
      url,
      tags,
      technologies: [...currentTechnologies, ...missingTechnologies],
      candidate_required_location,
      isApplication: false,
      category,
    });

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolioId,
      {
        technologies: updatedTechnologies
      },
      { new: true }
    );
    //Siempre despues de actualizar portfolio
    req.session.currentUser.portfolio = updatedPortfolio;
    
  } catch (err) {
    console.log(err);
  }
});

//Aqui hay que implementar la misma logica de filter y map, anterior.

router.post("/project-detail/:id/technology", async (req, res, next) => {
  const newLink = req.body.inputLink;
  const jobId = req.params.id;
  const portfolioId = req.session.currentUser.userPortfolio._id;

  if (req.body.githubUrl === "") {
    res.status(400).send({ message: "Github link needed" });
  }

  try {
    await Job.findByIdAndUpdate(
      { jobId },
      {
        technologies: {
          ...technologies,
          url: newLink,
        },
      }
    );
    res.status(200).send({ message: "Ok" });

    await Portfolio.findByIdAndUpdate(
      { portfolioId },
      {
        technologies: {
          ...technologies,
          url: url.push(newLink),
        },
      }
    );
    res.status(200).send({ message: "Ok" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
