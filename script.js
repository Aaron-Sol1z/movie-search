const movieSearch = document.querySelector(".movieSearch");
const titleInput = document.querySelector(".titleInput");
const yearInput = document.querySelector(".yearInput");
const result = document.querySelector(".result");
const api_key = config.MY_KEY;

movieSearch.addEventListener("submit", async event => {
    event.preventDefault(); //prevents form refreshing page
    const movie = titleInput.value;
    const year = yearInput.value;
    if(!movie){//if there is no title in the field
        displayError("Please enter a title");
    }else{//if a title is in the field
        if(year){//if a year is in the field
            if(year.length !== 4){//invalid year
                displayError("Please enter a valid year");
            }else{//search with valid title and year
                try{
                    const movieData = await getMovieData(movie, year);//search movie title
                    displayMovieInfo(movieData);//show movie info on page
                }catch(error){
                    console.error(error);
                    displayError(error);
                }
            }
        }else{//search with valid title, no year
            try{
                const movieData = await getMovieData(movie, '');//search movie title
                displayMovieInfo(movieData);//show movie info on page
            }catch(error){
                console.error(error);
                displayError(error);
            }
        }
    }
});

async function getMovieData(movie, year){
    console.log(`Fetching data for ${movie}...`);
    let apiUrl = `https://www.omdbapi.com/?apikey=${api_key}&t=${movie}&plot=full`;
    if(year !== ""){//if there is a year in the search
        apiUrl = `https://www.omdbapi.com/?apikey=${api_key}&t=${movie}&y=${year}&plot=full`;
    }
    const response = await fetch(apiUrl);
    console.log(response);
    if(!response.ok){
        throw new Error("Could not fetch data for this title.");
    }
    return await response.json();
}

function displayMovieInfo(data){
    console.log(data);
    if(data.Response === 'False'){
        displayError(`Oops. This doesn't seem to exist. Either: 1) ensure the movie title is spelled correctly, 2) ensure the year is correct, 3) exclude the year from the search`);
    }else{
        const {Title: title,
            Year: year,
            Poster: poster,
            Rated: rated,
            Released: released,
            Runtime: runtime,
            Genre: genre,
            Director: director,
            Writer: writer,
            Actors: actors,
            Plot: plot,
            Type: type,
            totalSeasons: seasons
        } = data;
        result.textContent = ""; //reset text if any exists
        result.style.display = "block";
        //title and year
        const titleDisplay = document.createElement("h1");
        titleDisplay.textContent = `${title} (${year})`;
        titleDisplay.classList.add("titleDisplay");
        result.appendChild(titleDisplay);
        //poster
        const posterDisplay = document.createElement("img");
        posterDisplay.src = `${poster}`;
        posterDisplay.classList.add("posterDisplay");
        result.appendChild(posterDisplay);
        //rating
        const ratedDisplay = document.createElement("p");
        ratedDisplay.textContent = `Rated ${rated}`;
        ratedDisplay.classList.add("ratedDisplay");
        result.appendChild(ratedDisplay);
        //released
        const releasedDisplay = document.createElement("p");
        const formattedDate = convertReleaseDate(released);
        if(type === "movie"){//release date (movie)
            releasedDisplay.textContent = `Release date: ${formattedDate}`;
        }else if(type === "series"){//premiere date (series)
            releasedDisplay.textContent = `Premiere date: ${formattedDate}`;
        }
        releasedDisplay.classList.add("releasedDisplay");
        result.appendChild(releasedDisplay);
        //runtime
        if(type === "movie"){
            const runtimeDisplay = document.createElement("p");
            const formattedTime = convertRuntime(runtime);
            runtimeDisplay.textContent = `Runtime: ${formattedTime}`;
            runtimeDisplay.classList.add("runtimeDisplay");
            result.appendChild(runtimeDisplay);
        }
        //total seasons
        if(type === "series"){
            const seasonsDisplay = document.createElement("p");
            seasonsDisplay.textContent = `Total Seasons: ${seasons}`;
            seasonsDisplay.classList.add("seasonsDisplay");
            result.appendChild(seasonsDisplay);
        }
        //genre
        const genreDisplay = document.createElement("p");
        genreDisplay.textContent = `Genre: ${genre}`;
        genreDisplay.classList.add("genreDisplay");
        result.appendChild(genreDisplay);
        //director
        if(director !== "N/A"){
            const directorDisplay = document.createElement("p");
            if(director.includes(",")){//singular or plural
                directorDisplay.textContent = `Directors: ${director}`;
            }else{
                directorDisplay.textContent = `Director: ${director}`;
            }
            directorDisplay.classList.add("directorDisplay");
            result.appendChild(directorDisplay);
        }
        //writer
        if(writer !== "N/A"){
            const writerDisplay = document.createElement("p");
            if(writer.includes(",")){//singular or plural
                writerDisplay.textContent = `Writers: ${writer}`;
            }else{
                writerDisplay.textContent = `Writer: ${writer}`;
            }
            writerDisplay.classList.add("writerDisplay");
            result.appendChild(writerDisplay);
        }
        //actors
        const actorDisplay = document.createElement("p");
        actorDisplay.textContent = `Starring: ${actors}`;
        actorDisplay.classList.add("actorDisplay");
        result.appendChild(actorDisplay);
        //plot
        const plotDisplay = document.createElement("p");
        plotDisplay.textContent = `Plot: ${plot}`;
        plotDisplay.classList.add("plotDisplay");
        result.appendChild(plotDisplay);
    }
}

