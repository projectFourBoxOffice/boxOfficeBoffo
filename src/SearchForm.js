// Search Form component for search bar

// Passing in the values stored inside submit handler, change handler and userSearch state (with user input value) as props and destructuring them
const SearchForm = ({handleSearchSubmit, userSearch, handleSearchInput, movieYear, searchSubmit, loading, listSubmit, userMovies, handleShowList, searchError, allFilteredMovies}) => {

    return(
        <div className="wrapper">
            <form onSubmit={handleSearchSubmit} id="search" aria-label="search form">
                <label htmlFor="userSearch">Search for summer movies between the years 1900 and 2022, add 10 movies to your prediction list that you think were the highest grossing of that year, and then order them from highest grossing (10) to lowest grossing (1). You can only submit one list per year. Have fun!</label>
                <div className="searchBar">
                    {/* have an input with the type number so that the user can only search for a year */}
                    <input 
                        type="number" 
                        id="userSearch"
                        placeholder="2022"
                        // controlling the user input with min and max, so that user can only search for summer movies between the years 1900 and 2022 (most recent)
                        min={1900}
                        max={2022}
                        name="userSearch"
                        onChange={handleSearchInput}
                        value={userSearch}
                        required
                    />
                    <button className="searchText" type="submit" aria-label="Click this button to start searching">{searchSubmit && allFilteredMovies.length === 0 ? <>Loading..</> : loading ? <>Loading..</> : <>Search</>}</button>
                </div>
                {
                    searchSubmit && allFilteredMovies.length !== 0 ?
                    <p>You searched for summer movies from the year {movieYear}.</p>
                    : searchSubmit && allFilteredMovies.length === 0 ?
                    <p>You are searching for summer movies from the year {movieYear}.</p>
                    // error message in case something goes wrong with API
                    : searchError ?
                    <p>Sorry, something went wrong.</p>
                    : null
                }
                {
                    userMovies.length === 10 && listSubmit === false && searchSubmit && allFilteredMovies.length !== 0 ?
                    <div className="userNotification">
                        <p>You already added 10 items to your list, but haven't submitted yet.</p>
                        <a 
                        href="#list" 
                        onClick={handleShowList}
                        className="searchText"
                       >Show List</a> 
                    </div>
                    : userMovies.length < 10 && listSubmit === false && searchSubmit && userMovies.length !== 0 && allFilteredMovies.length !== 0 ?
                    <div className="userNotification">
                        {userMovies.length > 1 ? 
                        <p>You added {userMovies.length} items to your list, but haven't submitted yet.</p>
                        : <p>You added {userMovies.length} item to your list, but haven't submitted yet.</p>
                        }
                       <a 
                        href="#list" 
                        onClick={handleShowList}
                        className="searchText"
                       >Show List</a> 
                    </div>
                    : userMovies[10] && listSubmit === false && allFilteredMovies.length !== 0 ?
                    <div className="userNotification">
                        <p>You already submitted a list for this year.</p>
                        <a
                        onClick={handleShowList}
                        className="searchText"
                        href="#list"
                        >Show Results</a>
                    </div>
                    : null
                }
            </form>
        </div>
    )
}

export default SearchForm;

// gets imported into App.js