// Header.js

const Header = ( {userSubmitHandler, userNameHandler, userName} ) => {
    return(
        <header>
            <h1>Box Office Boffo</h1>
            {/* only display the username form when the user hasn't given one yet (at the beginning before submitting the form) */}
            {
                userName === "" || userName === undefined ?
                // username form 
                <form onSubmit={userSubmitHandler}>
                    <label htmlFor="userName">Create your username to start the game</label>
                    <input type="text" id='userName' onChange={userNameHandler} value={userName}/>
                    <button type="submit">Start Game</button>
                </form>
                : null
            }
            
        </header>
    )
}

export default Header;