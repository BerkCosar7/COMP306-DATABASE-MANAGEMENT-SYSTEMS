
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

// Enable CORS
app.use(cors());

// Configure body-parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'berkco',
  password: 'Kabatasyatili18!',
  database: 'world',
});


function contains(val, col_name, table_name) {
  const query = `SELECT COUNT(*) as count FROM ${table_name} WHERE ${col_name} = ?`;

  return new Promise((resolve, reject) => {
    pool.query(query, [val], function(err, result) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const count = result[0].count;
        const found = count > 0;
        resolve(found);
      }
    });
  });
}



function diff_lang(country1, country2) {
  const query = `SELECT DISTINCT (cl.Language)
  FROM country as c1
    JOIN countrylanguage as cl1
    ON c1.Code = cl1.CountryCode
    JOIN country as c2
  WHERE c2.Name = "${country1}" and c2.Name != "${country2}" and c1.Name != "${country2}'
  )`;

  return new Promise((resolve, reject) => {
    pool.query(query, function(err, result) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const diffLangs = result.map(row => row.language);
        resolve(diffLangs);
      }
    });
  });
}


 function diff_lang_join(country1, country2){
   //i implement this into app.get part directly
}


 function aggregate_countries(agg_type, country_name) {
  //i implement this into app.get part directly
}

function find_min_max_continent() {
  const query = `
    SELECT c1.continent,
           c1.name AS min_country,
           c1.lifeexpectancy AS min_exp,
           c2.name AS max_country,
           c2.lifeexpectancy AS max_exp
    FROM country c1
    JOIN (SELECT continent, MIN(lifeexpectancy) AS min_exp, MAX(lifeexpectancy) AS max_exp
      FROM country
      GROUP BY continent)
      c ON c1.continent = c.continent AND c1.lifeexpectancy = c.min_exp
      JOIN country c2 ON c.continent = c2.continent AND c2.lifeexpectancy = c.max_exp
  `;
  
  return new Promise((resolve, reject) => {
    pool.query(query, function(err, result) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


function find_country_language(percentage, language) {
  const query = `
  SELECT country.name, countrylanguage.language as language_name, MAX(countrylanguage.percentage) as max_percentage
  FROM country
  JOIN countrylanguage ON country.code = countrylanguage.countrycode
  WHERE countrylanguage.language = ?
  GROUP BY country.name, language_name
  HAVING MAX(countrylanguage.percentage) >= ?
  `;

  return new Promise((resolve, reject) => {
    pool.query(query, [language, percentage], (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function find_country_count(amount) {
  const query = `
    SELECT 
      country.name as country_name,
      MAX(country.lifeexpectancy) as max_life_expectancy,
      country.continent as continent_name
    FROM 
      city 
      JOIN country ON city.countrycode = country.code
    GROUP BY 
      country.code 
    HAVING 
      COUNT(*) > ?
    ORDER BY 
      continent_name
  `;

  return new Promise((resolve, reject) => {
    pool.query(query, [amount], (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const rows = result.map(row => [row.country_name, row.continent_name, row.max_life_expectancy]);
        resolve(result);
      }
    });
  });
}


app.get('/getDiffLang',(req,res) =>{
  
const {country1, country2} = req.query;
pool.query(`SELECT DISTINCT cl.language
FROM countrylanguage cl
JOIN country c ON c.code = cl.countrycode
WHERE c.name = '${country1}'
AND cl.language NOT IN (
  SELECT DISTINCT cl2.language
  FROM countrylanguage cl2
  JOIN country c2 ON c2.code = cl2.countrycode
  WHERE c2.name = '${country2}'
)
`,[country1, country2],(error,results) => {
  if(error) throw error;
  res.send(results);
})

});


app.get('/getDiffLangJoin', (req, res) => {
    
  const {country1, country2} = req.query;
  pool.query(`
  SELECT DISTINCT cl.language
  FROM countrylanguage cl
  JOIN country c ON c.code = cl.countrycode
  WHERE c.name = '${country1}'
  AND cl.language NOT IN (
    SELECT DISTINCT cl2.language
    FROM countrylanguage cl2
    JOIN country c2 ON c2.code = cl2.countrycode
    WHERE c2.name = '${country2}'
  )`
  ,[country1, country2],(error,results) => {
    if(error) throw error;
    res.send(results);

  }) 
});


app.get('/aggregateCountries', (req, res) => {
  const { operation, country } = req.query;

  pool.query(
    `SELECT name,lifeexpectancy
     FROM country
     WHERE lifeexpectancy > (
       SELECT ${operation}(lifeexpectancy)
       FROM country
     ) AND lifeexpectancy < (
       SELECT lifeexpectancy
       FROM country
       WHERE name = ?
     )`,
    [country],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});




app.listen(3000, () => {
  console.log('Server running on port 3000');
});



//testing for the non-GUI functions


contains("AFK", "countryCode", "city").then(result => {  //should return False
  console.log("Question1");
  console.log(result);
  
}).catch(error => {
  console.error(error);
});

contains("AFG", "countryCode", "city").then(result => {  // should return True
  console.log("Question2");
  console.log(result);
}).catch(error => {
  console.error(error);
});


find_min_max_continent().then(result => { 
  console.log("Question3"); 
  console.log(result);
}).catch(error => {
  console.error(error);
});


find_country_language(85,"Turkish").then(result => {  
  console.log("Question4");
  console.log(result);
}).catch(error => {
  console.error(error);
}); 


find_country_count(100).then(result => { 
  console.log("Question5"); 
  console.log(result);
  
}).catch(error => {
  console.error(error);
});

