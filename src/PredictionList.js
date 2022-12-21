// PredictionList component



// importing firebase
import app from './firebase.js';
import { getDatabase, ref, remove, update } from 'firebase/database';

// importing useParams
import { useParams } from "react-router-dom";
import { useState } from 'react';

const PredictionList = ( {userMovies, faultySubmit, deleted, listSubmit, handleConfirm, handleListSubmit, submitAttempt, ratedList, movieYear, clickedIdsHashMap, setSubmitAttempt, updatedMovies, targeted, movieIdsArray, selectedTitle, setAllFilteredMovies, setLimitClick, ratingArray} ) => {

    // destructuring our useParams object
    const {userName} = useParams();
    console.log(userName);

    const [userRating, setUserRating] = useState("");

   
    // handle user input change from dropdown inside the prediction list
    // passing in the event object and the key property taken from our map in the prediction list component as parameters inside our input change handler to update the object in our database at the right location
    const handleMovieRating = (e, key) => {
        console.log(key);
        console.log(e.target.value);
        setUserRating(e.target.value);
        console.log(userRating);
    
        // defining an object with a rating property to update our object in our database with that new property
        // like this we can store each one of those user input values in an array (while looping through our state containing those objects) and then determine whether there are undefined values included (ie. when the user hasn't even touched the dropdown) and whether there are values that repeat themselves (setting up conditions based on that later on for list submission)
        const userInput = {
            rating: e.target.value
        }
        console.log(e.target.value);

        // movie.rating = e.target.value;
        const database = getDatabase(app);
        // const dbRef = ref(database);

        // nesting our soon to be declared object inside a collection called Predictions that contains collections of data per movieYear (adding in the movie info under the specific/matching year with the reference path) (referenced intro to firebase lesson from the notes)
        // this seems to have solved the different lists per year issue
        const predictionRef = ref(database, `Predictions/${userName}/${movieYear}/movies/${key}`);
        update(predictionRef, userInput);
        
        // setUserRating(e.target.value);
        setSubmitAttempt(false);
        console.log(e.target.value);
    }

  

    // click handler for remove button (for each single list item)
    // pass in two parameters, one for the node to remove (the path under which the whole node for each list item lives) and another one for the user movie id (the id of the targeted add button)
    const handleRemoveClick = (nodeToRemove, userMovieId) => {
        console.log(nodeToRemove);
        // console.log(userMovieId);
        console.log(userMovieId);
        const database = getDatabase(app);
        const predictionRef = ref(database, `Predictions/${userName}/${movieYear}/movies/${nodeToRemove}`);
        remove(predictionRef);
        setSubmitAttempt(false);
        // setRatedList([]);
        // setRemoved(true);

        // here the ids array does include the user movies id
        // issue: when one item at a time gets removed, the item that is still supposed to stay added (wasn't removed), still changes back to add to the list (only happens when another item gets removed)
        // was able to fix it, but theoretically this issue shouldn't be, there is a bit of a delay between the movie title from our API object and the value of the targeted button (should both be the same values)
        const removedMovies = updatedMovies.map((movie) => {
        if (movie.idsArray.includes(targeted.id)) {
            console.log(movieIdsArray);
            // console.log(e.currentTarget.id, e.currentTarget.value);
            console.log(movie.idsArray.includes(userMovieId));
            console.log(userMovieId, selectedTitle);
            console.log(movie.id, movie.original_title);
            console.log(targeted.id, targeted.value);
            console.log("Hello");
            // use the clickedIdsHashMap state to grab the user movie id that is also equal to the id of the add button (representing the movie choice) and set the disabled property to false (in order to undo the disabling of that individual button that happens when the user has clicked on the movie already)
            clickedIdsHashMap.get(userMovieId).disabled = false;
            // removeClickedIdsHashMap(userMovieId);
            clickedIdsHashMap.delete(userMovieId);
            console.log(clickedIdsHashMap);
            let added = false;
            // return {...movie, added: added};
            return {...movie, added: added};
        }
        
        else {
            console.log("Really?");
            // return {...movie, added: true};
        }
        return movie;
        })
        console.log(removedMovies);
        setAllFilteredMovies(removedMovies);

        

        setLimitClick(false);
    }

    console.log(userMovies);
    console.log(movieYear);


    const handleUserListSubmit = (userMovies) => {
        handleListSubmit(userMovies);
        console.log(userMovies);

        // updating the states that we will use as conditions to determine whether to show the prediction list or not (or the submit message)
        if (userMovies.length === 10 && ratingArray.every((element, index, array) => array.indexOf(element) === index) === true && !ratingArray.includes(undefined) && ratingArray.length === 10){
            // defining an object with a submitted property to update our object in our database with that new property
            // like this we can know for later if user has already submitted that list, so if that is true, we can notify the user in case he decides to come back later to the same year
            let submitted = true;
            const listSubmission = {
            submitted: submitted
            }
            console.log(submitted);
            // setAlreadySubmitted(submitted);
    
            // movie.rating = e.target.value;
            const database = getDatabase(app);
            // const dbRef = ref(database);
    
            // referencing the movieYear as the last path since we don't want to have the submitted property for each movie but for each year (each list per year)
            const predictionRef = ref(database, `Predictions/${userName}/${movieYear}/movies`);
            const submitObj = update(predictionRef, listSubmission);
            console.log(submitObj);
            const submissionRef =  ref(database, `Predictions/${userName}/${movieYear}/${submitted}`);
            const submissionObj = submissionRef._path.pieces_[2];
            console.log(submissionObj);
            
            // if (submissionObj === true) {
            //   setSubmitted(true);
            // }
            console.log(submitted);
            console.log(userMovies.submitted);
            
        } 
        
    }


    const deleteHandler = () => {
        handleConfirm();
        if (window.confirm("Are you sure you want to delete this list")) {
            const database = getDatabase(app);
            const predictionRef = ref(database, `Predictions/${userName}/${movieYear}/movies`);
            remove(predictionRef);
            // clickedIdsHashMap.get().disabled = false;
      
            // mapping through our userMovies array with our objects from our database to set the disabled property of each item back to false
            userMovies.map((userMovieObj) => {
                console.log(userMovieObj);
                return clickedIdsHashMap.get(userMovieObj.userMovieId).disabled = false;
            })
            console.log(clickedIdsHashMap);
      
            // clearing the hash map state again when user has confirmed to delete entire list
            clickedIdsHashMap.clear();
            console.log(clickedIdsHashMap);
        }
    }

    return(
    <section className="predictionList" id="list">
        <div className="wrapper">
            
            <ul className="predictionList">
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
                    : ratedList.find(item => item === undefined) === movieObj.rating ? "" :
                    <p>{movieObj.rating}</p>
                    }
                    
                    {/* since now the movie properties like id and title are nested inside the corresponding year, we are using movieYear (as a parameter in the map and here) */}
                    <div className="textContainer">
                        <p>{movieObj.userMovieTitle}</p>
                    </div>
                    {/* we don't want to have a remove button present when the user has already submitted his list since he shouldn't be able to change it after submissiom */}
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
                <button onClick={() => handleUserListSubmit(userMovies)} type="submit">Submit List</button>
                : null
                }
                {
                deleted === false && userMovies.length !== 0 ? 
                <button onClick={deleteHandler}>Delete List</button>
                : null
                }
            {/* another idea: go back to top anchor tag (styled like a button) to have user be able to navigate more easily throughout movie options and list */}
            </div>
            : null
            }
           
            </div>
        </section>
    )
}
export default PredictionList;