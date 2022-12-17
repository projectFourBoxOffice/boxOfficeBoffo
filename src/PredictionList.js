// PredictionList component

const PredictionList = ({allFilteredMovies, userMovies, faultySubmit, deleted, handleRemoveClick, listSubmit, handleConfirm, handleListSubmit, handleMovieRating, userRating}) => {


    return(
        <section className="predictionList">
            <ul>
            {userMovies.map((movieObj) => {
                return(
                // using our key for our firebase object as a key prop
                <li key={movieObj.key}>
                    {/* still have to add an onChange and a value set to the user selection of the number input  */}
                    <select name="selectedList" id="selectedList" required value={userRating} onChange={handleMovieRating}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    </select>
                    {/* since now the movie properties like id and title are nested inside the corresponding year, we are using movieYear (as a parameter in the map and here) */}
                    <p>{movieObj.userMovieTitle}</p>
                    <button onClick={() => handleRemoveClick(movieObj.key, movieObj.userMovieId)}>Remove</button>
                </li>
                )
              })
            }
            </ul>
            {
            faultySubmit && deleted === false ? 
            <div>
                <p>You cannot submit your list if you have not added 10 movies</p>
            </div> 
            : null
            }
            {
            deleted === false && userMovies.length !== 0 ? 
            <button onClick={handleConfirm}>Delete List</button>
            : null
            }
            {
            listSubmit === false && deleted === false && userMovies.length !== 0 ?
            <button onClick={handleListSubmit} type="submit">Submit</button>
            : null
            }
        </section>
    )
}
export default PredictionList;