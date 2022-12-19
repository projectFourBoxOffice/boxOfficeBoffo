// Search Form component for search bar

// passing in the values stored inside submit handler, change handler and userSearch state (with user input value) as props and destructuring them
const SearchForm = ({handleSearchSubmit, userSearch, handleSearchInput, movieYear, searchSubmit, loading}) => {

    return(
        <div className="wrapper">
            <form onSubmit={handleSearchSubmit}>
                <label htmlFor="userSearch">Search for summer movies between the years 1900 and 2022</label>
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
                    <p className="searchText">You searched for summer movies from the year {movieYear}.</p>
                    : null
                }
                
            
            </form>
        </div>
    )
}

export default SearchForm;

// gets imported into App.js