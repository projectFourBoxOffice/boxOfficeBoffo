// PredictionList component

const PredictionList = ({userMovies, faultySubmit, deleted, handleRemoveClick, listSubmit, handleConfirm, handleListSubmit, handleMovieRating, submitAttempt, ratedList, moviePositions, showClicked, movieYear, allFilteredMovies}) => {

    return(
        <section className="predictionList" id="list">
            <div className={`${userMovies[10] === undefined ? "wrapper" : "wrapper submitted"}`}>
                {
                showClicked ?
                <p>Your List for {movieYear}</p>
                : null
                } 
                <div className="listFlex">
                    <ul className={`${userMovies[10] === undefined ? "predictionList" : "submittedList"}`}>
                        {
                        userMovies[10] ?
                        <div className="listHeading">
                            <p>Your Predictions</p>
                        </div>
                        : null
                        }
                        {userMovies.map((movieObj) => {
                        return(
                        // only showing values that are not undefined (if the user has submitted something, the movie rating inside that particular 10th object dedicated to the submitted property would be empty, else we still want the undefined values to show up since the user hasn't even chosen his value yet)
                        ratedList.find(item => item === undefined) === movieObj.rating && userMovies[10] ? null
                        : 
                        // using our key for our firebase object as a key prop
                        <li key={movieObj.key}>
                            {/* still have to add an onChange and a value set to the user selection of the number input  */}
                            {
                            userMovies[10] === undefined ?
                            <>
                            <label htmlFor="selectedList" className="sr-only">Choose a number for this movie</label>
                            <select 
                            name="selectedList" 
                            id="selectedList" 
                            required
                            // setting the value of the select equal to the rating values from our database object (user input), so that user input still stays on the page even when user goes to a different year without having submitted his list for that year prior OR the default value (since if we define another defaultValue attribute with the value of default, the console will show an error because it only accepts one value attribute inside a select tag (but we still want to have the disabled option without a number as the default option that is automatically selected so that we can listen properly for when the user changes the value of the dropdown (1 won't get pushed into our database if it's already selected by default and the user won't know)))
                            value={movieObj.rating || "default"}
                            onChange={e => handleMovieRating(e, movieObj.key)}
                            // comparing user rating (input value which would also include the default value) vs the rating property from our database object (which doesn't include that default value, only values from 1 to 10)
                            className={`${movieObj.rating === undefined || movieObj.rating === "" ? "" : "selectedNumber" }`}
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
                            <p>{movieObj.userMovieTitle}</p>
                            </>
                            : ratedList.find(item => item === undefined) === movieObj.rating ? "" :
                            <div className="textContainer">
                                <p>{movieObj.rating}</p>
                                <p>{movieObj.userMovieTitle}</p>
                            </div>
                            }
                            
                            {
                            userMovies[10] === undefined ?
                            <button 
                            onClick={() => handleRemoveClick(movieObj.key, movieObj.userMovieId, movieObj.userMovieTitle)}
                            className="removeButton"
                            >Remove</button>
                            : null
                            }
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
                    userMovies[10] === undefined ?
                    <div className="buttonContainer">
                        {
                        listSubmit === false && deleted === false && userMovies.length !== 0 ?
                        <button onClick={() => handleListSubmit(userMovies)} type="submit">Submit List</button>
                        : null
                        }
                        {
                        deleted === false && userMovies.length !== 0 ? 
                        <button onClick={handleConfirm}>Delete List</button>
                        : null
                        }
                    </div>
                    : 
                    <ul className="submittedList ranking">
                        <div className="listHeading">
                            <p>Actual positions</p>
                        </div>
                        {moviePositions.map((movie, index) => {
                        return(
                        <li key={movie.id + index}>
                            <div className="textContainer">
                                <p>{movie.ranking}</p>
                                <p>{movie.original_title}</p>
                            </div>
                            
                            <div className="topTen">
                                {movie.ranking <= 10 ?
                                <p>Top ten!</p>
                                : <p>Too bad :(</p>
                                }
                            </div>
                           
                            
                        </li>
                        )
                        })}
                    </ul>
                    }
                </div>
                
                {
                showClicked !== true && allFilteredMovies.length !== 0 ?
                <a
                className="searchText"
                href="#search"
                >Back to top</a>
                : null
                }
                
           
            </div>
        </section>
    )
}
export default PredictionList;