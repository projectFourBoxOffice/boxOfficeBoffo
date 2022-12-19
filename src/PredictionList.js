// PredictionList component

const PredictionList = ({allFilteredMovies, userMovies, faultySubmit, deleted, handleRemoveClick, listSubmit, handleConfirm, handleListSubmit, handleMovieRating, userRating, repetition, submitAttempt, invalidInput, ratedList}) => {


    return(
        <section className="predictionList">
            <ul>
                {/* {
                    ratedList.every((e, i, a) => a.indexOf(e) === i) === false && deleted === false && submitAttempt === false ?
                    <p>Sorry, make sure the numbers don't repeat themselves</p>
                    :
                    null
                } */}
            {userMovies.map((movieObj) => {
                return(
                // using our key for our firebase object as a key prop
                <li key={movieObj.key}>
                    {/* still have to add an onChange and a value set to the user selection of the number input  */}
                    <select 
                    name="selectedList" 
                    id="selectedList" 
                    required 
                    value={userRating.userMovieTitle} 
                    onChange={e => handleMovieRating(e, movieObj.key)}
                    defaultValue={"default"}
                    >
                        <option value={"default"} disabled>Pick a number</option>
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
            faultySubmit && deleted === false && ratedList.every((element, index, array) => array.indexOf(element) === index) === true && submitAttempt && !ratedList.includes(undefined) ? 
            <div>
                <p>You cannot submit your list if you have not added 10 movies.</p>
            </div> 
            : ratedList.every((element, index, array) => array.indexOf(element) === index) === false && deleted === false && submitAttempt && !ratedList.includes(undefined) ?
            <div>
                <p>You cannot submit your list if the numbers of your list items repeat themselves.</p>
            </div>
            : userMovies.length !== 10 && ratedList.every((element, index, array) => array.indexOf(element) === index) === false && deleted === false && submitAttempt && !ratedList.includes(undefined) ?
            <div>
                <p>Make sure your list has 10 movies and the numbers don't repeat themselves.</p>
            </div>
            : ratedList.includes(undefined) && userMovies.length === 10 && submitAttempt && deleted === false ?
            <div>
                <p>You cannot submit your list if you haven't chosen a number for each movie.</p>
            </div>
            : submitAttempt && ratedList.includes(undefined) && userMovies.length !== 10 && deleted === false ?
            <div>
                <p>Make sure you have added 10 movies to your list and numbers for each movie.</p>
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