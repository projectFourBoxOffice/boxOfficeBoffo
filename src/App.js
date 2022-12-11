// PSEUDO CODE
// Create a search input bar for the user where he can type in a year to look for movies that match that year
// On submit, get all the data from the API (tmdb API), which means calling the asynchronous function in the submit handler (created underneath the async function)

// API call:
// before the return/JSX:
    // IMPORTING:
    // import useState (for all our states in our API call, but also firebase), useEffect (for our firebase data), the firebase app and the database properties (that we use later on like database, ref, push, remove etc)
    // use useState to store the specific data from the API to later return it in the JSX and also pass in as props to the other components, also possibly for conditions, for example when the user has submitted, create a state for that, than can later be used for ternary operators when wanting to choose what to return in the JSX based on whether the user has submitted or not (the default value would be false)
    // above the async function create states and set their default values either to an empty string or false, which get changed later on either in the event handler functions or in the async function itself (can be used later on as props to pass into other components)
    // async function for fetch call:
        // create the asynchronous function to get the data from the API with the necessary URLSearch params, use the movie/discover endpoint movie/discover found at the API docs at https://developers.themoviedb.org/3/discover/movie-discover to get the title and the movie displayed onto the page based on the user query (this endpoint allows the user to search for a movie by release year, i.e. accepst the property release_year as a query). Set the release_year param in the URL Search Params equal to the userSearchInput state, which gets updated in the handleSearchChange event listener function underneath the asynchronous function (along with the submitted state in the handleSearchSubmit event listener function). For limiting the results between May 1st and September 4th (inclusive), create if statements regarding the release_date property of our API data object (if the release date contains numbers not representing the included months don't show it/skip over it)
        // error handling: 
            // if the query doesn't yield any results, i.e. the user makes a typo, display an error message that says no movies found. Make sure it's a year like 2010 for example.
            // for that set up a searchError state above (default value set to false since there is no error yet) and use try catch in the async function: write an if statement inside the try block that checks if there is an error, then set the searchError state to false (since we still want to try to not have an error); then inside the catch, set the searchError state to true, so that we can later display an error message in our return based on the condition whether the searchError state and the submitted state is set to true (with ternary operator)

// handling events - event listener functions:
    // create a handleSearchChange event listener function, that controls the input by updating the userSearchInput state to e.target.value (the value of the targeted input).
    // create a handleSearchSubmit function/event listener to listen for when the user has submitted the search input, also where the asynchronous function getMovies() gets called (in this case also set the submitted state to true)

// set up different components where the JSX gets rendered: one for the search form called SeachForm, then another one for the displaying the movies called DisplayMovies and another one for the user list called UserList, make sure to import those into App.js
// pass in the created states in the App.js as props into those components and functions

// Firebase:
// create an app in firebase, then use the functions and configuration provided by Firebase and paste that into a firebase.js file (not a component), along side that create a const variable called app that holds the initializeApp(firebaseConfig)
// then import that app from firebase.js into App.js, as well as the getDatabase, ref, onValue, push and remove from firebase/database to use them later on (removing movies from a list, pushing movies/other data into the database etc)
// set up a stateful variable for the movies that get added to the prediction list called predictionList and set its default value to an empty array
// write a useEffect that takes in an anonymous function as an argument, as well as an empty dependency array so that we only have it rendered once (and it doesn't turn into an infinite loop)
// in that function we store our database from firebase and the dbRef, by setting up variables that hold those values
// then we use onValue which takes in the dbRef variable as an argument, as well as an anonymous function with a response parameter
// there we define our data object that is equal to the value of our response parameter (use the .val() method for that)
// then we create an empty array that will hold our 10 movie items
// then we loop through our data object with a for in loop, where we will define a key variable and push that key into the empty array of objects (key: key and name: data[key]) (use .push)
// ouside of the onValue, update the state of the predictionList to hold the newly created array with the pushed items

// since we have now have another form for the predictionList, create another event handler function for both the user input changes and the submit, in order to differentiate them from the previous event handlers used for the API data and the movie search, give them different names, like handleListSubmit and handleListChange.
// also set up a different state for the user input in the list, called the userListInput (empty default value) that gets an updated value of the e.target.value inside the handleListChange event handler

// in order for the user to be able to remove the list items, create a function for that called handleRemoveMovie which takes in the movieId as a parameter and define the database and the dbRef variables again, this time though add in the movieId to the database variable (database, `/${movieId}`)
// then remove the dbRef from the database (remove())
// gets called later in an anonymous function inside the onClick of the remove button

// inside the return in order to display the list items to the page use map to loop through the movie list iems
// would have used an ordered list ol, but since the user has to have the control over the order of his movie items (sorted from highest grossing to lowest), we have to use a ul that has the default bullet points removed (css), and add an li that contains the movie title from the data from the API (which the user has selected) and a dropdown menu containing those numbers (1-10), for each list item.
// so inside the map the li with the title and the dropdown menu is included (we include the remove button where the movies from the API data are actually displayed, not in the prediction list itself)

// for adding a movie item to a list, display the button with a plus sign where the movies are displayed, for each individual movie result
// use an onClick and a addHandleClick event listener function, that lets the user add a movie to his prediction list
// inside the addHandle click event handler define the database and dbRef variables again with the same values as in the useEffect, and then push the updated handleListInput as well as the dbRef variable into the database
// then for removing a movie, create another button with a minus sign also displayed together with the movie results for each movie and have an onClick attribute for that that takes in an anonymous function that calls the handleRemoveMovie function in order to let the user remove the movie

