const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Job = require("./../../models/job");
const User = require("../../models/user");
const Portfolio = require("./../../models/portfolio")

router.get(('/profile'), async (req, res, next) => {
    const userId = req.session.currentUser._id
    try {
        const findUser = await User.findById({_id: userId})
        res.status(200).json(findUser)
    } catch (err) {
        console.log(err)
    }
})

router.put(('/profile'), async (req, res, next) => {
    const userId = req.session.currentUser._id
    const {image, firstname, lastname, email, country, city, phone, linkedin} = req.body
    try {
        const updatedUser = await User.findByIdAndUpdate({_id: userId}, {
            image,
            firstname,
            lastname,
            email,
            country,
            city,
            phone,
            linkedin
        })
        res.status(200).json(updatedUser)
    } catch (err) {
        console.log(err)
    }
})



router.get(('/pending'), async (req, res, next) => {
    try {
        const findJobs = await Job.find({isApplication: false})
        res.status(200).json(findJobs)
    } catch (err) {
        console.log(err)
    }
})

router.get(('/completed'), async (req, res, next) => {
    try {
        const findJobs = await Job.find({isApplication: true})
        res.status(200).json(findJobs)
    } catch (err) {
        console.log(err)
    }
})

router.get(('/portfolio'), async (req, res, next) => {
    try {
        const getPortfolio = await Portfolio.find()
        res.status(200).json(getPortfolio)
    } catch (err) {
        console.log(err)
    }
})

router.delete(('/completed/:id'), async (res, req, next) => {
    const completedJobId = req.params.id
    try{
        await Job.findByIdAndDelete(completedJobId)
    } catch (err){
        console.log(err)
    }
})

router.delete(('/pending/:id'), async (res, req, next) => {
    const pendingJobId = req.params.id
    try{
        await Job.findByIdAndUpdate(pendingJobId)
    } catch (err){
        console.log(err)
    }
})

router.put(('/portfolio'), async (res, req, next) => {
    const portfolioId = req.session.currentUser.portfolio
    try{
        await Job.findByIdAndUpdate(portfolioId)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;