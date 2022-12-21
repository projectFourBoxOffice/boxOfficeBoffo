// PSEUDO CODE
// Create a search input bar for the user where he can type in a year to look for movies that match that year
// On submit, get all the data from the API (tmdb API), which means calling the asynchronous function in the submit handler (created underneath the async function)

// API call:
// Before the return/JSX:
    // IMPORTING:
    // Import useState (for all our states in our API call, but also firebase), useEffect (for our firebase data), the firebase app and the database properties (that we use later on like database, ref, push, remove etc)
    // Use useState to store the specific data from the API to later return it in the JSX and also pass in as props to the other components, also possibly for conditions, for example when the user has submitted, create a state for that, than can later be used for ternary operators when wanting to choose what to return in the JSX based on whether the user has submitted or not (the default value would be false)
    // Above the async function create states and set their default values either to an empty string or false, which get changed later on either in the event handler functions or in the async function itself (can be used later on as props to pass into other components)
    // Async function for fetch call:
        // Create the asynchronous function to get the data from the API with the necessary URLSearch params, use the movie/discover endpoint movie/discover found at the API docs at https://developers.themoviedb.org/3/discover/movie-discover to get the title and the movie displayed onto the page based on the user query (this endpoint allows the user to search for a movie by release year, i.e. accepst the property release_year as a query). Set the release_year param in the URL Search Params equal to the userSearchInput state, which gets updated in the handleSearchChange event listener function underneath the asynchronous function (along with the submitted state in the handleSearchSubmit event listener function). For limiting the results between May 1st and September 4th (inclusive), create if statements regarding the release_date property of our API data object (if the release date contains numbers not representing the included months don't show it/skip over it)
        // Error handling: 
            // If the query doesn't yield any results, i.e. the user makes a typo, display an error message that says no movies found. Make sure it's a year like 2010 for example.
            // For that set up a searchError state above (default value set to false since there is no error yet) and use try catch in the async function: write an if statement inside the try block that checks if there is an error, then set the searchError state to false (since we still want to try to not have an error); then inside the catch, set the searchError state to true, so that we can later display an error message in our return based on the condition whether the searchError state and the submitted state is set to true (with ternary operator)

// Handling events - event listener functions:
    // Create a handleSearchChange event listener function, that controls the input by updating the userSearchInput state to e.target.value (the value of the targeted input).
    // Create a handleSearchSubmit function/event listener to listen for when the user has submitted the search input, also where the asynchronous function getMovies() gets called (in this case also set the submitted state to true)

// Set up different components where the JSX gets rendered: one for the search form called SeachForm, then another one for the displaying the movies called DisplayMovies and another one for the user list called UserList, make sure to import those into App.js
// Pass in the created states in the App.js as props into those components and functions

// Firebase:
// Create an app in Firebase, then use the functions and configuration provided by Firebase and paste that into a firebase.js file (not a component), along side that create a const variable called app that holds the initializeApp(firebaseConfig)
// Then import that app from firebase.js into App.js, as well as the getDatabase, ref, onValue, push and remove from firebase/database to use them later on (removing movies from a list, pushing movies/other data into the database etc)
// Set up a stateful variable for the movies that get added to the prediction list called predictionList and set its default value to an empty array
// Write a useEffect that takes in an anonymous function as an argument, as well as an empty dependency array so that we only have it rendered once (and it doesn't turn into an infinite loop)
// In that function we store our database from firebase and the dbRef, by setting up variables that hold those values
// Then we use onValue which takes in the dbRef variable as an argument, as well as an anonymous function with a response parameter
// There we define our data object that is equal to the value of our response parameter (use the .val() method for that)
// Then we create an empty array that will hold our 10 movie items
// Then we loop through our data object with a for in loop, where we will define a key variable and push that key into the empty array of objects (key: key and name: data[key]) (use .push)
// Ouside of the onValue, update the state of the predictionList to hold the newly created array with the pushed items

// Since we have now have another form for the predictionList, create another event handler function for both the user input changes and the submit, in order to differentiate them from the previous event handlers used for the API data and the movie search, give them different names, like handleListSubmit and handleListChange.
// Also set up a different state for the user input in the list, called the userListInput (empty default value) that gets an updated value of the e.target.value inside the handleListChange event handler

