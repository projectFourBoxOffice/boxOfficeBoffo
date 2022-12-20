// Display Movies component to return data from our API call
// importing a placeholder img for movies without poster_path
import MoviePlaceholder from './movie_default.png';

// passing in the value stored in the movies state as a prop and destructuring it
const DisplayMovies = ({allFilteredMovies, handleClick, limitClick, endReached, userMovies, movieYear, clickedIdsHashMap, deleted, loading, dataCounter, userIdsArray, listSubmit, alreadySubmitted, submitted }) => {

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
                                onClick={handleClick}
                                // using the dataCounter state or the array length of our userMovies state array to check whether 10 movies have been added or not (still able to access that information even after going to a different year and then coming back to that year again without having submitted) or whether the list for that particular year has already been submitted (just added in a submitted property every time the user submits successfully, so that 10th index is only truthy upon submission, like this we can disable buttons for only those years)
                                disabled={dataCounter === 10 || userMovies.length === 10 || userMovies[10] ? true : limitClick}
                                // disabled={limitClick || (clickedIdsHashMap.get(movie.id) === 1 ? true : false)}
                            >
                                {/* also make sure that added button stays disabled when user goes to next year without having submitted and returns back to that year, so that he knows that that particular item has been added */}
                            {movie.added === true && userMovies.length < 10 && deleted === false && listSubmit === false ? 
                                <>Added</>
                                // : userIdsArray.find(item => item === movie.id) === movie.id && dataCounter !== 0 && dataCounter !== 10 && listSubmit === false ?
                                // <>Added</>
                                // : movie.added === false && userMovies.length < 10 && deleted === false ?
                                // <>Add</>   
                                : userMovies.length === 10 && deleted === false && listSubmit === false ?
                                <>Added 10 items to the list</>
                                : movie.added === false && userMovies.length < 10 && listSubmit === false ?
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