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
        // create the asynchronous function to get the data from the API with the necessary URLSearch params, use the movie/discover endpoint movie/discover (instructions found in the API docs at https://developers.themoviedb.org/3/discover/movie-discover) to get the title and the movie displayed onto the page based on the user query (this endpoint allows the user to search for a movie by release year, i.e. accepst the property release_year as a query). Set the release_year param in the URL Search Params equal to the user input state, which gets updated in the handleSearchChange event listener function underneath the asynchronous function (along with the submitted state in the handleSearchSubmit event listener function). For limiting the results between May 1st and September 4th (inclusive), add if statements regarding the release_date property of our API data object and use map to invoke new properties to that array (year and month) and the filter method on a copy of the results array based on those newly added properties from the mapped array (if the release date contains numbers not representing the included months don't show it/skip over it)
        // also important: tmdB API restricts results to 20 movies per page and for each page a separate API call has to be made, especially problematic since we need to filter our results and who is going to guarantee on what page there are at least ten that meet our requirements (only from the summer season)? Use a while loop so that API calls get made as long as the length of our filtered array is less than or equal to 20 (add break, when that condition is false) and a counter that will be our page param
        // to have exactly 20 movies show up for each year, we can't add that in as a condition in the while loop directly, but we can control the length of our filtered array below the while loop, to then only change the length once we get our full array from the while loop (if statement)
        // error handling: 
          // if the query doesn't yield any results (hard to do since our input only accepts numbers between 1900 and 2022, so won't even let the user proceed to submit) or there is an issue/error with the API, display an error message
          // for that set up a searchError state above (default value set to false since there is no error yet) and use try catch in the async function: write an if statement inside the try block that checks if there is an error, then set the searchError state to false (since we still want to try to not have an error); then inside the catch, set the searchError state to true, so that we can later display an error message in our return based on the condition whether the searchError state and the submitted state is set to true (with ternary operator)

    // handling events - event listener functions:
      // create a handleSearchChange event listener function, that controls the input by updating the userSearchInput state to e.target.value (the value of the targeted input) (in that function also update the object from our database with the newly obtained user input, so that we can control that later on/display it onto the page/use it as a condition to avoid repetitions from user input)
      // create a handleSearchSubmit function/event listener to listen for when the user has submitted the search input, also where the asynchronous function getMovies() gets called (in this case also set the submitted state to true)

// set up different components where the JSX gets rendered: one for the search form called SeachForm, then another one for the displaying the movies called DisplayMovies and another one for the user list called PredictionList, make sure to import those into App.js (also Header and Footer)
// pass in the created states in the App.js as props into those components and functions

// Firebase:
// create an app in firebase, then use the functions and configuration provided by Firebase and paste that into a firebase.js file (not a component), along side that create a const variable called app that holds the initializeApp(firebaseConfig)
// then import that app from firebase.js into App.js, as well as the getDatabase, ref, onValue, push and remove from firebase/database to use them later on (removing movies from a list, pushing movies/other data into the database etc)
// set up a stateful variable for the movies that get added to the prediction list and set its default value to an empty array
// write a useEffect that takes in an anonymous function as an argument, as well as a dependency array so that we only have it rendered every time the state gets updated (movieYear) (and it doesn't turn into an infinite loop)
// in that function we store our database from firebase and the dbRef, by setting up variables that hold those values
// then we use onValue which takes in the dbRef variable as an argument, as well as an anonymous function with a response parameter
// there we define our data object that is equal to the value of our response parameter (use the .val() method for that)
// for the reference, nest the data under the movie year that the user searched for/added movies for (so pathing would be predictions/movieYear state obtained from the movie results array from API and then movies(so that key is not equal to the movieYear))
// then we create an empty array that will hold our 10 movie items
// then we loop through our data object with a for in loop, where we will define a key variable and push that key into the empty array of objects (key: key and name: data[key]) (use .push)
// outside of the onValue, update the state to hold the newly created array with the pushed items

// since we have now have another form for the predictionList, create another event handler function for both the user input changes and the submit, in order to differentiate them from the previous event handlers used for the API data and the movie search, give them different names, like handleListSubmit and handleListChange.
// also set up a different state for the user input in the list (empty default value) that gets an updated value of the e.target.value inside the handleListChange event handler

