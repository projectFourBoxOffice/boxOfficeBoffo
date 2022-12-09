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
        // create the asynchronous function to get the data from the API with the necessary URLSearch params, use the movie/discover endpoint https://developers.themoviedb.org/3/discover/movie-discover to get the title and the movie displayed onto the page based on the user query (this endpoint allows the user to search for a movie by release year, i.e. accepst the property release_year as a query). Set the release_year param in the URL Search Params equal to the userSearchInput state, which gets updated in the handleSearchChange event listener function underneath the asynchronous function (along with the submitted state in the handleSearchSubmit event listener function). For limiting the results between May 1st and September 4th (inclusive), create if statements regarding the release_date property of our API data object (if the release date contains numbers not representing the included months don't show it/skip over it)
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


import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Box Office Boffo</h1>
      </header>
    </div>
  );
}

export default App;
