const APIKey = "4d83e60df2919987d44e561a0cc747ee";
const lsKey = "weatherSearches"
const searchesDiv = $("#searches");
const searchInput = $("#searchInput");
const searchButton = $("#searchBtn");
const currentWeatherDiv = $("#currentWeather");
const forecastDiv = $("#forecast");
var storedSearches = getStoredSearches();
var addedCity = newCity();
var unts = {deg:"C",}
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
    testFunction(performAPICall, "https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&units=metric&appid=" + APIKey);    
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
    addedCity = city;
    getWeather(city);        
}


function getWeather(city){
    let queryUrlCurrent = "";
    let queryUrlForcast = "";

    if(city.country == null){
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+"&units=metric&appid="+APIKey;
        queryURLForcast = "";
    }else{
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+","+city.country+"&units=metric&appid="+APIKey;
        queryURLForcast = "";
    }
    
    performAPICall(queryUrlCurrent, getCurrentWeather);
    performAPICall(queryUrlForecast, getWeatherForcast);    
}

function getCurrentWeather(data){
    currentWeatherDiv.empty();
    currentWeatherDiv.append(
                        $("<h2>").text(correctCase(data.name)+", "
                        +data.country.toUpperCase()
                        +data.dt)
                        ,$("<img>").attr("src", "https://openweathermap.org/img/wn/"+data.weather.icon+"@2x.png" )
                        ,$("<p>").text("Temperature: " + data.main.temp + "°"+deg)

    );

    $(".city").text(response.name);
    $('.wind').text(response.wind.speed+"mph");
    $('.humidity').text(response.main.humidity+"%");
    $('.temp').text(response.main.temp+" degrees(c)");
    
    if(addedCity.country == null){
        addedCity.country = data.country;
        addedCity.city = data.name;
    }
    addNewCity(addedCity);
    addedCity = null;            
}

function getWeatherForecast(data){

}



function performAPICall(queryURL, callbackFunction){
    $.ajax({url: queryURL, method: "GET"}).then(callbackFunction(response));   
}

function addNewSearch(city){
    storedSearches.unshift(city);
    saveSearches();
    buildSearchHistory();
}

function saveSearches(searchArr){
    localStorage.setItem(lsKey,searchArr)
}

init();

//helper functions
function getDayOfWeek(date){
   return moment.unix(parseInt(date)).format('dddd');
}

function correctCase(str){
    return str.toLowerCase().replace(/\b\w/, l >= l.toUpperCase());
}

function getStoredSearches(){
    return localStorage.getItem(lsKey);
}

function newCity(city, country){
    return {city:city,country:country};
}

function testFunction(mFunction,...args){   
    console.log(mFunction(...args));
 }