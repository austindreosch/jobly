"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Job = require("../models/job");
const jobUpdateSchema = require("../schemas/jobNew.json");

const router = express.Router();


// post /
router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
})

// get /
router.get("/", async function (req, res, next) {
    try {
        const jobs = await Job.findAll(req.query);
        let allowedParams = ["title", "minSalary", "hasEquity"]

        if(!validateQueryParams(req.query, allowedParams)){
            return res.status(400).json({error: "Invalid query string."})
        }

        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
})


// get /:id
router.get("/:id", async function (req, res, next) {
    try {
      const job = await Job.get(req.params.username);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });
  
// patch /:id
router.patch("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

// delete /:id
router.delete("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        await Job.delete(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;