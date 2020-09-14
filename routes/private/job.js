const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Job = require("./../../models/job");
const Portfolio = require("./../../models/portfolio");
const User = require("../../models/user");

//POST route => to save the job
//Validar si la Array
router.post("/job-detail", async (req, res, next) => {
  try {

    const tagsArr = [
      "mobile",
      "CSS",
      "react",
      "javascript",
      "php",
      "angular",
      "python",
      "sketch",
      "ui",
      "html",
      "figma",
    ];
    
    const {job, userId} = req.body

    const techObj = job.tags.map((str) => { if (tagsArr.includes(str)){
        return ({ name: str, url: "" })
      }
    }).filter(el=>el)

    const tagsToShow = techObj.map((tech) => tech.name )

  

    
    
    const savedJob = await Job.create({
      userId,
      title: job.title,
      company_name: job.company_name,
      publication_date: job.publication_date,
      url: job.url,
      apiId: job.id,
      tags: job.tags,
      tagsToShow,
      technologies: techObj,
      candidate_required_location: job.candidate_required_location,
      isApplication: false,
      category: job.category,
    });
    res.json(savedJob);
    
  } catch (error) {
    console.log(error);
  }
});



router.post("/job-detail/technology", async (req, res, next) => {
  //const userId = user._id;
  const {job, user, githubLink, tag} = req.body
  
  const technology = {name: tag.name, url: githubLink}
  



  if (githubLink === "") {
    res.status(400).json({ message: "Github link needed" });
  }
  //Array de las tecnlogias que hay en el portfolio y añadiendo la nueva, proveniente de solicitud.

  try {
    const portfolio = await Portfolio.findById(user.portfolio._id)
  

    const filteredPortfolioTechs = portfolio.technologies.filter((tech) => {
      return (tech.name !== technology.name)
    })


    const updatedTechnologies = [...filteredPortfolioTechs, technology];

  
  //filtras las tencologias que hay en el portfolio y que coincidan con tags
  const currentTechnologies = updatedTechnologies.filter((tech) => {
    //aqui compar alas technologies con tags.
    return job.tagsToShow.includes(tech.name);
  });

 
  // array de solo nombres de tags del portfolio y de la que añades en la pagina, que ya tengo
  const currentTags = currentTechnologies.map((tech) => tech.name);
  
 
  
  const missingTechnologies = job.tagsToShow.map((tag) => {
   
    if (!currentTags.includes(tag)) {
      return { name: tag, url: "" };
    }
  }).filter(el=>el);

  console.log('missingTechnologies:', currentTags)
 

    const updatedJob = await Job.findByIdAndUpdate(job._id, {
      //...updatedJob,
      technologies: [...currentTechnologies, ...missingTechnologies],
    });

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolio._id,
      {
        technologies: updatedTechnologies,
      },
      { new: true }
    );
    //Siempre despues de actualizar portfolio, tambien actualizar el user con el job.
    
    const updatedUser = await User.findByIdAndUpdate(user._id, {$push: {jobs:updatedJob._id}})
    
    updatedUser.portfolio = updatedPortfolio;
    req.session.currentUser = updatedUser;

    res.status(200).json(updatedJob);
    
  } catch (err) {
    console.log(err);
  }
});

router.get('/job-detail-saved/:id', async (req, res, next) => {
  const jobId = req.params.id
  
  try{
    const jobDetail = await Job.findById({_id: jobId});
  
    res.status(200).json(jobDetail)
  } catch (err){
    console.log(err)
  }
})

router.post('/job-detail-saved/:id', async (req, res, next) => {
  const jobId = req.params.id
 
  try{
    const updatedJob = await Job.findByIdAndUpdate(jobId, {
      isApplication: true
    });
   
    res.status(200).json(updatedJob)
  } catch (err){
    console.log(err)
  }
})
module.exports = router;
