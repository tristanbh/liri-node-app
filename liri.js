//Dont ENV for hiding API keys
require("dotenv").config();

//requires, for out various installed NPM packages, as well as our API Keys
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var fs = require("fs");
var request = require("request");

//User inputs from command line
var input = process.argv[2];
var input2 = process.argv[3];

//functions to run, based on user input
if (input === 'my-tweets'){
	tweets();
}
if (input === 'movie-search'){
	movieSearch();
}
if (input === 'spotify-this-song'){
	songSearch();
}
if (input === 'do-what-it-says'){
	randomText();
}

//using fs.readfile to read the text in random.txt and passing that to our songsearch function 
function randomText(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
	    return console.log(error);
	  	}
	 	randomTextDataVerify = true;
	  	songSearch(data, randomTextDataVerify);
	});
}

//function for pulling information from the twitter api
function tweets() {
	var client = new Twitter(keys.twitter);
	var params = {q: 'tristanbh83', count: 20};
		client.get('search/tweets', params, function (error, tweets, response){
			//if no errors occur, we loop through the returned data, and pull up to 20 tweets and the times they were published
		  	if (!error){
			  	for (var i=0; i < tweets.statuses.length; i++){
			  		var myTweets = tweets.statuses[i].text;
			  		var tweetCreatedAt = tweets.statuses[i].created_at;
			  		console.log("Tweet: " + myTweets);
			  		console.log("Date: " + tweetCreatedAt + '\n');
	  			}
	  		}
	  	});
};
//function for spotify song search
function songSearch(data, randomTextDataVerify) {	
	//if no song is entered for search, the result will default to "The Sign"
	if (input2 === undefined) {
		input2 = "The Sign Ace of Base";
	}
	//if randomTextDataVerify has been changed from fale to true from our randomText funtion, it will use that data for the song search
	if (randomTextDataVerify === true) {
		input2 = data;
	}
	//gets our spotify keys
	var spotify = new Spotify(keys.spotify);
	spotify.search({ type: 'track', query: input2, limit: 1}, function(error, data) {
		//if no error occurs we are looping through the returned data and logging it to our command line
		if (!error){
			for (var i = 0; i < data.tracks.items.length; i++){
				console.log(data.tracks.items[i].artists[0].name);
				console.log(data.tracks.items[i].album.name);
				console.log(data.tracks.items[i].name);
				console.log(data.tracks.items[i].preview_url);
			}
		}
		if (error) {
			return console.log('Error occurred: ' + error);
  		} 
	});
}
//function for our movie search
function movieSearch(){
	//if no movie is entered the result will default to the movie "Mr Nobody"
	if (input2 === undefined) {
		input2 = "Mr. Nobody";
	}
	request("http://www.omdbapi.com/?t="+ input2 +"&y=&plot=short&tomatoes=true&apikey=trilogy", function(error, response, body) {
	  //if no errors we are looping throught he returned data from the omdb api and logging it to the command line
		if (!error && response.statusCode === 200) {
		    console.log("Movie Title: " + JSON.parse(body).Title);
		    console.log("Year Released: " + JSON.parse(body).Year);
		   	console.log("Language: " + JSON.parse(body).Plot);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Filming Location(s): " + JSON.parse(body).Country);
		   	console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1]["Value"]);	   
	  	}
	});
}
