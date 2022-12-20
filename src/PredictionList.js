// PredictionList component
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, push, remove, update } from 'firebase/database';
import app from './firebase.js';
import { useEffect, useState } from 'react';

const PredictionList = ({allFilteredMovies, userMovies, faultySubmit, deleted, handleRemoveClick, listSubmit, handleConfirm, handleListSubmit, handleMovieRating, userRating, repetition, submitAttempt, invalidInput, ratedList}) => {

    
    const {userNameParam} = useParams();
    console.log(userNameParam);

    const [userMovies, setUserMovies] = useState([]);

    useEffect(() => {
    
        const database = getDatabase(app);
        // const dbRef = ref(database);
        // giving our database a reference under predictions (a bit more structured)
        // nesting our soon to be declared object (click handler) inside a collection called Predictions that contains collections of the data invoked by the user per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
        // like this we already got the data sorted into different collections based on the year
        const predictionRef = ref(database, `Predictions/${userNameParam}/${movieYear}/movies`);
        
        onValue( predictionRef, (response) => {
          const data = response.val();
          const newState = [];
    
          for(let key in data){
            newState.push({key, ...data[key]});
          }   
          
          setUserMovies(newState);
          
        })
        // adding in movieYear state here inside the dependency array to avoid missing dependency error (thankfully not too hard on the data as opposed to the whole userMovies state array)
      }, [movieYear])

    return(
        <section className="predictionList">
            <div className="wrapper">

            
            <ul className="predictionList">
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
                    className={`${movieObj.rating === undefined || movieObj.rating === "" ? "" :  "selectedNumber"}`}
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
                    <div className="textContainer">
                        <p>{movieObj.userMovieTitle}</p>
                    </div>
                    <button 
                    onClick={() => handleRemoveClick(movieObj.key, movieObj.userMovieId)}
                    className="removeButton"
                    >Remove</button>
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
            <div className="buttonContainer">
            {
            listSubmit === false && deleted === false && userMovies.length !== 0 ?
            <button onClick={handleListSubmit} type="submit">Submit List</button>
            : null
            }
            {
            deleted === false && userMovies.length !== 0 ? 
            <button onClick={handleConfirm}>Delete List</button>
            : null
            }
            </div>
            </div>
        </section>
    )
}
export default PredictionList;