// App.js

import { useState } from 'react';
// importing components
import SearchForm from './SearchForm.js';
import DisplayMovies from './DisplayMovies.js';

import './App.css';

function App() {

  const [userSearch, setUserSearch] = useState("");
  const [searchSubmit, setSearchSubmit] = useState(false);
  // setting the default value of our movie state to an empty array since the necessaray data from our API for our movies   is inside an array of objects called results (the results array is inside our data object, along with the properties total_pages, page and total_results)
  const [movies, setMovies] = useState([]);
  // data from API that gets passed as props to DisplayMovies component 
  
  const [userLength, setUserLength] = useState(0);

  // async function getMovies to make the API call (calling that function in the submit handler)
  const getMovies = async () => {
    // using the discover/movie endpoint in order to get the movie data with the year property and without the required query param (in the movie/search endpoint the query param would be a requirement which we don't want in our case, the user is looking for movie titles based on the release_year and not the other way around)
   
    const url = new URL('https://api.themoviedb.org/3/discover/movie');
    
    // Search PARAMS
      url.search = new URLSearchParams({
      api_key: 'b236a86e23557d3a2afde767ae0ab5db',
      // setting the release year equal to the user search input allows us to only show movies that match the release year that the user searched for 
      primary_release_year: userSearch,
      include_adult: false,
      include_video: false,
      // might use that later to compare highest revenue with user guess 
      // sort_by: 'revenue.desc',
      language: 'en-US',
      page: 1
      // no need for query property since that would be restricted to input type=text, which we don't want in our case
    })
    
    
    const response = await fetch(url);
    console.log(response);

    const data = await response.json();
    console.log(data);

    // in order to get the relevant data for the movie info and posters, we need to access the results array inside the data object
    const movieResults = data.results;
    console.log(movieResults);

    setMovies(movieResults);
    console.log(movies);

    // need to filter by month (getMonth()) and day of the month (use the getDate() method for that)
    // https://www.w3schools.com/jsref/jsref_getdate.asp

    // need to add in a month property to our movies array (mapping), so that we can then filter out the movies that don't fall between May (value of 4) and September (value of 8) with the .filter method (since our data comes in a array of objects)
    
    // for filter: conditions that need to pass in our results array in order to display movies: only released between May 1st and September 4th ((inclusive, so that means: month values greater than or equal to 4 and less than or equal to 8), and date value for the month of september (8) less than or equal to 3)
    // use filter for that

    // Future:
    // another problem we might have to tackle: the API only lets us only use 1 page with a maximum of 20 results per page and if fe want to use another page we have to make another fetch call, problematic since with our filtering there are gonna be less movies that are gonna match our conditions (not that they don't exist, they just aren't on that particular page, have to specify that in the search params, also: how do we know which page would have at least 10 movies that match our conditions?)
  }

  // submit handler for search form
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // calling the async function getMovies with the API call, so that movies only show up once the user searches for a year
    getMovies();
    
    // setting userSubmit to true since the user is submitting the form (using that as a condition later in the return/JSX)
    
    setSearchSubmit(true);
  
      
  }

  // handles input change, setting the userSearch state equal to the value of the targeted input
  const handleSearchInput = (event) => {
    setUserSearch(event.target.value);
    setUserLength(userSearch.length);
    // setSearchSubmit(false);
  }
  

  return (
    <div className="App">
      <header>
        <h1>Box Office Boffo</h1>
      </header>
      {/* form for the user to search for movies matching a release year */}
      <SearchForm 
        handleSearchSubmit={handleSearchSubmit}
        handleSearchInput={handleSearchInput}
        userSearch={userSearch}
      />
      {/* <form onSubmit={handleSubmit}>
        <label htmlFor="userSearch">Search a year</label>
        <input type="number" 
        placeholder="2019" 
        onChange={handleInput}
        id="userSearch"
        value={userSearch} 
        required
        />
        <button type="submit">Submit</button>
      </form> */}

      {/* only show the list of movie images and titles when the user has submitted the form */}
      {
        searchSubmit ?
        <DisplayMovies 
          movies={movies}
        />
        : null
      }
      
      {/* { 
      searchSubmit ?
      <ul> */}
        {/* mapping through our movies state (results array) to display all the movie posters, titles and release dates onto our page; mapping through our filtered array so that only the summer movies get shown (conditions defined in the filter method inside our jsx) */}
        {/* {movies.map((movie) => ( */}
          {/* // giving our list item a unique key with the id property from our array */}
          {/* <li key={movie.id}>
            {
              movie.poster_path ?
              <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={`Movie poster for ${movie.original_title}`}
              />
              : 
              <img src={MoviePlaceholder} alt={`Placeholder poster for ${movie.original_title}`} />
            }
            
            <p>{movie.original_title}</p> */}
            {/* displaying release_date so that user knows/we know that it's really only showing the movies from that year (trust but verify)*/}
            {/* <p>{movie.release_date}</p>           
          </li>
          ))
        }
      </ul>
      : null
      } */}
      
    </div>
  );
}

export default App;
