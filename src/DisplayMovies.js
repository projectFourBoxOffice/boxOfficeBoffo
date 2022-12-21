// Display Movies component to return data from our API call

// importing a placeholder img for movies without poster_path
import MoviePlaceholder from './movie_default.png';

// importing firebase
import app from './firebase.js';
import { getDatabase, ref, onValue, push } from 'firebase/database';

// importing useState and useEffect
import { useEffect } from 'react';

// importing useParams
import { useParams } from 'react-router-dom';

// passing in the value stored in the movies state as a prop and destructuring it
const DisplayMovies = ( {allFilteredMovies, handleClick, limitClick, deleted, loading, dataCounter, listSubmit, movieIdsArray, movieYear, updateClickedIdsHashMap, clickedIdsHashMap, setUserMovies, userMovies} ) => {

    // destructuring our useParams object
    const {userName} = useParams();
    console.log(userName);

    // state
    // const [userMovies, setUserMovies] = useState([]);

    // useEffect to get our data object from firebase
    useEffect(() => {
    
        const database = getDatabase(app);
        // const dbRef = ref(database);
        // giving our database a reference under predictions (a bit more structured)
        // nesting our soon to be declared object (click handler) inside a collection called Predictions that contains collections of the data invoked by the user per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
        // like this we already got the data sorted into different collections based on the year
        const predictionRef = ref(database, `Predictions/${userName}/${movieYear}/movies`);
        
        onValue( predictionRef, (response) => {
          const data = response.val();
          const newState = [];
    
          for(let key in data){
            newState.push({key, ...data[key]});
          }   
          
          setUserMovies(newState);
          
        })
        // adding in movieYear state here inside the dependency array to avoid missing dependency error (thankfully not too hard on the data as opposed to the whole userMovies state array)
      }, [movieYear, userName])

    // click handler for add to list button (passing in click handler from App.js as a prop and calling that function)
    const handleAddClick = (e) => {
        handleClick(e);
        const database = getDatabase(app);
        // const dbRef = ref(database);

        // nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
        // this seems to have solved the different lists per year issue
        const predictionRef = ref(database, `Predictions/${userName}/${movieYear}/movies`);
        
        // now we're adding the matching id and value (title and movie id into our database)
        const userMovieTitle = e.target.value;
        const userMovieId = e.target.id;
        // let rating = null;
        
        console.log(e.target.value);
        console.log(e.target.id);

        // used this video as a reference for nesting properties inside our database
        // https://www.youtube.com/watch?v=OlyA7Q0qPPE
            
        // defining our object that we are going to push into our database
        const listedMovie = {
        userMovieTitle,
        userMovieId
        // rating
        }

        // only pushing the selected movie by the user to our database if the selected movie's id doesn't repeat itself and there are less than 10 items (so that user can only add 10 items to his list)
        if (!movieIdsArray.includes(userMovieId) && movieIdsArray.length <= 10) {
            console.log(movieIdsArray);
            // pushing our object into our database, while at the same time storing that inside a variable to then use in order to access our key from firebase (using that for when we map through our state userMovies containing all the data later on)
            const firebaseObj = push(predictionRef, listedMovie);
            console.log(firebaseObj);
    
            // getting the firebase key from our data object
            const firebaseKey = firebaseObj.key;
            console.log(firebaseKey);
            // setLimitClick(false);
        }
     
        // calling the hash map function
        // pass in the user movie id (id of the movie the user has chosen to add to his list) and the targeted event (the add button) as arguments inside that function to then use that for later when removing the items from the list and setting the disabled property back to false for each time the user has chosen to remove the item from the list (not just for one button)
        updateClickedIdsHashMap(userMovieId, e.target);
        console.log(clickedIdsHashMap);

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
                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="loading movie poster"/>
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
                                onClick={handleAddClick}
                                // using the dataCounter state or the array length of our userMovies state array to check whether 10 movies have been added or not (still able to access that information even after going to a different year and then coming back to that year again without having submitted) or whether the list for that particular year has already been submitted (just added in a submitted property every time the user submits successfully, so that 10th index is only truthy upon submission, like this we can disable buttons for only those years)
                                disabled={dataCounter === 10 || movieIdsArray.length === 10 || userMovies[10] ? true : limitClick}
                                // disabled={limitClick || (clickedIdsHashMap.get(movie.id) === 1 ? true : false)}
                            >
                            {/* also make sure that added button stays disabled when user goes to next year without having submitted and returns back to that year, so that he knows that that particular item has been added */}
                            {movie.added === true && movieIdsArray.length < 10 ? 
                                <>Added</>
                                // : userIdsArray.find(item => item === movie.id) === movie.id && dataCounter !== 0 && dataCounter !== 10 && listSubmit === false ?
                                // <>Added</>
                                // : movie.added === false && userMovies.length < 10 && deleted === false ?
                                // <>Add</>   
                                : movieIdsArray.length === 10 && deleted === false && listSubmit === false ?
                                <>Added 10 items to the list</>
                                : movie.added === false && movieIdsArray.length < 10 && listSubmit === false ?
                                <>Add to the list</>
                                : deleted && listSubmit === false ?
                                <>Add to the list</>
                                // checking if there is a 10th index of the userMovies state array that holds our object with our data from firebase (10th index stands for the submitted property, which in our case is only true or existent in the first place when the user has actually submitted. Like this we can still have access to that condition even outside our list submit handler which then allows us to display messages accordingly if the user tries to submit/add movies to his list for the same year again)
                                : userMovies[10] ?
                                <>Already submitted</>
                                : <>Add to the list</>

                            }
                            {/* for lists that have been submitted, also disable buttons for that particular year and display a message that tells the user that he already submitted his list for that year and show a button that brings him to his results for that,
                            also maybe give opportunity for user to show how he did for every list submission (could be his dashboard tailored to that user, which then can be shared, not just from one year, but for all the years the user has decided to submit a list for), can also maybe show an option to restart the game in general (either as a different user or the same user (if database allows, but how do we make sure that other users don't use the same username?)) */}
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