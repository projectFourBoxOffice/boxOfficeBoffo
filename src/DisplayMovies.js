// Display Movies component to return data from our API call
// importing a placeholder img for movies without poster_path
import MoviePlaceholder from './movie_default.png';

// passing in the value stored in the movies state as a prop and destructuring it
const DisplayMovies = ({allFilteredMovies}) => {

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
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster for ${movie.original_title}`} />
                                :
                                // if no poster available, set a placeholder
                                <img src={MoviePlaceholder} alt={`Placeholder poster for ${movie.original_title}`} />
                            }
                            <p>{movie.original_title}</p>
                            {/* making sure the release date of the displayed movie results match the year of the user input */}
                            <p>{movie.release_date}</p>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default DisplayMovies;
// gets imported into App.js and wrapped inside a ternary operator, so that this component mounts only when the user has submitted the search form