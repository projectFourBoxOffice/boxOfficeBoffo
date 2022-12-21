// Footer.js

const Footer = ( {allFilteredMovies, listSubmit} ) => {
    return(
    <footer className={`${allFilteredMovies.length === 0 || listSubmit ? "noMovies" : ""} `}>
        <p>Created @ <a href="https://junocollege.com/" target="_blank" rel="noopener noreferrer">Juno College of Technology</a></p>
    </footer>
    )
}

export default Footer;
