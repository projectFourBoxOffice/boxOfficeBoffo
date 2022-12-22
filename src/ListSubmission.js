// ListSubmission.js for when user has submitted list (what shows up immediately)

const ListSubmission = ( {handleShowSubmitted, movieYear} ) => {
    return(
        
        <div className="userNotification">
            <div className="wrapper">
              <p>Your list for the year {movieYear} has been submitted successfully!</p>
              <a
              onClick={handleShowSubmitted}
              className="searchText"
              href="#list"
              >Show Results</a>
            </div> 
        </div>
        
    )
}

export default ListSubmission;