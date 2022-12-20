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
// import firebase from './firebase.js';
// need to import remove too (haven't used it yet to avoid unused var error)
import { getDatabase, ref, onValue, push, remove, update } from 'firebase/database';

// use effect for fetching our firebase data and preventing memory leak when user leaves the page
import { useState, useEffect } from 'react';

// importing routing
import { Link } from 'react-router-dom';

// importing components
import SearchForm from './SearchForm.js';
import DisplayMovies from './DisplayMovies.js';
import PredictionList from './PredictionList.js'
// most likely gonna have another component for the prediction list (can also fetch the data in that same component?)

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

  // const [ userMovie, setUserMovie] = useState('');

  const [ userMovies, setUserMovies] = useState([]);

  const [ clicked, setClicked] = useState(false);

  const [listSubmit, setListSubmit] = useState(false);
  const [limitClick, setLimitClick] = useState(false);
  const [repetition, setRepetition] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [ratedList, setRatedList] = useState([]);

  const [ deleted, setDeleted] = useState(false);

  const [ faultySubmit, setFaultySubmit] = useState(false);

  const [loading, setLoading] = useState(false);

  const [userRating, setUserRating] = useState('');


  // hashmap for individual button target
  // state clieckedIds
  const [clickedIdsHashMap, setClickedIdsHashMap] = useState(new Map());
  // state for targeted click button
  const [targeted, setTargeted] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
 
  
  // const [firebaseKey, setFirebaseKey] = useState("");
  // firebase Key state to use as a key prop when mapping through our data from firebase
  // const [firebaseKey, setFirebaseKey] = useState("");

  // empty array for the user movie ids (using for later to compare if that array contains current id of the movie chosen by the user)
  let movieIdsArray = [];
  

  // creating an empty array to store each user input from dropdown to ensure correct submission
  // data seems to be a bit out of sync (lagging by one)
  let ratingArray = []; 

  const [submitAttempt, setSubmitAttempt] = useState(false);
  

  // state for text shown when user either has already added 10 items to his list
  // const end = "Added 10 items to the list";
  // // or reached cap of list items
  // const start = "Add to the list";
  // const [endReached, setEndReached] = useState(start);

  // state to check whether list item has been removed
  // const [removed, setRemoved] = useState(false);
  // let variables to use for the while loop
  // counter for page param, default value 0 (gets increased in the while loop)
  let counter = 0;

  // define an array (empty at first) to then later store the copy of the filtered array inside the while loop (avoid direct mutation), also will hold the values from the results of multiples pages (if necessary)
  let allFilteredArray = [];

  // async function getMovies to make the API call (calling that function in the submit handler)
  const getMovies = async () => {
    // using the discover/movie endpoint in order to get the movie data with the year property and without the required query param (in the movie/search endpoint the query param would be a requirement which we don't want in our case, the user is looking for movie titles based on the release_year and not the other way around)
    setLoading(true);

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
      setLoading(false);

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
        return {...movie, month: month, day_of_month: dayOfMonth, year: year, added: false};
        
      })
      console.log(moviesWithMonthDay);

      // put that array into our movies state in order to be able to access it in our JSX
      // setAllMovies(moviesWithMonthDay);
      // console.log(allMovies);
      
      // for filter: conditions that need to pass in our results array in order to display movies: only released between May 1st and September 4th ((inclusive, so that means: month values greater than or equal to 4 and less than or equal to 8), and date value for the month of september (8) less than or equal to 3)
      // use filter for that

      // copying the newly created array that now contains the month and day_of_month property
      const copyAllMovies = [...moviesWithMonthDay];

      console.log(copyAllMovies);

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
      if (allFilteredArray.length >= 20) {
        break;
      }

    }
    // end of while loop

    // set counter back to default value 0 after while loop is done
    counter = 0;
    console.log(counter);
  }

  // loop through the user movies state that has our object with the ids of the movies that the user selected to then push them into a new array
  // this then allows us to compare if an id is already included in the array, which then helps us avoid repetitions of the user selection, ie. the user can't add the same movie twice to his list 
  for (let i in userMovies) {
    console.log(i);
    console.log(userMovies[i].userMovieId);
    // populating our empty array with the movie ids from the movies that the user has chosen to add to his list in order to ensure that there are no duplicates on the list (also important for disabling/changing the text of only the selected buttons)
    movieIdsArray.push(userMovies[i].userMovieId);
    console.log(movieIdsArray);
    console.log(movieIdsArray[i]);

    // pushing the new rating property of each object from our database into a new array to then use later on to compare whether the array includes undefined values and duplicate values from the user input
    console.log(userMovies[i].rating);
    ratingArray.push(userMovies[i].rating);
    console.log(ratingArray);
    console.log(ratingArray[i]);
    // console.log(userIdsArray);
    // movieIds.push(userMovies[i].userMovieId);
  }

  

  // userMovies.forEach((movie) => {
  //   // pushing each rating stored in our database for each listed movie to the array to then check if the array length is 10 and doesn't have repeating numbers
    
  //   if (movie.rating === e.target.value) {
  //     setRepetition(true);
  //     console.log(movie.rating);
  //     console.log(e.target.value);
  //     // setInvalidInput(false);
  //   }
  //   if (movie.rating === null || movie.rating === undefined) {
  //     setInvalidInput(true);
  //   }
  //   else {
  //     setRepetition(false);
  //     console.log(movie.rating);
  //     console.log(e.target.value);
  //     if (movie.key === key) {
  //       movie.rating = e.target.value;
  //     }
  //     console.log(movie.rating);
  //   }
  //   ratingArray.push(movie.rating);
  //   console.log(ratingArray);
  //   console.log(ratingArray.includes(e.target.value));
  // })

  // console.log(ratingArray);


  const updatedMovies = allFilteredMovies.map((movie) => {
    return {...movie, idsArray: movieIdsArray};
  })
  console.log(movieIdsArray);
  console.log(updatedMovies);

  // click handler for adding a movie to the prediction list
  const handleClick = (e) => { 
    // so both the movieIdsArray and the the movie.idsArray (array of user ids added passed into object), don't seem to contain the id inside of the movie object from the API, but the targeted id of the button (even though the number is the same)
    setAllFilteredMovies(updatedMovies);

    const comparedMovies = updatedMovies.map((movie) => {
      if (movie.original_title === e.target.value) {
        console.log(movie.idsArray);
        console.log(movieIdsArray);
        console.log(movie.idsArray.includes(e.target.id));
        console.log(movieIdsArray.includes(movie.id));
        console.log(e.currentTarget.id, e.currentTarget.value);
        console.log("Hello");
        let added = true;
        // return {...movie, added: added};
        return {...movie, added: added};
      }
      else {
        console.log("Really?");
      }
      return movie;
    })
    console.log(comparedMovies);
    setAllFilteredMovies(comparedMovies);
    

    // updating the values of our states, in order to use them then as conditions inside our return
    setClicked(true);
    setSearchSubmit(true);
    setListSubmit(false);
    setSubmitAttempt(false);
    setRepetition(false);
    // setRemoved(false);
    setDeleted(false);
    setFaultySubmit(false);

    const database = getDatabase(app);
    // const dbRef = ref(database);

    // nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
    // this seems to have solved the different lists per year issue
    const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
    
    // now we're adding the matching id and value (title and movie id into our database)
    const userMovieTitle = e.target.value;
    const userMovieId = e.target.id;
    // let rating = null;
    
    console.log(e.target.value);
    console.log(e.target.id);
    setSelectedTitle(e.target.value);

    // used this video as a reference for nesting properties inside our database
    // https://www.youtube.com/watch?v=OlyA7Q0qPPE
        
    // defining our object that we are going to push into our database
    const listedMovie = {
      userMovieTitle,
      userMovieId
      // rating
    }

    // calling the hash map function
    // pass in the user movie id (id of the movie the user has chosen to add to his list) and the targeted event (the add button) as arguments inside that function to then use that for later when removing the items from the list and setting the disabled property back to false for each time the user has chosen to remove the item from the list (not just for one button)
    updateClickedIdsHashMap(userMovieId, e.target);
    console.log(clickedIdsHashMap);

    // only pushing the selected movie by the user to our database if the selected movie's id doesn't repeat itself and there are less than 10 items (so that user can only add 10 items to his list)
    if (!movieIdsArray.includes(userMovieId) && movieIdsArray.length <= 10) {
      console.log(movieIdsArray);
      // pushing our object into our database, while at the same time storing that inside a variable to then use in order to access our key from firebase (using that for when we map through our state userMovies containing all the data later on)
      const firebaseObj = push(predictionRef, listedMovie);
      console.log(firebaseObj);

      // getting the firebase key from our data object
      const firebaseKey = firebaseObj.key;
      console.log(firebaseKey);
      // setFirebaseKey(firebaseKey); 
      // setLimitClick(false);
    }
        
    if (userMovies.length >= 9 && !movieIdsArray.includes(userMovieId)) {
      setLimitClick(true);
      // setEndReached(end);
    }

    if (movieIdsArray.length === 10 && clicked === false) {
      setLimitClick(true);
      // setEndReached(end);
    }
    // else if (movieIdsArray.length === 10 && clicked === true) {
    //   setLimitClick(true);
    //   setEndReached(end);
    // }
    
    // setFirebaseKey(fireKey);

    // set the disabled property of the current targeted event (in this case the currently clicked button by the user) to true in order to only disable one button out of all the add buttons for each movies (that are inside the map function)
    e.currentTarget.disabled = true;
    setTargeted(e.currentTarget);
  
  }

  // click handler for remove button (for each single list item)
  // pass in two parameters, one for the node to remove (the path under which the whole node for each list item lives) and another one for the user movie id (the id of the targeted add button)
  const handleRemoveClick = (nodeToRemove, userMovieId) => {
    console.log(nodeToRemove);
    // console.log(userMovieId);
    console.log(userMovieId);
    const database = getDatabase(app);
    const predictionRef = ref(database, `Predictions/${movieYear}/movies/${nodeToRemove}`);
    remove(predictionRef);

    setSubmitAttempt(false);
    // setRatedList([]);
    // setRemoved(true);

    // here the ids array does include the user movies id
    // issue: when one item at a time gets removed, the item that is still supposed to stay added (wasn't removed), still changes back to add to the list (only happens when another item gets removed)
    // was able to fix it, but theoretically this issue shouldn't be, there is a bit of a delay between the movie title from our API object and the value of the targeted button (should both be the same values)
    const removedMovies = updatedMovies.map((movie) => {
      if (movie.idsArray.includes(targeted.id)) {
        console.log(movieIdsArray);
        // console.log(e.currentTarget.id, e.currentTarget.value);
        console.log(movie.idsArray.includes(userMovieId));
        console.log(userMovieId, selectedTitle);
        console.log(movie.id, movie.original_title);
        console.log(targeted.id, targeted.value);
        console.log("Hello");
        let added = false;
        // setEndReached(start);
        // return {...movie, added: added};
        return {...movie, added: added};
      }
      
      else {
        console.log("Really?");
        // return {...movie, added: true};
        // setEndReached("");
      }
      return movie;
    })
    console.log(removedMovies);
    setAllFilteredMovies(removedMovies);

    setLimitClick(false);
   
  
    // use the clickedIdsHashMap state to grab the user movie id that is also equal to the id of the add button (representing the movie choice) and set the disabled property to false (in order to undo the disabling of that individual button that happens when the user has clicked on the movie already)
    clickedIdsHashMap.get(userMovieId).disabled = false;
    // removeClickedIdsHashMap(userMovieId);
    clickedIdsHashMap.delete(userMovieId);
    console.log(clickedIdsHashMap);
  }


  useEffect(() => {
    
    const database = getDatabase(app);
    // const dbRef = ref(database);
    // giving our database a reference under predictions (a bit more structured)
    // nesting our soon to be declared object (click handler) inside a collection called Predictions that contains collections of the data invoked by the user per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
    // like this we already got the data sorted into different collections based on the year
    const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
    
    onValue( predictionRef, (response) => {
      const data = response.val();
      const newState = [];

      for(let key in data){
        newState.push({key, ...data[key]});
      }   
      
      setUserMovies(newState);
      
    })
    // adding in movieYear state here inside the dependency array to avoid missing dependency error (thankfully not too hard on the data as opposed to the whole userMovies state array)
  }, [movieYear])

  console.log(userMovies);
  console.log(movieYear);


  // if (userMovies.length >= 9 && userMovies.movieYear === movieYear) {
  //   setLimitClick(true);
  //   // setEndReached(end);
  // }

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

    // setUsersIdArray(movieIdsArray);
    
    // setting the clicked state back to false, so that user doesn't see the list immediately when searching for a new year (only upon clicking the plus button)
    if (userMovies.movieYear !== userSearch) {
      setClicked(false);
      // setEndReached(start);
    }
    else {
      setClicked(true);
    }

    setLimitClick(false);
    setClicked(false);

    // if (movieIdsArray.length === 10 && clicked === false) {
    //   setLimitClick(true);
    //   // setEndReached(end);
    // }
    // else if (movieIdsArray.length === 10 && clicked === true) {
    //   setLimitClick(true);
    //   // setEndReached(end);
    // }
  }

  // handles input change, setting the userSearch state equal to the value of the targeted input
  const handleSearchInput = (event) => {
    setUserSearch(event.target.value);
  }


  // hashmap function in order to disable only selected buttons
  const updateClickedIdsHashMap = (k,v) => {
    setClickedIdsHashMap(new Map(clickedIdsHashMap.set(k,v)));
  }
 
  
  // handle user input change from dropdown inside the prediction list
  // passing in the event object and the key property taken from our map in the prediction list component as parameters inside our input change handler to update the object in our database at the right location
  const handleMovieRating = (e, key) => {
    
    console.log(key);
    setUserRating(e.target.value);
    setSubmitAttempt(false);
    // setRepetition(false);
    
    // defining an object with a rating property to update our object in our database with that new property
    // like this we can store each one of those user input values in an array (while looping through our state containing those objects) and then determine whether there are undefined values included (ie. when the user hasn't even touched the dropdown) and whether there are values that repeat themselves (setting up conditions based on that later on for list submission)
    const userInput = {
      rating: e.target.value
    }
    console.log(e.target.value);

    // movie.rating = e.target.value;
    const database = getDatabase(app);
    // const dbRef = ref(database);

    // nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
      // this seems to have solved the different lists per year issue
    const predictionRef = ref(database, `Predictions/${movieYear}/movies/${key}`);
    update(predictionRef, userInput);

    // console.log(ratingArray.every((e, i, a) => a.indexOf(e) === i));
    // if (ratingArray.every((e, i, a) => a.indexOf(e) === i) === false) {
    //   setRepetition(true);
    //   console.log(repetition);
    // } 
    // else {
    //   setRepetition(false);
    //   console.log(repetition);
    // }

    // userMovies.forEach((movie) => {
    //   // pushing each rating stored in our database for each listed movie to the array to then check if the array length is 10 and doesn't have repeating numbers
      
    //   if (movie.rating === e.target.value) {
    //     setRepetition(true);
    //     console.log(movie.rating);
    //     console.log(e.target.value);
    //     // setInvalidInput(false);
    //   }
    //   // if (movie.rating === null || movie.rating === undefined) {
    //   //   setInvalidInput(true);
    //   // }
    //   else {
    //     setRepetition(false);
    //     console.log(movie.rating);
    //     console.log(e.target.value);
    //     if (movie.key === key) {
    //       movie.rating = e.target.value;
    //     }
    //     console.log(movie.rating);
    //   }
    //   ratingArray.push(movie.rating);
    //   console.log(ratingArray);
    //   console.log(ratingArray.includes(e.target.value));
    // })

    // console.log(ratingArray);

    // if (ratingArray.length !== 10 || ratingArray.length === 0) {
    //   setInvalidInput(true);
    // }
    
    
    // const ratingsArray = userMovies.map((movie) => {
    //   if (movie.rating === e.target.value) {
    //     setRepetition(true);
    //     console.log(movie.rating);
    //     console.log(e.target.value);
    //     return movie;
    //   }
    //   else {
    //     setRepetition(false);
    //     console.log(movie.rating);
    //     console.log(e.target.value);
    //     if (movie.key === key) {
          
    //     }
    //     console.log(movie.rating);
    //     return movie;
    //   }
    // })
    // console.log(ratingsArray);
    // setUserMovies(ratingsArray);
    // console.log(userMovies);
   
    // update(predictionRef, userInput);

    // let i = 0;
    // while (i < arraySize) {
    //   // prompt the user for a string
    //   const input = e.target.value;
    //   // add the string to the array
    //   myArray.push(input);
      
    //   i++;
    // }

    // for (let i in userMovies) {
    //   console.log(i);
    //   const userInput = e.target.value;
    //   userMovies[i].userInput;
    //   console.log(userMovies[i].userInput);
    //   console.log(i.userInput);
    // }

    // const inputUserMovies = userMovies.map((item) => {
    //   let rating = e.target.value;
    //   return {...item, rating: rating};
    // })
    // console.log(inputUserMovies);
    // setUserMovies(inputUserMovies);
    // console.log(userMovies);

    // // console.log(myArray); // [ "string1", "string2", "string3", "string4", "string5" ]

    // console.log(e.target.value);
  }

  // click handler for list submission
  const handleListSubmit = () => {
    // setInvalidInput(false);
    
    // storing the array containing the input values of each dropdown in a state array in order to use it as a prop in the prediction list component (for conditions, other states here for invalid input and repetition were behind by one number, so displayed messages weren't accurate)
    setRatedList(ratingArray);
    // checking if there are undefined or empty values inside rating array to determine whether submission is valid or not
    console.log(ratingArray.includes(undefined));
    if (ratingArray.includes(undefined)) {
      let invalid = true;
      setInvalidInput(invalid);
      console.log(invalidInput);
    } 
    else {
      // let invalid = false;
      setInvalidInput(false);
      console.log(invalidInput);
    }

    // setInvalidInput(ratingArray.includes(undefined));
    console.log(invalidInput);

    // this console log will return false when a value inside the rating array repeats itself and true when no value repeats itself inside that array
    // using every and indexOf method to determine whether there are no duplicates inside the array (iterative)
    // info about every method taken from: https://www.w3schools.com/jsref/jsref_every.asp
    // info about indexOf method taken from: https://www.w3schools.com/jsref/jsref_indexof_array.asp
    // every takes in an anonymous function with the current value asa required parameter, as well as the index of the current element and the array of that element as optional parameters, that returns the first index of the current value inside the array (in our case the ratingArray with the user input from the dropdown) and checks whether that first index of the current value is the same as the index(or indices) of that value (if the first index is not the same as the other index/indices, that means that the same value is also positioned at another index, which means it is duplicated)
    // only true if all elements passed the test (ie. no element repeats itself (true); if at least one repeats itself, then it returns false)
    console.log(ratingArray.every((element, index, array) => array.indexOf(element) === index));
    if (ratingArray.every((element, index, array) => array.indexOf(element) === index)) {
      let repeated = false;
      setRepetition(repeated);
      console.log(repetition);
    } 
    else {
      // let repeated = true;
      setRepetition(true);
      console.log(repetition);
    }

    setSubmitAttempt(true);
    
    // updating the states that we will use as conditions to determine whether to show the prediction list or not (or the submit message)
    if (userMovies.length === 10 && ratingArray.every((element, index, array) => array.indexOf(element) === index) === true && !ratingArray.includes(undefined) && ratingArray.length === 10){
      setListSubmit(true);
      setSearchSubmit(false);
      setFaultySubmit(false);
    } 
    else if (userMovies.length !== 10 && ratingArray.every((element, index, array) => array.indexOf(element) === index) === true && !ratingArray.includes(undefined)) {
      setFaultySubmit(true);
    }
    

    console.log(ratingArray);
    
    console.log(repetition);
    console.log(userRating);
    console.log(invalidInput);
    // if (repetition) {

    // }
  }

  // maybe create an array for each user input in order to determine, which input has repeated itself to avoid submissions with same number for every list item

  const handleConfirm = () => {
    if(window.confirm("Are you sure you want to delete this list")) {
      const database = getDatabase(app);
      const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
      remove(predictionRef);
      setDeleted(true);
      setLimitClick(false);
      // setEndReached(start);
      // clickedIdsHashMap.get().disabled = false;
      // mapping through our userMovies array with our objects from our database to set the disabled property of each item back to false
      userMovies.map((userMovieObj) => {
       return clickedIdsHashMap.get(userMovieObj.userMovieId).disabled = false;
      })
      console.log(clickedIdsHashMap);

      // clearing the hash map state again when user has confirmed to delete entire list
      clickedIdsHashMap.clear();
      console.log(clickedIdsHashMap);

    } else {
      setDeleted(false);
    }
  }

  
  

  // next step: adding an input change handler for the dropdown numbers inside the prediction list

  // also making sure that the dropdown numbers as well the movie items don't repeat themselves (maybe use a counter and/or the ids stored inside a new empty array for that? also an array for the user selection values?)
  // maybe though might be wise to control the dropdown values (whether they repeat themselves or not) when the user is submitting since the user might want to change the order of the list multiple times and for that some numbers are bound to repeat themselves temporarily


  return (
    <div className="App">
      <header>
        <h1>Box Office Boffo</h1>
        <form action="">
          <label htmlFor="userName">Create your username to start the game</label>
          <input type="text" id='userName' />
          <button type="submit">Start Game</button>
        </form>
      </header>
      {/* form for the user to search for movies matching a release year */}
      <SearchForm 
        handleSearchSubmit={handleSearchSubmit}
        handleSearchInput={handleSearchInput}
        userSearch={userSearch}
        movieYear={movieYear}
        searchSubmit={searchSubmit}
        loading={loading}
      />

      {/* only show the list of movie images and titles when the user has submitted the form */}
      {
        searchSubmit ?
        <DisplayMovies 
          movies={movies}
          filteredMovies={filteredMovies}
          allFilteredMovies={allFilteredMovies}
          handleClick={handleClick}
          limitClick={limitClick}
          // endReached={endReached}
          handleRemoveClick={handleRemoveClick}
          // firebaseKey={firebaseKey}
          deleted={deleted}
          userMovies={userMovies}
          movieYear={movieYear}
          clickedIdsHashMap={clickedIdsHashMap}
          loading={loading}
        />
        : null
      }
      {
        clicked && listSubmit === false && searchSubmit ? 
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
          searchSubmit={searchSubmit}
          repetition={repetition}
          submitAttempt={submitAttempt}
          invalidInput={invalidInput}
          ratedList={ratedList}
        />
        // else if: the user has submitted the list, but not searched for a another year yet, show a submit message
        : listSubmit && ratedList.every((e, i, a) => a.indexOf(e) === i) === true && userRating !== "" && !ratedList.includes(undefined) && searchSubmit === false ? 
          <p>Your List Has Been Submitted</p>
          // else: don't display anything
          : null
      }

      <footer className={`${allFilteredMovies.length === 0 || listSubmit ? "noMovies" : ""} `}>
          <p>Created @ <a href="https://junocollege.com/" target="_blank" rel="noopener noreferrer">Juno College of Technology</a></p>
      </footer>
      

      {/* might have to store this inside another component PredictionList */}

      {/* if: only display the prediction list when the user has clicked the plus button under the movie and when the user hasn't submitted the list yet and also only when the user has actually hit the search button for movies under a specific year (submitted the search form) */}
      {/* {
        clicked && listSubmit === false && searchSubmit ?  */}
      {/* //  <>
      //   <ul>
      //     {userMovies.map((movieObj) => { */}
      {/* //       return(
      //         // using our key for our firebase object as a key prop
      //         <li key={movieObj.key}>
      //           {/* still have to add an onChange and a value set to the user selection of the number input  */}
      {/* //           <select name="selectedList" id="selectedList" required value={userRating} onChange={handleMovieRating}>
      //             <option value="1">1</option>
      //             <option value="2">2</option>
      //             <option value="3">3</option>
      //             <option value="4">4</option>
      //             <option value="5">5</option>
      //             <option value="6">6</option>
      //             <option value="7">7</option>
      //             <option value="8">8</option>
      //             <option value="9">9</option>
      //             <option value="10">10</option>
      //           </select> */} 
                {/* since now the movie properties like id and title are nested inside the corresponding year, we are using movieYear (as a parameter in the map and here) */}
      {/* //           <p>{movieObj.userMovieTitle}</p>
      //           <button onClick={() => handleRemoveClick(movieObj.key, movieObj.userMovieId)}>Remove</button>
      //         </li> */}
      {/* //       )
      //     })}
      //   </ul> */}
        {/* // { */}
        {/* //   faultySubmit && deleted === false ? 
        //   <div>
        //     <p>You cannot submit your list if you have not added 10 movies</p>
        //   </div> 
        //   : null */}
        {/* // }
        // { */}
        {/* //   deleted === false && userMovies.length !== 0 ? 
        //   <button onClick={handleConfirm}>Delete List</button>
        //   : null
        // }
        // { */}
        {/* //   listSubmit === false && deleted === false && userMovies.length !== 0 ?
        //   <button onClick={handleListSubmit} type="submit">Submit</button>
        //   : null
        // }

      // </> */}
      {/* // // else if: the user has submitted the list, but not searched for a another year yet, show a submit message */}
      {/* //   : listSubmit && searchSubmit === false ? 
      //     <p>Your List Has Been Submitted</p>
          // else: don't display anything
          : null
      // } */}
    </div>
  );
}

export default App;