// in order for the user to be able to remove the list items, create a function for that called handleRemoveMovie which takes in the movieId as a parameter and define the database and the dbRef variables again, this time though add in the movieId to the database variable (database, `/${movieId}`)
// then remove the dbRef from the database (remove())
// gets called later in an anonymous function inside the onClick of the remove button

// inside the return in order to display the list items to the page use map to loop through the movie list iems
// would have used an ordered list ol, but since the user has to have the control over the order of his movie items (sorted from highest grossing to lowest), we have to use a ul that has the default bullet points removed (css), and add an li that contains the movie title from the data from the API (which the user has selected) and a dropdown menu containing those numbers (1-10), for each list item.
// so inside the map the li with the title and the dropdown menu is included (we include the remove button where the movies from the API data are actually displayed, not in the prediction list itself)

// for adding a movie item to a list, display an add button where the movies are displayed, for each individual movie result
// use an onClick and a addHandleClick event listener function, that lets the user add a movie to his prediction list
// inside the addHandle click event handler define the database and dbRef variables again with the same values as in the useEffect, and then push the updated handleListInput as well as the dbRef variable into the database
// then for removing a movie, create a remove button for each added movie inside the list and have an onClick attribute for that that takes in an anonymous function that calls the handleRemoveMovie function in order to let the user remove the movie
// for deleting the entire list proceed similar to removing one list item, only this time the path is different (entire movies node under movieYear)

// stretch goal: showing user actual position of predicted movie side by side
  // for that necessary to specify the sort_by param in our url search params to revenue.desc, so that we get the order from highest grossing to lowest grossing (can use index + 1 for the actual position)
  // also important to then randomize the array that gets used for displaying the movies onto the page before user submits a list (otherwise it would be easy to figure out)
  // then adding in a ranking property based on the index number with map and added (for when an item got selected, ie. the array from our database includes the value from our API) (bonus: added button now stays disabled and added even when user leaves that year without submitting)
  // filtering out only movies that match submitted movies with filter (based on added property, similar to what we did in click handler and remove click handler)
  // sorting based on whether value from API matches value from database
  // displaying that new array when user has submitted/already submitted (conditional rendering with ternary operators in our JSX)

// App.js

// importing firebase
import app from './firebase.js';
import { getDatabase, ref, onValue, push, remove, update } from 'firebase/database';

// use effect for fetching our firebase data and preventing memory leak when user leaves the page
import { useState, useEffect } from 'react';

// importing components
import Header from './Header.js';
import SearchForm from './SearchForm.js';
import DisplayMovies from './DisplayMovies.js';
import PredictionList from './PredictionList.js';
import ListSubmission from './ListSubmission.js';
import Footer from './Footer.js';

import './App.css';


