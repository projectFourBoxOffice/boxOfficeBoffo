// ListSubmission.js for when user has submitted list (what shows up immediately)

const ListSubmission = ( {handleShowSubmitted} ) => {
    return(
        
        <div className="userNotification">
            <div className="wrapper">
              <p>Your List Has Been Submitted</p>
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