// In order for the user to be able to remove the list items, create a function for that called handleRemoveMovie which takes in the movieId as a parameter and define the database and the dbRef variables again, this time though add in the movieId to the database variable (database, `/${movieId}`)
// Then remove the dbRef from the database (remove())
// Gets called later in an anonymous function inside the onClick of the remove button

// Inside the return in order to display the list items to the page use map to loop through the movie list iems
// Would have used an ordered list ol, but since the user has to have the control over the order of his movie items (sorted from highest grossing to lowest), we have to use a ul that has the default bullet points removed (css), and add an li that contains the movie title from the data from the API (which the user has selected) and a dropdown menu containing those numbers (1-10), for each list item.
// So inside the map the li with the title and the dropdown menu is included (we include the remove button where the movies from the API data are actually displayed, not in the prediction list itself)

// For adding a movie item to a list, display the button with a plus sign where the movies are displayed, for each individual movie result
// Use an onClick and a addHandleClick event listener function, that lets the user add a movie to his prediction list
// Inside the addHandle click event handler define the database and dbRef variables again with the same values as in the useEffect, and then push the updated handleListInput as well as the dbRef variable into the database
// Then for removing a movie, create another button with a minus sign also displayed together with the movie results for each movie and have an onClick attribute for that that takes in an anonymous function that calls the handleRemoveMovie function in order to let the user remove the movie

// Importing Firebase
import app from './firebase.js';
// Import Firebase from './firebase.js';
import { getDatabase, ref, onValue, push, remove, update } from 'firebase/database';
// Use effect for fetching our Firebase data and preventing memory leak when user leaves the page
import { useState, useEffect } from 'react';
// Importing components
import SearchForm from './SearchForm.js';
import DisplayMovies from './DisplayMovies.js';
import PredictionList from './PredictionList.js'
import './App.css';

