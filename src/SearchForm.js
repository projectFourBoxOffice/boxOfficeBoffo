// Search Form component for search bar

// passing in the values stored inside submit handler, change handler and userSearch state (with user input value) as props and destructuring them
const SearchForm = ({handleSearchSubmit, userSearch, handleSearchInput, movieYear, searchSubmit, loading, listSubmit, dataCounter, userMovies, handleShowList, alreadySubmitted, submitted}) => {

    return(
        <div className="wrapper">
            <form onSubmit={handleSearchSubmit} id="search">
                <label htmlFor="userSearch">Search for summer movies between the years 1900 and 2022. Then add 10 of those to a prediction list for the movies that you think were the highest grossing of that year. 1 stands for highest grossing and 10 for lowest grossing. You can only submit one list per year, so choose carefully. Anyway, have fun!!!</label>
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
                    <button className="searchText" type="submit">{loading ? <>Loading..</> : <>Search</>}</button>
                </div>
                {
                    searchSubmit ?
                    <p>You searched for summer movies from the year {movieYear}.</p>
                    : null
                }
                {
                    userMovies.length === 10 && listSubmit === false && searchSubmit ?
                    <div className="userNotification">
                        <p>You already added 10 items to your list, but haven't submitted yet.</p>
                       <a 
                        href="#list" 
                        onClick={handleShowList}
                        className="searchText"
                       >Show List</a> 
                    </div>
                    : userMovies.length < 10 && listSubmit === false && searchSubmit && userMovies.length !== 0 ?
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
                    : userMovies[10] && listSubmit === false ?
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