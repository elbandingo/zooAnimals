//how i completed this module
//1 - first initialize npm with npm init -y
//2 - installed express using npm i express
//3 - required express, and assigned app to the require
//4 - declared an object called animals where its data is equal to the json data in animals.json
//5 - started the app listener to run on port 3001
const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
//use the below to parse the data when incoming
app.use(express.urlencoded({extended:true}));
//parse incoming JSON data
app.use(express.json());
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

    //then, we must loop through each of the traitss
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

//function to find by ID
function findById(id,animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

//create a function to create a new animal
function createNewAnimal(body, animalsArray) {
    console.log(body);
    const animal = body;
    //main function code here, updating the animals array first before sending it to the POST request
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'), JSON.stringify({animals: animalsArray}, null, 2)
    );
    //return the result of the finished code for the post result
    return animal;
}

//create function to validate animal inputs
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }

//adding a route to the animals object
app.get('/api/animals', (req, res) => {
    let results = animals;
    //if the received request includes a query in the address bar, run the filter function to set values
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//add a route to get the animals by ID
app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//start the listener for express
app.listen(PORT, () => {
    console.log(`API SERVER RUNNING ON PORT ${PORT}!`);
});

//set up a post route for animals being entered
app.post('/api/animals', (req,res) =>{
//set an ID based on what the next index of the animals array will be (the index of 0 but ID is 1, so going length is perfect for incrementing)
req.body.id = animals.length.toString();

//if any data in request is incorrect, send 400 back
if(!validateAnimal(req.body)) {
    res.status(400).send('The Animal is not properly formatted');
} else {
//add the animal to the JSON file and the animals array
const animal = createNewAnimal(req.body,animals);
res.json(animal);
}
});