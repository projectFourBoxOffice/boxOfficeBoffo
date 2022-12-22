// Display Movies component to return data from our API call
// Importing a placeholder image for movies without poster_path
import MoviePlaceholder from './movie_default.png';

// Passing in the value stored in the movies state as a prop and destructuring it
const DisplayMovies = ({allFilteredMovies, handleClick, limitClick, userMovies, deleted, loading, dataCounter, listSubmit, searchError, userTitleArray}) => {

    return(
        <section className="movieResults">
            <div className="wrapper">
                {
                allFilteredMovies.length !== 0 && searchError === false ?
                <p>Total results: {allFilteredMovies.length}</p>
                : <p>Loading...</p>
                }
              
              <ul>
                {/* Mapping through our movies state array (containing all of our relevant movie info and data) */}
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
                                // If no poster available, set a placeholder
                                <img src={MoviePlaceholder} alt={`Placeholder poster for ${movie.original_title}`} />
                            }
                            </div>
                            <div className="titleContainer">
                                <p>{movie.original_title}</p>
                            </div>
                            
                            {/* Making sure the release date of the displayed movie results match the year of the user input */}
                            <p>{movie.release_date}</p>
                            <button
                                // Give the button a value of the movie title that we're gonna use for our realtime database and display to the user later on (e.target.value) 
                                value={movie.original_title}
                                // Give the button an id with the value of the matching movie id to the movie title (can then use e.target.id in the click handler to have more useful data in the database)
                                id={movie.id}
                                onClick={e => handleClick(e, movie.ranking)}
                                // Using the dataCounter state or the array length of our userMovies state array to check whether 10 movies have been added or not (still able to access that information even after going to a different year and then coming back to that year again without having submitted) or whether the list for that particular year has already been submitted (just added in a submitted property every time the user submits successfully, so that 10th index is only truthy upon submission, like this we can disable buttons for only those years)
                                disabled={dataCounter === 10 || userMovies.length === 10 || userMovies[10] ? true : userTitleArray.includes(movie.original_title) && userMovies.length < 10 && deleted === false ? true : limitClick}
                                // giving the buttons that are disabled a className in order to set cursor property back to default (have to specify that deleted is false)
                                className={`${dataCounter === 10 || userMovies.length === 10 || userMovies[10] || limitClick ? "weaker" : deleted === false && movie.added === true ? "weaker" : userTitleArray.includes(movie.original_title) && userMovies.length < 10 && deleted === false ? "weaker" : ""}`}
                            >
                            {movie.added === true && userMovies.length < 10 && deleted === false ? 
                                <>Added</> 
                                : userTitleArray.includes(movie.original_title) && userMovies.length < 10 && deleted === false ?
                                <>Added</> 
                                : userMovies.length === 10 && deleted === false && listSubmit === false ?
                                <>Added 10 items to the list</>
                                : movie.added === false && userMovies.length < 10 && listSubmit === false ?
                                <>Add to the list</>
                                : deleted && listSubmit === false ?
                                <>Add to the list</>
                                // Checking if there is a 10th index of the userMovies state array that holds our object with our data from firebase (10th index stands for the submitted property, which in our case is only true or existent in the first place when the user has actually submitted. Like this we can still have access to that condition even outside our list submit handler which then allows us to display messages accordingly if the user tries to submit/add movies to his list for the same year again)
                                : userMovies[10] ?
                                <>Already submitted</>
                                : <>Add to the list</>
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
