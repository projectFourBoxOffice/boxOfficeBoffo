// Display Movies component to return data from our API call
// importing a placeholder img for movies without poster_path
import MoviePlaceholder from './movie_default.png';

import { useParams } from 'react-router-dom';

// passing in the value stored in the movies state as a prop and destructuring it
const DisplayMovies = ({allFilteredMovies, limitClick, endReached, userMovies, movieYear, clickedIdsHashMap, deleted, loading }) => {

    const {userNameParam} = useParams();
    console.log(userNameParam);

    // const [allFilteredMovies, setAllFilteredMovies] = useState([]);

    const handleClick = (e) => { 
        // so both the movieIdsArray and the the movie.idsArray (array of user ids added passed into object), don't seem to contain the id inside of the movie object from the API, but the targeted id of the button (even though the number is the same)
        setAllFilteredMovies(updatedMovies);
        console.log(userNameParam);
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
        const predictionRef = ref(database, `Predictions/${userNameParam}/${movieYear}/movies`);
        
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

    return(
        <section className='movieResults'>
            <div className="wrapper">
            <p>Total results: {allFilteredMovies.length}</p>
            <ul>
                {/* mapping through our movies state array (containing all of our relevant movie info and data) */}
                {allFilteredMovies.map((movie) => {
                    return(
                        <li key={movie.id}>
                            <div className={`${movie.poster_path ? "posterContainer" : "posterContainer placeholderContainer"}`}>
                            {
                                movie.poster_path ?
                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`Poster for ${movie.original_title}`} />
                                : movie.poster_path && loading ? 
                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="loading image"/>
                                :
                                // if no poster available, set a placeholder
                                <img src={MoviePlaceholder} alt={`Placeholder poster for ${movie.original_title}`} />
                            }
                            </div>
                            <div className="titleContainer">
                                <p>{movie.original_title}</p>
                            </div>
                            
                            {/* making sure the release date of the displayed movie results match the year of the user input */}
                            <p>{movie.release_date}</p>
                            <button
                                // give the button a value of the movie title that we're gonna use for our realtime database and display to the user later on (e.target.value) 
                                value={movie.original_title}
                                // give the button an id with the value of the matching movie id to the movie title (can then use e.target.id in the click handler to have more useful data in the database)
                                id={movie.id}
                                onClick={handleClick}
                                disabled={limitClick}
                                // disabled={limitClick || (clickedIdsHashMap.get(movie.id) === 1 ? true : false)}
                            >
                            {movie.added && userMovies.length < 10 && deleted === false ? 
                                <>Added</>
                                // : movie.added === false && userMovies.length < 10 && deleted === false ?
                                // <>Add</>   
                                : userMovies.length === 10 && deleted === false ?
                                <>Added 10 items to the list</>
                                : movie.added === false && userMovies.length < 10 ?
                                <>Add to the list</>
                                : deleted ?
                                <>Add to the list</>
                                : null

                            }
                            </button>
                           
                        </li>
                    )
                })}
            </ul>
            </div>
        </section>
    )
}

export default DisplayMovies;
// gets imported into App.js and wrapped inside a ternary operator, so that this component mounts only when the user has submitted the search form