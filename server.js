require('dotenv').config();

const express = require('express');
const app = express();
const mysql = require('mysql');
// Create database connection using credentials from .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});
// Question 1 goes here
// GET endpoint to retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patients: ' + err);
      res.status(500).json({ error: 'Failed to retrieve patients' });
      return;
    }
    res.json(results); // Send the results back as JSON
  });
});

// Question 2 goes here
//GET endpoint to retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT provider_id, first_name, last_name, provider_specialty';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching patients: ' + err);
      res.status(500).json({error: 'Failed to retrieve providers' });
      return;
    }
    res.json(result);//send the results back as JSON
  });
});

// Question 3 goes here
// GET endpoint to retrieve patients by first name
app.get('/patients', (req, res) => {
  const { first_name } = req.query; // Get the first_name query parameter

  // If first_name is not provided, return an error
  if (!first_name) {
    return res.status(400).json({ error: 'Please provide a first name to filter by' });
  }

  // SQL query to select patients by first name
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

  // Execute the query
  db.query(query, [first_name], (err, results) => {
    if (err) {
      console.error('Error fetching patients: ' + err);
      res.status(500).json({ error: 'Failed to retrieve patients' });
      return;
    }

    // If no patients are found, return a message
    if (results.length === 0) {
      res.status(404).json({ message: 'No patients found with that first name' });
    } else {
      res.json(results); // Send the filtered results back as JSON
    }
  });
});

// Question 4 goes here
//GET endpoint that retrieves all providers by their specialty
app.get('/providers', (req, res) => {
  const { specialty } = req.query; // Get the specialty query parameter

  // If specialty is not provided, return an error
  if (!specialty) {
    return res.status(400).json({ error: 'Please provide a specialty to filter by' });
  }

  // SQL query to select providers by specialty
  const query = 'SELECT provider_id, first_name, last_name, specialty FROM providers WHERE specialty = ?';

  // Execute the query
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error fetching providers: ' + err);
      res.status(500).json({ error: 'Failed to retrieve providers' });
      return;
    }

    // If no providers are found, return a message
    if (results.length === 0) {
      res.status(404).json({ message: 'No providers found with that specialty' });
    } else {
      res.json(results); // Send the filtered results back as JSON
    }
  });
});

// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})