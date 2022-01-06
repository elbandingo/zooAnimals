//how i completed this module
//1 - first initialize npm with npm init -y
//2 - installed express using npm i express
//3 - required express, and assigned app to the require
//4 - declared an object called animals where its data is equal to the json data in animals.json
//5 - started the app listener to run on port 3001




const express = require('express');
const app = express();
const { animals } = require('./data/animals.json');

//creating a filter function
function filterByQuery(query, animalsArray) {
    //case if they include multiple query parameters in the form of an array
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if(query.personalityTraits){
        //first check typeof is string, if so, pass through the string to the array else, save the multiple queried values to the array
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits
        }
    }

    //then, we must loop through each of the traits
    personalityTraitsArray.forEach(trait => {
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
    });

    //case if they only add in 1 parameter or filter/query
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);  
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}


//adding a route to the animals object
app.get('/api/animals', (req, res) => {
    let results = animals;
    //if the query result in the URL is true or matches, run the filter function to set values
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//start the listener for express
app.listen(3001, () => {
    console.log(`API SERVER RUNNING ON PORT 3001!`);
});