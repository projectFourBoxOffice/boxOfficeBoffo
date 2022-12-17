// Display Movies component to return data from our API call
// importing a placeholder img for movies without poster_path
import MoviePlaceholder from './movie_default.png';

// passing in the value stored in the movies state as a prop and destructuring it
const DisplayMovies = ({allFilteredMovies, handleClick, limitClick, endReached, handleRemoveClick, firebaseKey, userMovies, movieYear }) => {

    return(
        <section className='movieResults'>
            <p>Total results: {allFilteredMovies.length}</p>
            <ul>
                {/* mapping through our movies state array (containing all of our relevant movie info and data) */}
                {allFilteredMovies.map((movie) => {
                    return(
                        <li key={movie.id}>
                            {
                                movie.poster_path ?
                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`Poster for ${movie.original_title}`} />
                                :
                                // if no poster available, set a placeholder
                                <img src={MoviePlaceholder} alt={`Placeholder poster for ${movie.original_title}`} />
                            }
                            <p>{movie.original_title}</p>
                            {/* making sure the release date of the displayed movie results match the year of the user input */}
                            <p>{movie.release_date}</p>
                            <button
                                // give the button a value of the movie title that we're gonna use for our realtime database and display to the user later on (e.target.value) 
                                value={movie.original_title}
                                // give the button an id with the value of the matching movie id to the movie title (can then use e.target.id in the click handler to have more useful data in the database)
                                id={movie.id}
                                onClick={handleClick}
                                disabled={limitClick}
                            >{endReached}</button>
                           
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default DisplayMovies;
// gets imported into App.js and wrapped inside a ternary operator, so that this component mounts only when the user has submitted the search form