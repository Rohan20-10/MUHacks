const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Movie = require('./models/movies'); // Adjust the path as necessary

// Seed function to create collections
const seedDB = async () => {
  await connectDB();

  // Drop the entire database
  await mongoose.connection.db.dropDatabase();
  console.log('Database dropped successfully');

  // Ensure collections are created by registering the models
  await Movie.init();
  // Add other models as needed

  console.log('Collections created successfully');

  // Optionally, seed some initial data
  // await seedInitialData();

  mongoose.connection.close();
};

// Optional function to seed initial data
const seedInitialData = async () => {
  const seedData = [
    {
      "Title": "The Godfather",
      "Year": "1972",
      "Rated": "R",
      "Released": "24 Mar 1972",
      "Runtime": "175 min",
      "Genre": "Crime, Drama",
      "Director": "Francis Ford Coppola",
      "Writer": "Mario Puzo, Francis Ford Coppola",
      "Actors": "Marlon Brando, Al Pacino, James Caan",
      "Plot": "The Godfather \"Don\" Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter's wedding. Michael, Vito's youngest son and a decorated WW II Marine is also present at the wedding. Michael seems to be uninterested in being a part of the family business. Vito is a powerful man, and is kind to all those who give him respect but is ruthless against those who do not. But when a powerful and treacherous rival wants to sell drugs and needs the Don's influence for the same, Vito refuses to do it. What follows is a clash between Vito's fading old values and the new ways which may cause Michael to do the thing he was most reluctant in doing and wage a mob war against all the other mafia families which could tear the Corleone family apart.",
      "Language": "English, Italian, Latin",
      "Country": "United States",
      "Awards": "Won 3 Oscars. 31 wins & 31 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_SX300.jpg",
      "Ratings": [
        { "Source": "Internet Movie Database", "Value": "9.2/10" },
        { "Source": "Rotten Tomatoes", "Value": "97%" },
        { "Source": "Metacritic", "Value": "100/100" }
      ],
      "Metascore": "100",
      "imdbRating": "9.2",
      "imdbVotes": "2,057,473",
      "imdbID": "tt0068646",
      "Type": "movie",
      "DVD": "N/A",
      "BoxOffice": "$136,381,073",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Titanic",
      "Year": "1997",
      "Rated": "PG-13",
      "Released": "19 Dec 1997",
      "Runtime": "194 min",
      "Genre": "Drama, Romance",
      "Director": "James Cameron",
      "Writer": "James Cameron",
      "Actors": "Leonardo DiCaprio, Kate Winslet, Billy Zane",
      "Plot": "84 years later, a 100 year-old woman named Rose DeWitt Bukater tells the story to her granddaughter Lizzy Calvert, Brock Lovett, Lewis Bodine, Bobby Buell and Anatoly Mikailavich on the Keldysh about her life set in April 10th 1912, on a ship called Titanic when young Rose boards the departing ship with the upper-class passengers and her mother, Ruth DeWitt Bukater, and her fiancé, Caledon Hockley. Meanwhile, a drifter and artist named Jack Dawson and his best friend Fabrizio De Rossi win third-class tickets to the ship in a game. And she explains the whole story from departure until the death of Titanic on its first and last voyage April 15th, 1912 at 2:20 in the morning.",
      "Language": "English, Swedish, Italian, French",
      "Country": "United States, Mexico",
      "Awards": "Won 11 Oscars. 126 wins & 83 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX300.jpg",
      "Ratings": [
        { "Source": "Internet Movie Database", "Value": "7.9/10" },
        { "Source": "Rotten Tomatoes", "Value": "88%" },
        { "Source": "Metacritic", "Value": "75/100" }
      ],
      "Metascore": "75",
      "imdbRating": "7.9",
      "imdbVotes": "1,308,495",
      "imdbID": "tt0120338",
      "Type": "movie",
      "DVD": "N/A",
      "BoxOffice": "$674,292,608",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True"
    }
  ];

  await Movie.insertMany(seedData);
  console.log('Seed data inserted');
};

seedDB().then(() => {
  console.log('Database seeding completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error(`Error during database seeding: ${error.message}`);
  process.exit(1);
});