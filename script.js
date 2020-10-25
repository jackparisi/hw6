$(document).ready(function(){
var apiKey = "7ff30ecc03dd12bf95d8112a754c82af";
var searchHistory = [];
var history = $(".history");
var curDate = moment().format("MMM Do YY");

function getHistory(){
    var historyStore = JSON.parse(localStorage.getItem("history"));
    if(historyStore) searchHistory = historyStore;
    history.find("a").remove();
    searchHistory.forEach(function(item){
        console.log(item)
        history.append('<a href="#" class="list-group-item list-group-item-action historyItem" data-city="' + item + '">' + item + '</a>');
    });

}

function displayInfo(temp, humidity, windSpeed, city){
    // $(".cityDate").append(cityInput);
     $(".temp").append("Temperature: " + temp + " F");
     $(".humidity").append("Humidity: " + humidity + "%");
     $(".wind").append("Wind Speed: " + windSpeed + " MPH");
     $(".cityDate").append(city + " " + curDate);
     
 }

function generateInfo(cityName){
$(".temp, .humidity, .wind, .cityDate, .uvIndex").empty();   
$(".dayOne, .dayTwo, .dayThree, .dayFour, .dayFive").empty();

//var queryURL = "https://www.api.openweathermap.org/data/2.5/weather?q=orlando&appid=" + apiKey + "&units=imperial";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=7ff30ecc03dd12bf95d8112a754c82af&units=imperial";
var fiveDayurl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=7ff30ecc03dd12bf95d8112a754c82af&units=imperial";

//console.log(cityName);
//$("#weatherDiv").empty();
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response);
    var curTemp = response.main.temp;
    var curHumidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var curCity = response.name;
    console.log(curTemp);
    console.log(curHumidity);
    console.log(windSpeed);
    
    //displayInfo(curTemp);
   // $("#temp").text("example")
   // $("#temp").append(curTemp)
    displayInfo(curTemp, curHumidity, windSpeed, curCity);
    getUV(response.coord.lat, response.coord.lon);
    $(".todayIcon").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
    $("#weatherDiv").show();
    if(searchHistory.indexOf(curCity) < 0){
    searchHistory.push(curCity);
    localStorage.setItem("history", JSON.stringify(searchHistory));
    getHistory();
    }

});

function getUV(lat, lon){
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat +"&lon=" + lon + "&appid=7ff30ecc03dd12bf95d8112a754c82af";
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function(uvRes){
        console.log(uvRes)
        $(".uvIndex").append("UV Index: " + uvRes.value);
        if(uvRes.value < 3){
            $(".uvIndex").removeClass("bg-warning bg-danger").addClass("bg-success")
        }else if(uvRes.value > 3 && uvRes.value < 6){
            $(".uvIndex").removeClass("bg-success bg-danger").addClass("bg-warning")
        }else if(uvRes.value > 6){
            $(".uvIndex").removeClass("bg-success bg-warning").addClass("bg-danger")
        };
    })
}

$.ajax({
    url: fiveDayurl,
    method: "GET"
}).then(function(fiveDayres){
    console.log(fiveDayres);
    var filteredList = fiveDayres.list.filter(function(date){
        return date.dt_txt.indexOf("15:00:00") > -1;
    });
    filteredList.forEach(function(item, i){
        $(".day" + (i+1)).find(".date").text(item.dt_txt);
        $(".day" + (i+1)).find(".temp span").text(item.main.temp);
        $(".day" + (i+1)).find(".humid span").text(item.main.humidity);
        $(".day" + (i+1)).find(".icon").attr("src", "http://openweathermap.org/img/w/" + item.weather[0].icon + ".png");

    })
    

    
});
    /* function displayInfo(){
        $(".cityDate").append(cityInput);
       
    }
    */
  

};




$(".btn").on("click", function(e){
    e.preventDefault();
    
    var cityInput = $("#citySearch").val().trim();
    console.log(cityInput);
    generateInfo(cityInput);
    //$(".cityDate").append(cityInput);
    //$(".temp").append(curTemp);
   // displayInfo();
   
 

});

history.on("click", ".historyItem", function(){
    if($(this).attr("data-city")){
        generateInfo($(this).attr("data-city"));
    }


    
})
$("#weatherDiv").hide()

});
