const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Job = require("./../../models/job");
const User = require("../../models/user");

router.get(('/user/pending'), (req, res, next) => {
    try {
        const pendingJobs = []
        const findJobs = await Job.find()
    } catch (err) {
        console.log(err)
    }
})