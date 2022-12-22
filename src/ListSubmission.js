// ListSubmission.js for when user has submitted list (what shows up immediately)

const ListSubmission = ( {handleShowSubmitted, movieYear} ) => {
    return(
        
        <div className="userNotification">
            <div className="wrapper">
              <p>Your List For The Year {movieYear} Has Been Submitted</p>
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