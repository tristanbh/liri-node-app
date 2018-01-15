require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var fs = require("fs");
var request = require("request");

var input = process.argv[2];
var input2 = process.argv[3];

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

function randomText(){
fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }
  console.log(data);
  var input2 = data;
  console.log(input2);
  songSearch();

});
}
function tweets() {
	var client = new Twitter(keys.twitter);
	var params = {q: 'tristanbh83', count: 20};
		client.get('search/tweets', params, function (error, tweets, response){
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
function songSearch() {	
	if (input2 === undefined) {
		input2 = "The Sign Ace of Base";
	}
	var spotify = new Spotify(keys.spotify);
	spotify.search({ type: 'track', query: input2, limit: 1 }, function(error, data) {
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
function movieSearch(){
	if (input2 === undefined) {
		input2 = "Mr. Nobody";
	}
	request("http://www.omdbapi.com/?t="+ input2 +"&y=&plot=short&tomatoes=true&apikey=trilogy", function(error, response, body) {
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