function App() {
  // state for the user input from the search bar (set to empty string by default)
  const [userSearch, setUserSearch] = useState("");
  // state for when the user has submitted the search form (default value false)
  const [searchSubmit, setSearchSubmit] = useState(false);
  // setting the default value of our movie state to an empty array since the necessaray data from our API for our movies   is inside an array of objects called results (the results array is inside our data object, along with the properties total_pages, page and total_results)
  // data from API that gets passed as props to DisplayMovies component 
  // will get values of the results array from our object
  // will get the our new array (copied results array) with new month, day_of_month and year properties to use as filtering conditions

  // need to include this state to store the unfiltered data.results array from API
  const [movies, setMovies] = useState([]);
  // state for the filtered movies array, to only show movies released between May 1st and Sept 4 (inclusive), and possibly only movies with the original language equal to English (in order to avoid possible mishaps with the include_adult param)
  const [allFilteredMovies, setAllFilteredMovies] = useState([]);

  // year state to use for later so that the user knows what year he searched for the summer movies (since user input gets cleared after each submission, needed to find a different alternative to display it onto the page when the user has already submitted), gets value inside the filtering of the copy of the all movies array since if it were done during the mapping of the all movies array, it wouldn't have a value yet (can't do it after the return statement)
  const [movieYear, setMovieYear] = useState("");
  const [userMovies, setUserMovies] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [listSubmit, setListSubmit] = useState(false);
  const [limitClick, setLimitClick] = useState(false);
  const [ratedList, setRatedList] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [faultySubmit, setFaultySubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const [moviePositions, setMoviePositions] = useState([]);
  const [showClicked, setShowClicked] = useState(false);
  // hashmap for individual button target
  // state clickedIds
  const [clickedIdsHashMap, setClickedIdsHashMap] = useState(new Map());

  // empty array for the user movie ids (using for later to compare if that array contains current id of the movie chosen by the user)
  let movieIdsArray = [];

  // creating an empty array to store each user input from dropdown to ensure correct submission
  // data seems to be a bit out of sync (lagging by one)
  let ratingArray = []; 

  // titles user chose array
  let userTitleArray = [];
  let correctRanking = [];

  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const [dataCounter, setDataCounter] = useState(0);

  // error state
  const [searchError, setSearchError] = useState(false);

  // let variables to use for the while loop
  // counter for page param, default value 0 (gets increased in the while loop)
  let counter = 0;

  // define an array (empty at first) to then later store the copy of the filtered array inside the while loop (avoid direct mutation), also will hold the values from the results of multiples pages (if necessary)
  let allFilteredArray = [];

 // defining an empty array for randomizing results (for displaying movies before user user submits)
  let copyFilteredAddedMovies = [];

  // defining an empty array for movies with added and ranking property as well only for movies that match data from database
  let listedPositions = [];

  // submit handler for search form
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // calling the async function getMovies with the API call, so that movies only show up once the user searches for a year (passing in the allFilteredMovies array as an argument to not have a rerender of the other state used for our comparison later on when the user has submitted a list)
    getMovies(allFilteredMovies);

    // setting userSubmit to true since the user is submitting the form (using that as a condition later in the return/JSX)
    setSearchSubmit(true);
    setListSubmit(false);
    
    if (submitted) {
      setLimitClick(true);
    }
    setLimitClick(false);

    // setting the all filtered movies array back to an empty array, so that same movies won't be shown again for next search
    setAllFilteredMovies([]);
  }

  // async function getMovies to make the API call (calling that function in the submit handler)
  const getMovies = async () => {
    try {
    // using the discover/movie endpoint in order to get the movie data with the year property and without the required query param (in the movie/search endpoint the query param would be a requirement which we don't want in our case, the user is looking for movie titles based on the release_year and not the other way around)
    setLoading(true);

    const url = new URL('https://api.themoviedb.org/3/discover/movie');
    
    // while loop to keep searching for results that match our filtered array, so that we get at least 10 summer movies for the user to add to his prediction list and sort later on
    while (true) {
      
      // increase the value of the counter variable by one each time a new API call is made (use that for the page param inside the search params)
      counter = counter + 1;
      
      // Search PARAMS
      url.search = new URLSearchParams({
        api_key: 'b236a86e23557d3a2afde767ae0ab5db',
        // setting the release year equal to the user search input allows us to only show movies that match the release year that the user searched for 
        primary_release_year: userSearch,
        include_adult: false,
        include_video: false,
        language: 'en-US',
        // sorting by revenue descending in order to be able to display actual positions of predicted movies upon list submission (have to randomize for the array that gets displayed initially)
        sort_by: 'revenue.desc',
        // giving the page param the value of the counter variable (value is 1 as long as there are at least 10 filtered movie items on that page, while that's not the case, keep counting until there is at least 10, so could go up to page 2 or 3)
        page: counter
      })

    
      // our response and data objects
      const response = await fetch(url);
      const data = await response.json();

      const movieResults = data.results;
      setMovies(movieResults);

      // setting loading to false once API data is received
      setLoading(false);
      
      // need to filter by month (getMonth()) and day of the month (use the getDate() method for that)
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
      
      // for filter: conditions that need to pass in our results array in order to display movies: only released between May 1st and September 4th ((inclusive, so that means: month values greater than or equal to 4 and less than or equal to 8), and date value for the month of september (8) less than or equal to 3)

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

      // pushing the copy of the filtered movie items array into our new array (so that it keeps adding new values every time the array length is less than 10)
      allFilteredArray.push(...filteredMovieItems);

      // mapping through that filtered array to give it a ranking (based on index since this array is still sorted by revenue descending and not randomized yet (also added property to use for filtering))
      const filteredAddedMovies = allFilteredArray.map((movie, index) => {
        let ranking = index + 1;
        if (userTitleArray.includes(movie.original_title)) {
          let added = true;
          return {...movie, added: added, ranking: ranking};
        }
        return {...movie, ranking: ranking};
      })

      copyFilteredAddedMovies = [...filteredAddedMovies];

      // adding filter to our array to only return movies that the user chose to submit for comparison of actual ranking in terms of revenue
      listedPositions = filteredAddedMovies.filter((movie) => {
        // making sure to also set the state of the movie year inside this array, for when only the movie positions state gets passed as an argument when calling the async function in the event handlers (showlist)
        setMovieYear(movie.year);
        return movie.added === true;
      })

      // sorting the listed positions array based on order of matching values of titles between data from firebase (what user selected) and movie titles from API 
      listedPositions.sort((a, b) =>
        userTitleArray.indexOf(a.original_title) - userTitleArray.indexOf(b.original_title)
      );

      // updating the movie positions state with the newly mapped array containing our ranking property (not randomized yet) and added property
      setMoviePositions(listedPositions);

      // if the length of our array that contains all filtered array values is greater than or equal to 10, break the while loop (since we only want to keep adding new results to our page/API call when there is less than 10 movies available on a page, default page is 1, but this page doesn't always have enough movies that match our filtering conditions, user needs to have at least 10 movies for the prediction list)
      if (copyFilteredAddedMovies.length >= 20) {
        break;
        // set counter back to default value 0 after while loop is done
      }
    } 
    if (copyFilteredAddedMovies.length > 20) {
      copyFilteredAddedMovies.length = 20;
    }
    // randomizing the order of movies (copy of the mapped array) displayed onto the page since the data is sorted by revenue descending, so it would be too much of a giveaway to not have the order randomized (still need the sorted by revenue param for displaying the actual positions) (at the bottom to ensure only movies show up that are included in that array length of 20)
    const randomizedMovies = copyFilteredAddedMovies.sort(() => 0.5 - Math.random());
    setAllFilteredMovies(randomizedMovies);

    // setting the counter variable back to 0
    counter = 0;

    // error handling of API
    if (searchError) {
      setSearchError(false);
    }
   }
   catch (error) {
    setSearchError(true);
   }
  }
 

  // defining a counter for each time data gets pushed, updating that counter's value inside the for in loop of our state array containing our data object from firebase (like this we can determine whether the user has already added a movie in that particular year, starts anew for each year and also updates accordingly when item gets removed)
  let addCounter = 0;
      
  // loop through the user movies state that has our object with the ids of the movies that the user selected to then push them into a new array
  // this then allows us to compare if an id is already included in the array, which then helps us avoid repetitions of the user selection, ie. the user can't add the same movie twice to his list 
  for (let i in userMovies) {
    // populating our empty array with the movie ids from the movies that the user has chosen to add to his list in order to ensure that there are no duplicates on the list (also important for disabling/changing the text of only the selected buttons)
    movieIdsArray.push(userMovies[i].userMovieId);

    // pushing the new rating property of each object from our database into a new array to then use later on to compare whether the array includes undefined values and duplicate values from the user input
    ratingArray.push(userMovies[i].rating);
    addCounter = addCounter + 1;
    
    userTitleArray.push(userMovies[i].userMovieTitle);
    correctRanking.push(userMovies[i].movieRank);
  }

  const updatedMovies = allFilteredMovies.map((movie) => {
    return {...movie, idsArray: movieIdsArray, titleArray: userTitleArray};
  })
  
  // click handler for adding a movie to the prediction list
  // passing in movieRank property obtained from map function in displayMovies component (pushing that to firebase to then have a comparison between the user rating and the actual ranking of the selected movie (more for score count))
  const handleClick = (e, movieRank) => { 
    setDataCounter(addCounter);
    setAllFilteredMovies(updatedMovies);

    // update the data array from the API with added property set to true every time that particular movie is the same as the targeted event value
    const comparedMovies = updatedMovies.map((movie) => {
      if (movie.original_title === e.target.value) {
        let added = true;
        return {...movie, added: added};
      }
      return movie;
    })
    // updating the state to then use the added property inside the map function in the displayMovies component
    setAllFilteredMovies(comparedMovies);
    
    // updating the values of our states, in order to use them then as conditions inside our return
    setClicked(true);
    setSearchSubmit(true);
    setListSubmit(false);
    setSubmitAttempt(false);
    setDeleted(false);
    setFaultySubmit(false);

    // firebase
    const database = getDatabase(app);

    // nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
    // this seems to have solved the different lists per year issue
    const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
    
    // now we're adding the matching id and value (title and movie id into our database)
    const userMovieTitle = e.target.value;
    const userMovieId = e.target.id;
        
    // defining our object that we are going to push into our database
    const listedMovie = {
      userMovieTitle,
      userMovieId,
      movieRank
    }

    // calling the hash map function
    // pass in the user movie id (id of the movie the user has chosen to add to his list) and the targeted event (the add button) as arguments inside that function to then use that for later when removing the items from the list and setting the disabled property back to false for each time the user has chosen to remove the item from the list (not just for one button)
    updateClickedIdsHashMap(userMovieId, e.target);

    // only pushing the selected movie by the user to our database if the selected movie's id doesn't repeat itself and there are less than 10 items (so that user can only add 10 items to his list)
    if (!movieIdsArray.includes(userMovieId) && movieIdsArray.length <= 10) {
      // pushing our object into our database, while at the same time storing that inside a variable to then use in order to access our key from firebase (using that for when we map through our state userMovies containing all the data later on)
      push(predictionRef, listedMovie);
    }
        
    if (userMovies.length >= 9 && !movieIdsArray.includes(userMovieId)) {
      setLimitClick(true);
    }

    // set the disabled property of the current targeted event (in this case the currently clicked button by the user) to true in order to only disable one button out of all the add buttons for each movies (that are inside the map function)
    e.currentTarget.disabled = true;
  }

  // click handler for remove button (for each single list item)
  // passing in three parameters, one for the node to remove (the path under which the whole node for each list item lives), one for the user movie id (the id of the targeted add button) and the user movie title (in order to compare the userMovieTitle from our object stored in our database with the original title of the movie from the API data)
  const handleRemoveClick = (nodeToRemove, userMovieId, userMovieTitle) => {
    const database = getDatabase(app);
    const predictionRef = ref(database, `Predictions/${movieYear}/movies/${nodeToRemove}`);
    remove(predictionRef);

    setSubmitAttempt(false);

    // comparing title of movie results array from API with the title stored in our database to then give those movies in the API object an added property (true)
    const removedMovies = updatedMovies.map((movie) => {
      if (movie.original_title === userMovieTitle) {
        // use the clickedIdsHashMap state to grab the user movie id that is also equal to the id of the add button (representing the movie choice) and set the disabled property to false (in order to undo the disabling of that individual button that happens when the user has clicked on the movie already)
        clickedIdsHashMap.get(userMovieId).disabled = false;
        let added = false;
        return {...movie, added: added};
      }
      return movie;
    })
    setAllFilteredMovies(removedMovies);

    setLimitClick(false);

    clickedIdsHashMap.delete(userMovieId);
  }

  useEffect(() => {
    const database = getDatabase(app);
    // giving our database a reference under predictions (a bit more structured)
    // nesting our soon to be declared object (click handler) inside a collection called Predictions that contains collections of the data invoked by the user per movieYear (adding in the movie info under the specific/matching year with the reference path)
    // like this we already got the data sorted into different collections based on the year
    const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
    
    onValue( predictionRef, (response) => {
      const data = response.val();
      const newState = [];
      // array for user movie titles to then store into state
 
      for(let key in data){
        newState.push({key, ...data[key]});
      }
      // using the sort method to get the data from firebase sorted based on the rating (user input) from the user for each movie (so 1 to 10, instead of default order depending on what movie the user added first)
      newState.sort((a, b) => a.rating - b.rating);
      // update the userMovies state with the array containing our data (also sorted now)
      setUserMovies(newState);
    })
  }, [movieYear])
  

  // handles input change, setting the userSearch state equal to the value of the targeted input
  const handleSearchInput = (event) => {
    setUserSearch(event.target.value);
  }

  // hashmap function in order to disable only selected buttons (new Map constructor function)
  // k for key, v for value
  const updateClickedIdsHashMap = (k,v) => {
    setClickedIdsHashMap(new Map(clickedIdsHashMap.set(k,v)));
  }
 
  // handle user input change from dropdown inside the prediction list
  // passing in the event object and the key property taken from our map in the prediction list component as parameters inside our input change handler to update the object in our database at the right location
  const handleMovieRating = (e, key) => {
    setUserRating(e.target.value);
    setSubmitAttempt(false);
    
    // defining an object with a rating property to update our object in our database with that new property
    // like this we can store each one of those user input values in an array (while looping through our state containing those objects) and then determine whether there are undefined values included (ie. when the user hasn't even touched the dropdown) and whether there are values that repeat themselves (setting up conditions based on that later on for list submission)
    const userInput = {
      rating: e.target.value
    }

    const database = getDatabase(app);

    // nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path)
    const predictionRef = ref(database, `Predictions/${movieYear}/movies/${key}`);
    update(predictionRef, userInput);
  }

  
  // click handler for list submission
  const handleListSubmit = (userMovies) => {
    // storing the array containing the input values of each dropdown in a state array in order to use it as a prop in the prediction list component (for conditions, other states here for invalid input and repetition were behind by one number, so displayed messages weren't accurate)
    setRatedList(ratingArray);

    // updating the states that we will use as conditions to determine whether to show the prediction list or not (or the submit message)
    setSubmitAttempt(true);
    
    // checking if there are undefined or empty values inside rating array to determine whether submission is valid or not
    // using every and indexOf method to determine whether there are no duplicates inside the array (iterative)
    // every takes in an anonymous function with the current value asa required parameter, as well as the index of the current element and the array of that element as optional parameters, that returns the first index of the current value inside the array (in our case the ratingArray with the user input from the dropdown) and checks whether that first index of the current value is the same as the index(or indices) of that value (if the first index is not the same as the other index/indices, that means that the same value is also positioned at another index, which means it is duplicated)
    // only true if all elements passed the test (ie. no element repeats itself (true); if at least one repeats itself, then it returns false)
    if (userMovies.length === 10 && ratingArray.every((element, index, array) => array.indexOf(element) === index) === true && !ratingArray.includes(undefined) && ratingArray.length === 10){
      setListSubmit(true);
      setSearchSubmit(false);
      setFaultySubmit(false);
      // defining an object with a submitted property to update our object in our database with that new property
      // like this we can know for later if user has already submitted that list, so if that is true, we can notify the user in case he decides to come back later to the same year
      let submitted = true;

      const listSubmission = {
        submitted: submitted
      }

      const database = getDatabase(app);

      // referencing the movieYear as the last path since we don't want to have the submitted property for each movie but for each year (each list per year)
      const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
      update(predictionRef, listSubmission);
      const submissionRef =  ref(database, `Predictions/${movieYear}/${submitted}`);
      const submissionObj = submissionRef._path.pieces_[2];
      setSubmitted(submissionObj);
      setLimitClick(true);
    } 
    else if (userMovies.length !== 10 && ratingArray.every((element, index, array) => array.indexOf(element) === index) === true && !ratingArray.includes(undefined)) {
      setFaultySubmit(true);
      setSubmitted(false);
    }
  }


  // delete click handler with confirm window
  const handleConfirm = () => {
    if(window.confirm("Are you sure you want to delete this list?")) {
      const database = getDatabase(app);
      const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
      remove(predictionRef);
      setDeleted(true);
      setLimitClick(false);

      // mapping through our userMovies array with our objects from our database to set the disabled property of each item back to false
      userMovies.map((userMovieObj) => {
       return clickedIdsHashMap.get(userMovieObj.userMovieId).disabled = false;
      })

      // clearing the hash map state again when user has confirmed to delete entire list
      clickedIdsHashMap.clear();
      let addCounter = 0;
      setDataCounter(addCounter);

      const deletedMovies = updatedMovies.map((movie) => {
          let added = false;
          return {...movie, added: added};
      })
      setAllFilteredMovies(deletedMovies);

    } else {
      setDeleted(false);
    }
  }


  // click handler for show list button inside search form component for when user has added at least 1 movie to his list (or ten) and hasn't submitted his list yet
  const handleShowList = () => {
    setListSubmit(false);
    setClicked(true);
    setSearchSubmit(true);
    setShowClicked(false);
    // only calling async function again with the moviePositions state when a list was submitted for that year (to avoid unnessecary rerendering)
    if (userMovies[10]) {
      // calling the async function getMovies only with the moviePositions state as an argument to avoid rerender of filtered movies array state (with the posters)
      getMovies(moviePositions);
    }
  }

  // click handler for when user has submitted and he chooses to see the list (right upon submission)
  const handleShowSubmitted = () => {
    setClicked(true);
    setShowClicked(true);
    // calling the async function getMovies only with the moviePositions state as an argument to avoid rerender of filtered movies array state (with the posters)
    getMovies(moviePositions);
  }


  return (
    <div className="App">
      {/* skip link to main*/}
      <a href="#mainContent" className="skipLink">
        Skip to main content
      </a>
      {/* header component */}
      <Header/>
      {/* main sections with components */}
      <main id="mainContent">
        {/* form for the user to search for movies matching a release year */}
        <SearchForm 
         handleSearchSubmit={handleSearchSubmit}
         handleSearchInput={handleSearchInput}
         userSearch={userSearch}
         movieYear={movieYear}
         searchSubmit={searchSubmit}
         loading={loading}
         listSubmit={listSubmit}
         userMovies={userMovies}
         handleShowList={handleShowList}
         searchError={searchError}
         allFilteredMovies={allFilteredMovies}
       />

       {/* only show the list of movie images and titles when the user has submitted the form */}
       {
        searchSubmit && listSubmit === false ?
        <DisplayMovies 
          allFilteredMovies={allFilteredMovies}
          movies={movies}
          handleClick={handleClick}
          limitClick={limitClick}
          handleRemoveClick={handleRemoveClick}
          deleted={deleted}
          userMovies={userMovies}
          loading={loading}
          dataCounter={dataCounter}
          listSubmit={listSubmit}
          searchError={searchError}
          userTitleArray={userTitleArray}
        />
        : null
       }
       {/* only showing the list if either a corresponding button has been clicked and a year has been searched for and only when the user hasn't submitted a list for that year yet (only show results when the user has submitted, so mapping through the object again but instead of the dropdown just numbers) */}
       {
        clicked && listSubmit === false && allFilteredMovies.length !== 0 ? 
        <PredictionList 
          userMovies={userMovies}
          listSubmit={listSubmit}
          handleRemoveClick={handleRemoveClick}
          handleMovieRating={handleMovieRating}
          handleListSubmit={handleListSubmit}
          handleConfirm={handleConfirm}
          faultySubmit={faultySubmit}
          userRating={userRating}
          deleted={deleted}
          submitAttempt={submitAttempt}
          ratedList={ratedList}
          showClicked={showClicked}
          moviePositions={moviePositions}
          movieYear={movieYear}
          allFilteredMovies={allFilteredMovies}
        />
        : showClicked && allFilteredMovies.length !== 0 ?
        <>
          <PredictionList 
            userMovies={userMovies}
            listSubmit={listSubmit}
            handleRemoveClick={handleRemoveClick}
            handleMovieRating={handleMovieRating}
            handleListSubmit={handleListSubmit}
            handleConfirm={handleConfirm}
            faultySubmit={faultySubmit}
            userRating={userRating}
            deleted={deleted}
            submitAttempt={submitAttempt}
            ratedList={ratedList}
            showClicked={showClicked}
            moviePositions={moviePositions}
            movieYear={movieYear}
            allFilteredMovies={allFilteredMovies}
          />

          <div className="wrapper">
            <p>Now what? Go up to the search bar and try your luck with a different year!</p>
          </div>
          {
            allFilteredMovies.length !== 0 ?
            <a
            className="searchText"
            href="#search"
            >Back to top</a>
            : null
          }
          
        </>
        : listSubmit && ratedList.every((e, i, a) => a.indexOf(e) === i) === true && userRating !== "" && !ratedList.includes(undefined) && searchSubmit === false ? 
          <ListSubmission 
          handleShowSubmitted={handleShowSubmitted}
          movieYear={movieYear}
          />
          : null
       }
      </main>

      {/* footer component */}
      <Footer 
       allFilteredMovies={allFilteredMovies}
       listSubmit={listSubmit}
      />   
    </div>
  );
}

export default App;
