const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Job = require("./../../models/job");

//POST route => to save the job
//Validar si la Array
router.post("/project-detail", async (req, res, next) => {
  try {
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
      title,
      company_name,
      publication_date,
      url,
      tags,
      technologies: [
        {
          name: tags[0],
          url: "",
        },
        {
          name: tags[1],
          url: "",
        },
        {
          name: tags[2],
          url: "",
        },
      ],
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

router.post('/project-detail/technology', (req, res, next)=>{
    //El input de esta vista el name=githubUrl
    //No hay submit si el input está vacío
    //rellenas el input;
    // 1.Validas si el Job existe, 
        //1.1 si hay job, haces un findandupdate de job, con la nueva technology.
        //1.2 si no existe se hace un create Job
    //2.valids  si el portfolio exist;
     //1.1 si hay esa tehcnology, la agregas al portfolio, findandupdate portfolio
     //1.2 si no existe create Portfolio.
    if (req.body.githubUrl=== '') {
        res.status(400).json({message:'Github link needed'});     
    }else if(dsad){
        //
        
    }
})

module.exports = router;