function convertReleaseDate(date){
    //convert day
    let day = date.slice(0, 2);
    if(day.startsWith("0")){
        day = day.charAt(1);
    }
    //convert month
    let month = date.slice(3, 6);
    let longMonth = "";
    switch(month){
        case "Jan":
            longMonth = "January";
            break;
        case "Feb":
            longMonth = "February";
            break;
        case "Mar":
            longMonth = "March";
            break;
        case "Apr":
            longMonth = "April";
            break;
        case "May":
            longMonth = "May";
            break;
        case "Jun":
            longMonth = "June";
            break;
        case "Jul":
            longMonth = "July";
            break;
        case "Aug":
            longMonth = "August";
            break;
        case "Sep":
            longMonth = "September";
            break;
        case "Oct":
            longMonth = "October";
            break;
        case "Nov":
            longMonth = "November";
            break;
        case "Dec":
            longMonth = "December";
            break;
        default:
            console.log(`${month} is not a month`);
    }
    //convert year
    let year = date.slice(7, 11);
    let newDate = "";
    return newDate.concat(longMonth, " ", day, ", ", year);
}

function convertRuntime(time){
    let temp = Number(time.slice(0, time.indexOf(" ")));//from start to first space
    let hour = 0;
    let min = 0;
    while(temp != 0){
        if(!(temp - 60 <= 0)){//if time - 60 minutes isn't 0
            hour+= 1;
            temp-= 60;
        }else{//when no more hours
            min = temp;
            temp = 0;
        }
    }
    if(min === 60){//convert 60 minutes to 1 hour
        hour+= 1;
        min = 0;
    }
    //singular or plural
    let hourText = "";
    let minuteText = "";
    if(hour === 0){
        hourText = ``;
    }else if(hour === 1){
        hourText = `${hour} hr`;
    }else{
        hourText = `${hour} hrs`;
    }
    if(min === 0){
        minuteText = ``;
    }else if(min === 1){
        minuteText = `${min} min`;
    }else{
        minuteText = `${min} mins`;
    }
    //return based on hours and minutes
    if(hourText === ""){
        return `${minuteText}`;
    }else if(minuteText === ""){
        return `${hourText}`;
    }
    return `${hourText} ${minuteText}`;
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    result.textContent = "";
    result.style.display = "block";
    result.appendChild(errorDisplay);
}