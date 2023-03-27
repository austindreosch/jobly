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

        if (title) {
            queryValues.push(`%${title}%`);
            whereExpressions.push(`title ILIKE $${queryValues.length}`);
          }
        
          if (minEmployees !== undefined) {
            queryValues.push(minSalary);
            whereExpressions.push(`salary >= $${queryValues.length}`);
          }
        
          if (maxEmployees !== undefined) {
            queryValues.push(hasEquity);
            whereExpressions.push(`equity > 0`);
          }
        
          if (whereExpressions.length) {
            query += " WHERE " + whereExpressions.join(" AND ");
          }
        
          query += " ORDER BY title";
        
          const jobsRes = await db.query(query, queryValues);
          return jobsRes.rows;
    }

    // get
    static async get(title) {
        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE title = $1`, [title]);
    
        const job = result.rows[0];
    
        if (!job) throw new NotFoundError(`No job: ${title}`);
        return job;
      }

    // update
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            title: "title",
            salary: "salary",
            equity: "equity"
        });

        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs
                          SET ${setCols}        
                          WHERE title = ${idVarIdx}
                          RETURNING id, title, salary, equity, company_handle`;

        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];
    
        if (!job) throw new NotFoundError(`No job: ${id}`);
    
        return job;
    }



    // remove 
    static async remove(id) {
        const result = await db.query(
              `DELETE
               FROM jobs
               WHERE id = $1
               RETURNING id`,
            [id]);
        const job = result.rows[0];
    
        if (!job) throw new NotFoundError(`No company: ${id}`);
      }
}


module.exports = Job;
