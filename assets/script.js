const APIKey = "4d83e60df2919987d44e561a0cc747ee";
const lsKey = "weatherSearches"
const searchesDiv = $("#searches");
const searchInput = $("#searchInput");
const searchButton = $("#searchBtn");
const currentWeatherDiv = $("#currentWeather");
const forecastDiv = $("#forecast");
const clearBtn = $("#clear");
var storedSearches = getStoredSearches();
var addedCity = newCity();
var units = {deg:"C",speed:"kph"};
// Here we are building the URL we need to query the database
//var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+CityQuery+"&units=metric&appid="+APIKey;
//var iconUrl = "https://openweathermap.org/img/wn/"+icon+"@2x.png"

function init(){
    buildSearchHistory();
    searchInput.on("keyup", function (event){
         // "13" represents the enter key
        if (event.key === "Enter") {
            searchButtonClicked();
        }
    });
    searchButton.on("click", searchButtonClicked );
    clearBtn.on("click",function(){clearLocalStorage(lsKey)});    
}

function buildSearchHistory(){
    searchesDiv.empty();
    if(storedSearches != null){
        storedSearches.forEach(element => {
            searchesDiv.append(
                $("<button>")
                    .text(correctCase(element.city) +", "+element.country.toUpperCase())
                    .on("click", function (){                        
                        getWeather(element);
                    })
            );
        });
    }
}

function searchButtonClicked(){
    let cityVal = searchInput.val().trim();
    let city = newCity(cityVal, null);       
    getWeather(city);
    searchInput.val("");        
}


function getWeather(city){
    addedCity = city; 
    let queryURLCurrent = "";
    let queryURLForcast = "";

    if(city.country == null){
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+"&units=metric&appid="+APIKey;
        queryURLForcast = "";
    }else{
        
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+","+city.country+"&units=metric&appid="+APIKey;
        queryURLForcast = "";
    }
    
    performAPIGETCall(queryURLCurrent, getCurrentWeather);
    //performAPIGETCall(queryURLForecast, getWeatherForcast);    
}

function getCurrentWeather(data){
    //console.log(data);
    if(data != null){
        currentWeatherDiv.empty();
        currentWeatherDiv.append(
                            $("<h2>").text(correctCase(data.name)+", "
                                    +data.sys.country.toUpperCase()+" "
                                    +moment.unix(data.dt).format("dddd, MMM Do YYYY"))
                                    .append($("<img>").attr("src", "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png"))
                            ,$("<p>").text("Temperature: " + data.main.temp + "°"+units.deg)
                            ,$("<p>").text("Humidity: "+ data.main.humidity+"%")
                            ,$("<p>").text("Wind Speed: "+ data.wind.speed+" "+units.speed)
                            ,$("<p>").text("UV Index: ").append($("<div>").attr("id", "UVIndex"))
        );

        let UVqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+data.coord.lat+"&lon="+data.coord.lon;
        
        performAPIGETCall(UVqueryURL,getUV);

        if(addedCity.country == null){
            addedCity.country = data.sys.country;
            addedCity.city = data.name;
            addNewSearch(addedCity);
            addedCity = null;
        }
        
    }else{
        alert("Something went wrong getting current weather data, please try again");
    }            
}

function getWeatherForecast(data){
    if(data != null){

    }else{
        alert("Something went wrong getting forecast data, please try again");
    }
}

function getUV(data){
    if(data != null){
        let UVIndex = data.value;
        let UVDiv = $("#UVIndex");
        let UVbg = null;
        let textColor = null;
        if(UVIndex < 2){
            UVbg = "green";
            textColor = "white";
        }else if (UVIndex < 6){
            UVbg = "yellow";
        }else if (UVIndex < 8){
            UVbg = "orange";
        }else if (UVIndex < 11){
            UVbg = "red";
            textColor = "white";
        }else{
            UVbg = "violet";
        }
        UVDiv.css("background-color",UVbg);
        if(textColor != null){
            UVDiv.css("color",textColor);
        }
        UVDiv.text(UVIndex);
    }else{
        alert("Something went wrong getting UV data, please try again");
    }
}

function performAPIGETCall(queryURL, callbackFunction){    
    $.ajax({url: queryURL, method: "GET"}).then(function(response){
        callbackFunction(response);
    });   
}

function addNewSearch(city){
    //console.log(city, storedSearches);
    if(storedSearches == null){
        storedSearches = [];
    }
    storedSearches.unshift(city);
    saveSearches();
    buildSearchHistory();
}

function saveSearches(){
    localStorage.setItem(lsKey,JSON.stringify(storedSearches));
}

init();

//helper functions
function getDayOfWeek(date){
   return moment.unix(parseInt(date)).format('dddd');
}

function correctCase(str){
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

function getStoredSearches(){
    return JSON.parse(localStorage.getItem(lsKey));
}

function clearLocalStorage(key){
    localStorage.removeItem(key);
}

function newCity(city, country){
    return {city:city,country:country};
}

function testFunction(mFunction,...args){   
    console.log(mFunction(...args));
 }