"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { validateQueryParams } = require("./helpers/validate");

// 

class Job {
    // create
    static async create({ title, salary, equity, company_handle }) {
        const result = await db.query(
            `INSERT INTO jobs (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle`, 
            [title, salary, equity, company_handle]);

        let job = result.rows[0]

        if (!job) {
            throw new BadRequestError(`Error creating job: ${title}`);
        }
        return job;
    }
    // findAll
    static async findAll({ title, minSalary, hasEquity } = {}) {


        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs`
        );
    
        let whereExpressions = [];
        let queryValues = [];

        if (name) {
            queryValues.push(`%${name}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
          }
        
          if (minEmployees !== undefined) {
            queryValues.push(minEmployees);
            whereExpressions.push(`num_employees >= $${queryValues.length}`);
          }
        
          if (maxEmployees !== undefined) {
            queryValues.push(maxEmployees);
            whereExpressions.push(`num_employees <= $${queryValues.length}`);
          }
        
          if (whereExpressions.length) {
            query += " WHERE " + whereExpressions.join(" AND ");
          }
        
          query += " ORDER BY name";
        
          const companiesRes = await db.query(query, queryValues);
          return companiesRes.rows;
    }

    // get
    // update
    // remove 

}


module.exports = Job;
