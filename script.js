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
        const formattedDate = convertReleaseDate(released);
        releasedDisplay.textContent = `Release date: ${formattedDate}`;
        const formattedTime = convertRuntime(runtime);
        runtimeDisplay.textContent = `Runtime: ${formattedTime}`;
        genreDisplay.textContent = `Genre: ${genre}`;
        if(director.includes(",")){//singular or plural
            directorDisplay.textContent = `Directors: ${director}`;
        }else{
            directorDisplay.textContent = `Director: ${director}`;
        }
        if(writer.includes(",")){//singular or plural
            writerDisplay.textContent = `Writers: ${writer}`;
        }else{
            writerDisplay.textContent = `Writer: ${writer}`;
        }
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
    console.log(`hour: ${hour}`);
    console.log(`minute: ${min}`);
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
    console.log(`hourText = ${hourText}`);

    if(min === 0){
        minuteText = ``;
    }else if(min === 1){
        minuteText = `${min} min`;
    }else{
        minuteText = `${min} mins`;
    }
    console.log(`minuteText = ${minuteText}`);

    if(hourText == ""){
        return `${minuteText}`;
    }else if(minuteText == ""){
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