function App() {
  // State for the user input from the search bar (set to empty string by default)
  const [userSearch, setUserSearch] = useState("");
  // State for when the user has submitted the search form (default value false)
  const [searchSubmit, setSearchSubmit] = useState(false);
  // Setting the default value of our movie state to an empty array since the necessaray data from our API for our movies is inside an array of objects called results (the results array is inside our data object, along with the properties total_pages, page and total_results)
  // Data from API that gets passed as props to DisplayMovies component 
  // Will get values of the results array from our object
  const [movies, setMovies] = useState([]);
  // Will get the our new array (copied results array) with new month, day_of_month and year properties to use as filtering conditions
  // State for the filtered movies array, to only show movies released between May 1 and Sept 4 (inclusive), and possibly only movies with the original language equal to English (in order to avoid possible mishaps with the include_adult param)
  const [filteredMovies, setFilteredMovies] = useState([]);
  // State for all filtered movies
  const [allFilteredMovies, setAllFilteredMovies] = useState([]);
  // Year state to use for later so that the user knows what year he searched for the summer movies (since user input gets cleared after each submission, needed to find a different alternative to display it onto the page when the user has already submitted), gets value inside the filtering of the copy of the all movies array since if it were done during the mapping of the all movies array, it wouldn't have a value yet (can't do it after the return statement)
  const [movieYear, setMovieYear] = useState("");
  const [userMovies, setUserMovies] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [listSubmit, setListSubmit] = useState(false);
  const [limitClick, setLimitClick] = useState(false);
  const [repetition, setRepetition] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [ratedList, setRatedList] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [faultySubmit, setFaultySubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  // Hashmap for individual button target
  const [clickedIdsHashMap, setClickedIdsHashMap] = useState(new Map());
  // State for targeted click button
  // const [targeted, setTargeted] = useState("");
  // const [selectedTitle, setSelectedTitle] = useState("");

  // Empty array for the user movie ids (using for later to compare if that array contains current id of the movie chosen by the user)
  let movieIdsArray = [];
  const [userIdsArray, setUserIdsArray] = useState([]);

  // Creating an empty array to store each user input from dropdown to ensure correct submission
  let ratingArray = []; 

  // Titles user chose array
  let userTitleArray = []

  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [dataCounter, setDataCounter] = useState(0);

  // Counter for page param, default value 0 (gets increased in the while loop)
  let counter = 0;

  // Define an array (empty at first) to then later store the copy of the filtered array inside the while loop (avoid direct mutation), also will hold the values from the results of multiples pages (if necessary)
  let allFilteredArray = [];

  // async function getMovies to make the API call (calling that function in the submit handler)
  const getMovies = async () => {
    // Using the discover/movie endpoint in order to get the movie data with the year property and without the required query param (in the movie/search endpoint the query param would be a requirement which we don't want in our case, the user is looking for movie titles based on the release_year and not the other way around)
    setLoading(true);

    const url = new URL('https://api.themoviedb.org/3/discover/movie');
    
    // While loop to keep searching for results that match our filtered array, so that we get at least 10 summer movies for the user to add to his prediction list and sort later on
    while (true) {
      // Increase the value of the counter variable by one each time a new API call is made (use that for the page param inside the search params)
      counter = counter + 1;
      // Search Params
      url.search = new URLSearchParams({
        api_key: 'b236a86e23557d3a2afde767ae0ab5db',
        // Setting the release year equal to the user search input allows us to only show movies that match the release year that the user searched for 
        primary_release_year: userSearch,
        include_adult: false,
        include_video: false,
        language: 'en-US',
        // giving the page param the value of the counter variable (value is 1 as long as there are at least 10 filtered movie items on that page, while that's not the case, keep counting until there is at least 10, so could go up to page 2 or 3)
        page: counter
        // No need for query property since that would be restricted to input type=text, which we don't want in our case
      })
    
      // Our response and data objects
      const response = await fetch(url);
      const data = await response.json();

      // In order to get the relevant data for the movie info and posters, we need to access the results array inside the data object
      const movieResults = data.results;
      // Store that results array into the movies state
      setMovies(movieResults);
      setLoading(false);

      // Need to add in a month property to our movies array (mapping), so that we can then filter out the movies that don't fall between May (value of 4) and September (value of 8) with the .filter method (since our data comes in a array of objects)
      const moviesWithMonthDay = data.results.map((movie) => {
        const d = new Date(movie.release_date);
        let month = d.getMonth();
        let dayOfMonth = d.getDate();
        // year to then display it later on to the user after he has submitted the search form (can't use userSearch since the input is getting cleared upon each submission)
        let year = d.getFullYear();
    
        // Adding in the newly created properties into our array of objects
        return {...movie, month: month, day_of_month: dayOfMonth, year: year, added: false};
      })
    
      // Copying the newly created array that now contains the month and day_of_month property
      const copyAllMovies = [...moviesWithMonthDay];
      // Filtering through our copy of the array (avoiding direct mutation)
      const filteredMovieItems = copyAllMovies.filter((movie) => {
        // Setting the movie year state with the value of the newly added year property from our moviesWithMonthDay array copy
        setMovieYear(movie.year);
 
        // If the month is September, only show the days of that month less than or equal to 4th (so 3, since there are only 30 days in September, so the number is less by one)
        if (movie.month === 8) {
          // Only return movies in English (original language English since otherwise the API doesn't always know if there is adult movies included in other languages (doesn't understand))
          return movie.day_of_month <= 3 && movie.month  >= 4 && movie.month <=8 && movie.original_language === "en";
        }
        else {
          return movie.month  >= 4 && movie.month <=8 && movie.original_language === "en";
        }
      })
      // Set the filtered movies state equal to the filtered array
      setFilteredMovies(filteredMovieItems);
      // Pushing the copy of the filtered movie items array into our new array (so that it keeps adding new values every time the array length is less than 10)
      allFilteredArray.push(...filteredMovieItems);
      // Putting that newly populated all filtered array into a state to then use in our return in the display movies component (so that not just the filtered movies get shown from the first page, but from all pages necessary in order to have at least 10)
      setAllFilteredMovies(allFilteredArray);
      // If the length of our array that contains all filtered array values is greater than or equal to 10, break the while loop (since we only want to keep adding new results to our page/API call when there is less than 10 movies available on a page, default page is 1, but this page doesn't always have enough movies that match our filtering conditions, user needs to have at least 10 movies for the prediction list)
      if (allFilteredArray.length >= 20) {
        break;
      }

    }
    // Set counter back to default value 0 after while loop is done
    counter = 0;
  }

  // Defining a counter for each time data gets pushed, updating that counter's value inside the for in loop of our state array containing our data object from firebase (like this we can determine whether the user has already added a movie in that particular year, starts anew for each year and also updates accordingly when item gets removed)
  let addCounter = 0;
      
  // Loop through the user movies state that has our object with the ids of the movies that the user selected to then push them into a new array
  // This then allows us to compare if an id is already included in the array, which then helps us avoid repetitions of the user selection, ie. the user can't add the same movie twice to his list 
  for (let i in userMovies) {
    // Populating our empty array with the movie ids from the movies that the user has chosen to add to his list in order to ensure that there are no duplicates on the list (also important for disabling/changing the text of only the selected buttons)
    movieIdsArray.push(userMovies[i].userMovieId);
    // Pushing the new rating property of each object from our database into a new array to then use later on to compare whether the array includes undefined values and duplicate values from the user input

    ratingArray.push(userMovies[i].rating);
    addCounter = addCounter + 1;
    userTitleArray.push(userMovies[i].userMovieTitle);
  }

  const updatedMovies = allFilteredMovies.map((movie) => {
    return {...movie, idsArray: movieIdsArray, titleArray: userTitleArray};
  })


  // Click handler for adding a movie to the prediction list
  const handleClick = (e) => { 
    // Both the movieIdsArray and the the movie.idsArray (array of user ids added passed into object), don't seem to contain the id inside of the movie object from the API, but the targeted id of the button (even though the number is the same)
    setDataCounter(addCounter);
    setAllFilteredMovies(updatedMovies);

    const comparedMovies = updatedMovies.map((movie) => {
      if (movie.original_title === e.target.value) {
        let added = true;
        return {...movie, added: added};
      }
      else {
      }
      return movie;
    })

    setAllFilteredMovies(comparedMovies);
    

    // Updating the values of our states, in order to use them then as conditions inside our return
    setClicked(true);
    setSearchSubmit(true);
    setListSubmit(false);
    setSubmitAttempt(false);
    setRepetition(false);
    setDeleted(false);
    setFaultySubmit(false);

    const database = getDatabase(app);

    // Nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path)
    // This seems to have solved the different lists per year issue
    // const dataRef = ref(database, `Predictions/${movieYear}`);
    const predictionRef = ref(database, `Predictions/${movieYear}/movies`);    
    // Now we're adding the matching id and value (title and movie id into our database)
    const userMovieTitle = e.target.value;
    const userMovieId = e.target.id;
    // setSelectedTitle(e.target.value);
        
    // Defining our object that we are going to push into our database
    const listedMovie = {
      userMovieTitle,
      userMovieId
    }

    // Calling the hash map function
    // Pass in the user movie id (id of the movie the user has chosen to add to his list) and the targeted event (the add button) as arguments inside that function to then use that for later when removing the items from the list and setting the disabled property back to false for each time the user has chosen to remove the item from the list (not just for one button)
    updateClickedIdsHashMap(userMovieId, e.target);
    
    // Only pushing the selected movie by the user to our database if the selected movie's id doesn't repeat itself and there are less than 10 items (so that user can only add 10 items to his list)
    if (!movieIdsArray.includes(userMovieId) && movieIdsArray.length <= 10) {
      // Pushing our object into our database, while at the same time storing that inside a variable to then use in order to access our key from firebase (using that for when we map through our state userMovies containing all the data later on)
      push(predictionRef, listedMovie);
          
      // In order to access the year stored inside the entire object from our database (not inside the state array which only contains the movie data under the path of the selected movie year), we can use the pieces_ array stored inside the _path object which contains our current year at index 1
      // Like this we can make sure that the buttons stay disabled based on whether there is already data stored for that particular year (meaning the user must have added a movie from that year to his list since the data only gets pushed/the node gets created in firebase when the user has clicked a button (we are pushing the data inside our click handler function))

      // Getting the Firebase key from our data object
      // const firebaseKey = firebaseObj.key;
    } 
    if (userMovies.length >= 9 && !movieIdsArray.includes(userMovieId)) {
      setLimitClick(true);
    
    }

    // Set the disabled property of the current targeted event (in this case the currently clicked button by the user) to true in order to only disable one button out of all the add buttons for each movies (that are inside the map function)
    e.currentTarget.disabled = true;
    // setTargeted(e.currentTarget);
  }

  // Click handler for remove button (for each single list item)
  // Passing in three parameters, one for the node to remove (the path under which the whole node for each list item lives), one for the user movie id (the id of the targeted add button) and the user movie title (in order to compare the userMovieTitle from our object stored in our database with the original title of the movie from the API data)
  const handleRemoveClick = (nodeToRemove, userMovieId, userMovieTitle) => {
    const database = getDatabase(app);
    const predictionRef = ref(database, `Predictions/${movieYear}/movies/${nodeToRemove}`);
    remove(predictionRef);
    setSubmitAttempt(false);
  
    // Here the ids array does include the user movies id
    const removedMovies = updatedMovies.map((movie) => {
      if (movie.original_title === userMovieTitle) {
        // Use the clickedIdsHashMap state to grab the user movie id that is also equal to the id of the add button (representing the movie choice) and set the disabled property to false (in order to undo the disabling of that individual button that happens when the user has clicked on the movie already)
        clickedIdsHashMap.get(userMovieId).disabled = false;
        let added = false;
        return {...movie, added: added};
      }
      
      else {
      }
      return movie;
    })
  
    setAllFilteredMovies(removedMovies);
    setLimitClick(false);
    clickedIdsHashMap.delete(userMovieId);
  }


  useEffect(() => {
    
    const database = getDatabase(app);

    // Giving our database a reference under predictions (a bit more structured)
    // Nesting our soon to be declared object (click handler) inside a collection called Predictions that contains collections of the data invoked by the user per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
    // Like this we already got the data sorted into different collections based on the year
    const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
    
    onValue( predictionRef, (response) => {
      const data = response.val();
      const newState = [];

      for(let key in data){
        newState.push({key, ...data[key]});
      }   
      
      setUserMovies(newState);
      
    })
    // Adding in movieYear state here inside the dependency array to avoid missing dependency error (thankfully not too hard on the data as opposed to the whole userMovies state array)
  }, [movieYear])

  if (userMovies[10]) {

  }

  // Handles input change, setting the userSearch state equal to the value of the targeted input
  const handleSearchInput = (event) => {
    setUserSearch(event.target.value);
  }


  // Hashmap function in order to disable only selected buttons
  const updateClickedIdsHashMap = (k,v) => {
    setClickedIdsHashMap(new Map(clickedIdsHashMap.set(k,v)));
  }

  // Handle user input change from dropdown inside the prediction list
  // Passing in the event object and the key property taken from our map in the prediction list component as parameters inside our input change handler to update the object in our database at the right location
  const handleMovieRating = (e, key) => {
    
    setUserRating(e.target.value);
    setSubmitAttempt(false);
   
    // Defining an object with a rating property to update our object in our database with that new property
    // Like this we can store each one of those user input values in an array (while looping through our state containing those objects) and then determine whether there are undefined values included (ie. when the user hasn't even touched the dropdown) and whether there are values that repeat themselves (setting up conditions based on that later on for list submission)
    const userInput = {
      rating: e.target.value
    }
  
    const database = getDatabase(app);

    // Nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path)
      // This seems to have solved the different lists per year issue
    const predictionRef = ref(database, `Predictions/${movieYear}/movies/${key}`);
    update(predictionRef, userInput);

  }

  
  // Click handler for list submission
  const handleListSubmit = (userMovies) => {
    // Storing the array containing the input values of each dropdown in a state array in order to use it as a prop in the prediction list component (for conditions, other states here for invalid input and repetition were behind by one number, so displayed messages weren't accurate)
    setRatedList(ratingArray);
    // Checking if there are undefined or empty values inside rating array to determine whether submission is valid or not
    if (ratingArray.includes(undefined)) {
      let invalid = true;
      setInvalidInput(invalid);
    } 
    else {
      setInvalidInput(false);
    }


    // This console log will return false when a value inside the rating array repeats itself and true when no value repeats itself inside that array
    // Using every and indexOf method to determine whether there are no duplicates inside the array (iterative)
    // Info about every method taken from: https://www.w3schools.com/jsref/jsref_every.asp
    // Info about indexOf method taken from: https://www.w3schools.com/jsref/jsref_indexof_array.asp
    // Every takes in an anonymous function with the current value as a required parameter, as well as the index of the current element and the array of that element as optional parameters, that returns the first index of the current value inside the array (in our case the ratingArray with the user input from the dropdown) and checks whether that first index of the current value is the same as the index(or indices) of that value (if the first index is not the same as the other index/indices, that means that the same value is also positioned at another index, which means it is duplicated)
    // Only true if all elements passed the test (ie. no element repeats itself (true); if at least one repeats itself, then it returns false)
    console.log(ratingArray.every((element, index, array) => array.indexOf(element) === index));
    if (ratingArray.every((element, index, array) => array.indexOf(element) === index)) {
      let repeated = false;
      setRepetition(repeated);
    } 
    else {
      setRepetition(true);
    }

    setSubmitAttempt(true);
    
    // Updating the states that we will use as conditions to determine whether to show the prediction list or not (or the submit message)
    if (userMovies.length === 10 && ratingArray.every((element, index, array) => array.indexOf(element) === index) === true && !ratingArray.includes(undefined) && ratingArray.length === 10){
      setListSubmit(true);
      setSearchSubmit(false);
      setFaultySubmit(false);
      // Defining an object with a submitted property to update our object in our database with that new property
      // Like this we can know for later if user has already submitted that list, so if that is true, we can notify the user in case he decides to come back later to the same year
      let submitted = true;
      const listSubmission = {
        submitted: submitted
      }
  
      const database = getDatabase(app);
      // Referencing the movieYear as the last path since we don't want to have the submitted property for each movie but for each year (each list per year)
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


   // Submit handler for search form
   const handleSearchSubmit = (event) => {
    event.preventDefault();

    setAlreadySubmitted(false);
    setUserIdsArray(movieIdsArray);
    // Calling the async function getMovies with the API call, so that movies only show up once the user searches for a year
    getMovies(); 
    // Setting userSubmit to true since the user is submitting the form (using that as a condition later in the return/JSX)
    setSearchSubmit(true);
    
    if (submitted) {
      setAlreadySubmitted(true);
      setLimitClick(true);
    }

    setLimitClick(false);
    setAllFilteredMovies([]);
  }

  const handleConfirm = () => {
    if(window.confirm("Are you sure you want to delete this list")) {
      const database = getDatabase(app);
      const predictionRef = ref(database, `Predictions/${movieYear}/movies`);
      remove(predictionRef);
      setDeleted(true);
      setLimitClick(false);
      // Mapping through our userMovies array with our objects from our database to set the disabled property of each item back to false
      userMovies.map((userMovieObj) => {
       return clickedIdsHashMap.get(userMovieObj.userMovieId).disabled = false;
      })
      // Clearing the hash map state again when user has confirmed to delete entire list
      clickedIdsHashMap.clear();
      let addCounter = 0;
      setDataCounter(addCounter);

      const deletedMovies = updatedMovies.map((movie) => {
          // Use the clickedIdsHashMap state to grab the user movie id that is also equal to the id of the add button (representing the movie choice) and set the disabled property to false (in order to undo the disabling of that individual button that happens when the user has clicked on the movie already)
          let added = false;
          return {...movie, added: added};
      })
      setAllFilteredMovies(deletedMovies);

    } else {
      setDeleted(false);
    }
  }

  // Click handler for show list button inside search form component for when user has added at least 1 movie to his list (or ten) and hasn't submitted his list yet

  const handleShowList = () => {
    setClicked(true);
    setSearchSubmit(true);
  }
  
  return (
    <div className="App">
      <header>
        <div className="headerContainer">
          <div className="wrapper">
            <h1>Box Office Boffo</h1>
            <p>Summer is here and so are the blockbuster movies!</p>
          </div>
        </div>
        
      </header>
      <SearchForm 
        handleSearchSubmit={handleSearchSubmit}
        handleSearchInput={handleSearchInput}
        userSearch={userSearch}
        movieYear={movieYear}
        searchSubmit={searchSubmit}
        loading={loading}
        listSubmit={listSubmit}
        dataCounter={dataCounter}
        userMovies={userMovies}
        handleShowList={handleShowList}
        alreadySubmitted={alreadySubmitted}
        submitted={submitted}
      />

      {
        searchSubmit ?
        <DisplayMovies 
          movies={movies}
          filteredMovies={filteredMovies}
          allFilteredMovies={allFilteredMovies}
          handleClick={handleClick}
          limitClick={limitClick}
          handleRemoveClick={handleRemoveClick}
          deleted={deleted}
          userMovies={userMovies}
          movieYear={movieYear}
          clickedIdsHashMap={clickedIdsHashMap}
          loading={loading}
          dataCounter={dataCounter}
          userIdsArray={userIdsArray}
          listSubmit={listSubmit}
          alreadySubmitted={alreadySubmitted}
          submitted={submitted}
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
          dataCounter={dataCounter}
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
    </div>
  );
}

export default App;
