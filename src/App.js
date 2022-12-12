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

// importing firebase
import app from './firebase.js';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';

import { useState } from 'react';
// importing components
import SearchForm from './SearchForm.js';
import DisplayMovies from './DisplayMovies.js';


import './App.css';

function App() {
  // state for the user input from the search bar (set to empty string by default)
  const [userSearch, setUserSearch] = useState("");
  // state for when the user has submitted the search form (default value false)
  const [searchSubmit, setSearchSubmit] = useState(false);
  // setting the default value of our movie state to an empty array since the necessaray data from our API for our movies   is inside an array of objects called results (the results array is inside our data object, along with the properties total_pages, page and total_results)
  // data from API that gets passed as props to DisplayMovies component 
  // will get values of the results array from our object
  const [movies, setMovies] = useState([]);
  // will get the our new array (copied results array) with new month, day_of_month and year properties to use as filtering conditions
  // const [allMovies, setAllMovies] = useState([]);
  // state for the filtered movies array, to only show movies released between May 1st and Sept 4 (inclusive), and possibly only movies with the original language equal to English (in order to avoid possible mishaps with the include_adult param)
  const [filteredMovies, setFilteredMovies] = useState([]);
  // state for 
  const [allFilteredMovies, setAllFilteredMovies] = useState([]);

  // year state to use for later so that the user knows what year he searched for the summer movies (since user input gets cleared after each submission, needed to find a different alternative to display it onto the page when the user has already submitted), gets value inside the filtering of the copy of the all movies array since if it were done during the mapping of the all movies array, it wouldn't have a value yet (can't do it after the return statement)
  const [movieYear, setMovieYear] = useState("");


  // let variables to use for the while loop
  // counter for page param, default value 0 (gets increased in the while loop)
  let counter = 0;

  // define an array (empty at first) to then later store the copy of the filtered array inside the while loop (avoid direct mutation), also will hold the values from the results of multiples pages (if necessary)
  let allFilteredArray = [];

  // async function getMovies to make the API call (calling that function in the submit handler)
  const getMovies = async () => {
    // using the discover/movie endpoint in order to get the movie data with the year property and without the required query param (in the movie/search endpoint the query param would be a requirement which we don't want in our case, the user is looking for movie titles based on the release_year and not the other way around)
   
    const url = new URL('https://api.themoviedb.org/3/discover/movie');
    
    // while loop to keep searching for results that match our filtered array, so that we get at least 10 summer movies for the user to add to his prediction list and sort later on
    while (true) {
      
      console.log(allFilteredArray);
      // increase the value of the counter variable by one each time a new API call is made (use that for the page param inside the search params)
      counter = counter + 1;
      console.log(counter);
      
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
        // giving the page param the value of the counter variable (value is 1 as long as there are at least 10 filtered movie items on that page, while that's not the case, keep counting until there is at least 10, so could go up to page 2 or 3)
        page: counter
        // no need for query property since that would be restricted to input type=text, which we don't want in our case
      })
    
      // our response and data objects
      const response = await fetch(url);
      // console.log(response);
      const data = await response.json();
      // console.log(data);

      // in order to get the relevant data for the movie info and posters, we need to access the results array inside the data object
      const movieResults = data.results;
      console.log(movieResults);

      // store that results array into the movies state
      setMovies(movieResults);
      // console.log(movies);

      // need to filter by month (getMonth()) and day of the month (use the getDate() method for that)
      // https://www.w3schools.com/jsref/jsref_getdate.asp

      // need to add in a month property to our movies array (mapping), so that we can then filter out the movies that don't fall between May (value of 4) and September (value of 8) with the .filter method (since our data comes in a array of objects)
      const moviesWithMonthDay = data.results.map((movie) => {
        const d = new Date(movie.release_date);
        let month = d.getMonth();
        let dayOfMonth = d.getDate();
        // year to then display it later on to the user after he has submitted the search form (can't use userSearch since the input is getting cleared upon each submission)
        let year = d.getFullYear();
        // adding in the newly created properties into our array of objects
        return {...movie, month: month, day_of_month: dayOfMonth, year: year};
        
      })
      console.log(moviesWithMonthDay);

      // put that array into our movies state in order to be able to access it in our JSX
      // setAllMovies(moviesWithMonthDay);
      // console.log(allMovies);
      
      // for filter: conditions that need to pass in our results array in order to display movies: only released between May 1st and September 4th ((inclusive, so that means: month values greater than or equal to 4 and less than or equal to 8), and date value for the month of september (8) less than or equal to 3)
      // use filter for that

      // copying the newly created array that now contains the month and day_of_month property
      const copyAllMovies = [...moviesWithMonthDay];

      // filtering through our copy of the array (avoiding direct mutation)
      const filteredMovieItems = copyAllMovies.filter((movie) => {
        // setting the movie year state with the value of the newly added year property from our moviesWithMonthDay array copy
        setMovieYear(movie.year);

        // if the month is september, only show the days of that month less than or equal to 4th (so 3, since there are only 30 days in September, so the number is less by one)
        if (movie.month === 8) {
          // decided to only return movies in English (original language English since otherwise the API doesn't always know if there is adult movies included in other languages (doesn't understand))
          return movie.day_of_month <= 3 && movie.month  >= 4 && movie.month <=8 && movie.original_language === "en";
        }
        else {
          return movie.month  >= 4 && movie.month <=8 && movie.original_language === "en";
        }
        
      })
      console.log(filteredMovieItems);
      // set the filtered movies state equal to the filtered array
      setFilteredMovies(filteredMovieItems);
      // console.log(filteredMovies);

      // pushing the copy of the filtered movie items array into our new array (so that it keeps adding new values every time the array length is less than 10)
      allFilteredArray.push(...filteredMovieItems);
      console.log(allFilteredArray);

      // putting that newly populated all filtered array into a state to then use in our return in the display movies component (so that not just the filtered movies get shown from the first page, but from all pages necessary in order to have at least 10)
      setAllFilteredMovies(allFilteredArray);
      // console.log(allFilteredMovies);

      // another problem to tackle: the API only lets us only use 1 page with a maximum of 20 results per page and if fe want to use another page we have to make another fetch call, problematic since with our filtering there are gonna be less movies that are gonna match our conditions (not that they don't exist, they just aren't on that particular page, have to specify that in the search params, also: how do we know which page would have at least 10 movies that match our conditions?)
      // solution: add a while loop that keeps calling the API to get results from more pages as long as the length of the all filtered array is less than 10 (for that define a counter let variable before the while loop that is set to 0, then inside the while loop before the search params gets increased by one, then set the page param equal to that counter value, so that results get shown from more than one page when there is not enough (less than 10) on the first page)

      // if the length of our array that contains all filtered array values is greater than or equal to 10, break the while loop (since we only want to keep adding new results to our page/API call when there is less than 10 movies available on a page, default page is 1, but this page doesn't always have enough movies that match our filtering conditions, user needs to have at least 10 movies for the prediction list)
      if (allFilteredArray.length >= 10) {
        break;
      }

    }
    // end of while loop

    // set counter back to default value 0 after while loop is done
    counter = 0;
    console.log(counter);
  }

  // submit handler for search form
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // calling the async function getMovies with the API call, so that movies only show up once the user searches for a year
    getMovies(); 
    // setting userSubmit to true since the user is submitting the form (using that as a condition later in the return/JSX)
    setSearchSubmit(true);
    // clearing the userSearch value, so that search bar gets cleared after each submission
    // maybe better not to clear the user input after submission sicne the user can use the arrows in the input to go up or down a year from the previous search input (more convenient possibly)
    // setUserSearch("");

    // setting the all filtered movies array back to an empty array, so that same movies won't be shown again for next search
    setAllFilteredMovies([]);
      
  }

  // handles input change, setting the userSearch state equal to the value of the targeted input
  const handleSearchInput = (event) => {
    setUserSearch(event.target.value);
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
        movieYear={movieYear}
        searchSubmit={searchSubmit}
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
          filteredMovies={filteredMovies}
          allFilteredMovies={allFilteredMovies}
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
