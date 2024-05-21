const movieSearch = document.querySelector(".movieSearch");
const titleInput = document.querySelector(".titleInput");
const result = document.querySelector(".result");
const api_key = config.MY_KEY;

movieSearch.addEventListener("submit", async event => {
    event.preventDefault(); //prevents form refreshing page
    const movie = titleInput.value;
    console.log(`Movie: ${movie}`);
    if(movie){//if a title is in the text field, search for the title
        try{
            const movieData = await getMovieData(movie);//search movie title
            displayMovieInfo(movieData);//show movie info on page
        }catch(error){
            console.error(error);
            displayError(error);
        }
    }else{
        displayError("Please enter a title");
    }
});

async function getMovieData(movie){
    const apiUrl = `https://www.omdbapi.com/?apikey=${api_key}&t=${movie}&plot=full`;
    const response = await fetch(apiUrl);
    console.log(response);
    if(!response.ok){
        throw new Error("Could not fetch data for this title");
    }
    return await response.json();
}

function displayMovieInfo(data){
    console.log(data);
    if(data.Response === 'False'){
        displayError("Oops. This doesn't seem to exist.");
    }else{
        const {Title: movie,
            Year: year,
            Poster: poster,
            Rated: rated,
            Released: released,
            Runtime: runtime,
            Genre: genre,
            Director: director,
            Writer: writer,
            Actors: actors,
            Plot: plot
        } = data;
        result.textContent = ""; //reset text if any exists
        result.style.display = "block";
        //create elements
        const titleDisplay = document.createElement("h1");
        const posterDisplay = document.createElement("img");
        const ratedDisplay = document.createElement("p");
        const releasedDisplay = document.createElement("p");
        const runtimeDisplay = document.createElement("p");
        const genreDisplay = document.createElement("p");
        const directorDisplay = document.createElement("p");
        const writerDisplay = document.createElement("p");
        const actorDisplay = document.createElement("p");
        const plotDisplay = document.createElement("p");
        //add content to elements
        titleDisplay.textContent = `${movie} (${year})`;
        posterDisplay.src = `${poster}`;
        ratedDisplay.textContent = `Rated ${rated}`;
        releasedDisplay.textContent = `Release date: ${released}`;
        runtimeDisplay.textContent = `Runtime: ${runtime}`;
        genreDisplay.textContent = `Genre: ${genre}`;
        directorDisplay.textContent = `Directors: ${director}`;
        writerDisplay.textContent = `Writers: ${writer}`;
        actorDisplay.textContent = `Starring: ${actors}`;
        plotDisplay.textContent = `Plot: ${plot}`;
        //add style classes to elements
        titleDisplay.classList.add("titleDisplay");
        posterDisplay.classList.add("posterDisplay");
        ratedDisplay.classList.add("ratedDisplay");
        releasedDisplay.classList.add("releasedDisplay");
        runtimeDisplay.classList.add("runtimeDisplay");
        genreDisplay.classList.add("genreDisplay");
        directorDisplay.classList.add("directorDisplay");
        writerDisplay.classList.add("writerDisplay");
        actorDisplay.classList.add("actorDisplay");
        plotDisplay.classList.add("plotDisplay");
        //append element to page
        result.appendChild(titleDisplay);
        result.appendChild(posterDisplay);
        result.appendChild(ratedDisplay);
        result.appendChild(releasedDisplay);
        result.appendChild(runtimeDisplay);
        result.appendChild(genreDisplay);
        result.appendChild(directorDisplay);
        result.appendChild(writerDisplay);
        result.appendChild(actorDisplay);
        result.appendChild(plotDisplay);
    }
    
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    result.textContent = "";
    result.style.display = "block";
    result.appendChild(errorDisplay);
}