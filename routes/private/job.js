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
      "frontend",
      "CSS",
      "react",
      "javascript",
      "php",
      "node.js",
      "python",
      "sketch",
      "UI/UX",
      "html",
      "figma",
    ];
    
    const {job, userId} = req.body

    const techObj = job.tags.map((str) => { if (tagsArr.includes(str)){
        return ({ name: str, url: "" })
      }
    }).filter(el=>el)

  

    
    
    const savedJob = await Job.create({
      userId,
      title: job.title,
      company_name: job.company_name,
      publication_date: job.publication_date,
      url: job.url,
      apiId: job.id,
      tags: job.tags,
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

// router.post("/job-detail/technology", async (req, res, next) => {
//   const userId = req.session.currentUser._id;

//   const portfolioId = req.session.currentUser.portfolio._id;
//   const portfolio = req.session.currentUser.portfolio;
//   console.log("let me see", portfolio);
//   const {
//     title,
//     company_name,
//     apiId,
//     publication_date,
//     url,
//     tags,
//     //debe ser un objeto, para enviar desde el frontend.
//     technology,
//     category,
//     candidate_required_location,
//   } = req.body;

//   if (technology.url === "") {
//     res.status(400).json({ message: "Github link needed" });
//   }
//   //Array de las tecnlogias que hay en el portfolio y añadiendo la nueva, proveniente de solicitud.
  
  
  
//   const updatedTechnologies = [...portfolio.technologies, technology];

// /*   let technologyExists = false

//   portfolio.technologies.forEach(tech => {

//    if (tech.name === technology.name) {
//      tech.url.push(technology.url) 
//      technologyExists=true;
//    } 
//  });
//   if (!technologyExists) {
//     const newTechnology= {t}
//     portfolio.technologies.push(t)
//   } */

//   //filtras las tencologias que hay en el portfolio y que coincidan con tags
//   const currentTechnologies = updatedTechnologies.filter((tech) => {
//     //aqui compar alas technologies con tags.
//     return tags.includes(tech.name);
//   });

//   // array de solo nombres de tags del portfolio y de la que añades en la pagina, que ya tengo
//   const currentTags = currentTechnologies.map((tech) => tech.name);
  

//   //
//   const missingTechnologies = tags.map((tag) => {
//     //{ name: str, url: "" }
//     if (!currentTags.includes(tag)) {
//       return { name: tag, url: "" };
//     }
//   }).filter(el=>el);

//   console.log({updatedTechnologies, currentTechnologies, missingTechnologies });

//   try {
//     const newJob = await Job.create({
//       userId,
//       title,
//       company_name,
//       publication_date,
//       apiId,
//       url,
//       apiId,
//       tags,
//       technologies: [...currentTechnologies, ...missingTechnologies],
//       candidate_required_location,
//       isApplication: false,
//       category,
//     });

//     const updatedPortfolio = await Portfolio.findByIdAndUpdate(
//       portfolioId,
//       {
//         technologies: updatedTechnologies,
//       },
//       { new: true }
//     );
//     //Siempre despues de actualizar portfolio, tambien actualizar el user con el job.
    
//     const updatedUser = await User.findByIdAndUpdate(userId,  {$push: {jobs:newJob._id}})
    
//     updatedUser.portfolio = updatedPortfolio;
//     req.session.currentUser = updatedUser;

//     res.json(newJob);
    
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post("/technology", async (req, res, next) => {
  //const userId = user._id;
  const {job, user, githubLink, tag} = req.body
  const technology = {name: tag.name, url: githubLink}
  console.log('loLogre', technology)



  if (githubLink === "") {
    res.status(400).json({ message: "Github link needed" });
  }
  //Array de las tecnlogias que hay en el portfolio y añadiendo la nueva, proveniente de solicitud.

  try {
    const portfolio = await Portfolio.findById(user.portfolio)
    console.log(portfolio)

    const filteredPortfolioTechs = portfolio.technologies.filter((tech) => {
      return (tech.name !== technology.name)
    })

    console.log('filteredPortfolioTechs:', filteredPortfolioTechs)

    const updatedTechnologies = [...filteredPortfolioTechs, technology];

    console.log('updatedTechnologies:', updatedTechnologies)
  //filtras las tencologias que hay en el portfolio y que coincidan con tags
  const currentTechnologies = updatedTechnologies.filter((tech) => {
    //aqui compar alas technologies con tags.
    return job.tags.includes(tech.name);
  });

  console.log('currentTechnologies:', currentTechnologies)
  // array de solo nombres de tags del portfolio y de la que añades en la pagina, que ya tengo
  const currentTags = currentTechnologies.map((tech) => tech.name);
  
  console.log('currentTags:', currentTags)
  //
  const missingTechnologies = job.tags.map((tag) => {
    //{ name: str, url: "" }
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

//Aqui hay que implementar la misma logica de filter y map, anterior.

// router.post("/job-detail/:id/technology", async (req, res, next) => {
//   const newLink = req.body.inputLink;
//   const jobId = req.params.id;
//   const portfolioId = req.session.currentUser.userPortfolio._id;

//   if (req.body.githubUrl === "") {
//     res.status(400).send({ message: "Github link needed" });
//   }

//   try {
//     await Job.findByIdAndUpdate(
//       { jobId },
//       {
//         technologies: {
//           ...technologies,
//           url: newLink,
//         },
//       }
//     );
//     res.status(200).send({ message: "Ok" });

//     await Portfolio.findByIdAndUpdate(
//       { portfolioId },
//       {
//         technologies: {
//           ...technologies,
//           url: url.push(newLink),
//         },
//       }
//     );
//     res.status(200).send({ message: "Ok" });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get('/job-detail-saved/:id', async (req, res, next) => {
  const jobId = req.params.id
  
  try{
    const jobDetail = await Job.findById({_id: jobId});
    console.log(jobDetail)
    res.status(200).json(jobDetail)
  } catch (err){
    console.log(err)
  }
})

module.exports = router;
