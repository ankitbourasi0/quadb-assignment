const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Supabase connection details (replace with your actual credentials)
const supabaseUrl = 'https://qsrbagiitavjohjsyjao.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcmJhZ2lpdGF2am9oanN5amFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk4NTQ5MTMsImV4cCI6MjAzNTQzMDkxM30.IMzP-xFq5bU9hmOiG6x3WQPcY4T0hXRLS2viUEgPgWE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableName = 'tickers'; // Replace with your desired table name

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow requests from your React app's origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});
async function fetchTopTickers() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;

    // Sort data by last price (descending) and select top 10
    const top10Data = Object.values(data).sort((a, b) => b.last - a.last).slice(0, 10);
    console.log(top10Data);
    // Prepare data for Supabase insertion
    const formattedData = top10Data.map((ticker) => ({
      name: ticker.name,
      last: ticker.last,
      buy: ticker.buy,
      sell: ticker.sell,
      volume: ticker.volume,
      base_unit: ticker.base_unit,
    }));

    // Insert data into Supabase
    const { error } = await supabase.from(tableName).insert(formattedData);
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully');
    }
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
}


app.get('/api/tickers', async (req, res) => {
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      res.status(500).send('Error retrieving data');
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Error retrieving data');
  }
});


// Call this function once to fetch and store initial data (optional)
// fetchTopTickers();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
                    
  