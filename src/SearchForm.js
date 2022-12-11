// Search Form component for search bar

// passing in the values stored inside submit handler, change handler and userSearch state (with user input value) as props and destructuring them
const SearchForm = ({handleSearchSubmit, userSearch, handleSearchInput}) => {

    return(
        <form onSubmit={handleSearchSubmit}>
            <label htmlFor="userSearch">Search for a year</label>
            {/* have an input with the type number so that the user can only search for a year */}
            <input 
                type="number" 
                id="userSearch"
                placeholder="2019"
                name="userSearch"
                onChange={handleSearchInput}
                value={userSearch}
                required
            />
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchForm;

// gets imported into App.js