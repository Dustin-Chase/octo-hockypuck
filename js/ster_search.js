/*
Title: Steranko Search 
Author: Dustin Chase
E-mail: dustin.chase@gmail.com
Description: Marvel API. Searches Marvel database for comics where Jim Steranko was creator
						 in some capacity. Selects a random comic from this list and displays 
						 details (e.g. cover image, story summary, role of Steranko etc.)
						 
						 Updates daily. 

*/
var my_key = "ccb6288e75d288d68ca50a4dbd86dc17";
window.onload = init;  

function init() {
	document.getElementById("random-comic").setAttribute("onclick", "search();");
	
	var TWENTY_FOUR_HOURS = 60 * 60 * 24 * 1000; //24 hours in milliseconds
	var comicsArray = localStorage["comicsArray"];
	if (!comicsArray || ((new Date()) - comicsArray["retrievedOn"]) > TWENTY_FOUR_HOURS) {
		comicsArray = getComics();
		comicsArray["retrievedOn"] = new Date();
		localStorage.setItem("comicsArray", comicsArray);
	}
}


function search() {
	var loadingdiv = document.getElementById("loading");
	loadingdiv.style.display = "block";
	var search_results;
	var rand_creator = randomIntFromInterval(0, 1499); 
	
	//search by comic:creator, filter by comics only
	var URL = "http://gateway.marvel.com:80/v1/public/creators/" + rand_creator + "/comics?format=comic&formatType=comic&limit=100&apikey=" + "ccb6288e75d288d68ca50a4dbd86dc17";


	var httpRequest = new XMLHttpRequest(); 
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState != 4) {
			return; 
		}
		if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			search_results  = JSON.parse(httpRequest.responseText);
			console.log("The search results by creator are:");
			console.log(JSON.stringify(search_results));
			display(search_results, rand_creator);
		} else {
			//alert('There was a problem with the request.'); 
			console.log(httpRequest.responseText);
		}

	}
		httpRequest.open("GET", URL, true);
		httpRequest.send();
}

function display(results, creator) {
	event.preventDefault();
	var num_comics = results.data.results.length;
	if (num_comics === 0) {
		search();
		return; 
	}
	var index = randomIntFromInterval(0, num_comics - 1);
	console.log("Index is: " + index);
	console.log("The selected title is:" + results.data.results[index].title);
	var comicURI = results.data.results[index].resourceURI;
	var comicID = comicURI.substring(comicURI.lastIndexOf("/") + 1, comicURI.length);
	console.log("The ID of that title is: " + comicID);
	var data_div = document.getElementById("comic-data");
	console.log(results.data.results[index].thumbnail.path + "/portrait_uncanny" + "." 
					+ results.data.results[index].thumbnail.extension);
	var output = ""
		output += "<tr>" + "<td>" + "<img src=" + "\"" + results.data.results[index].thumbnail.path + "/portrait_uncanny" + "." 
					+ results.data.results[index].thumbnail.extension +  "\"" + ">" + "</td>" + "</tr>";
		output += "<th>" + results.data.results[index].title + "</th>";
		for (i in results.data.results[index].creators.items) {
			output += "<tr>" + "<td>" + results.data.results[index].creators.items[i].name + " ";
			output += results.data.results[index].creators.items[i].role + "</td>" + "</tr>";
		}			
	data_div.innerHTML = output; 
	
	var attribution_div = document.getElementById("attr-footer");
	output = results.attributionHTML;
	attribution_div.innerHTML = output;
	if (creator !== undefined) {
		searchCreators("http://gateway.marvel.com:80/v1/public/creators/" + creator + "?apikey=" + my_key)
	}
	
}

function searchCreators(URL) {
	event.preventDefault();
	var search_results;
	var rand_creator = randomIntFromInterval(0, 1499);
	
	//search by comic:creator, filter by comics only
	if (URL === undefined) {
		URL = "http://gateway.marvel.com:80/v1/public/creators/" + creator + "?apikey=" + my_key;
	}
	
	var httpRequest = new XMLHttpRequest(); 
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState != 4) {
			return; 
		}
		if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			search_results  = JSON.parse(httpRequest.responseText);
			console.log("The search results by creator are:");
			console.log(JSON.stringify(search_results));
			displayCreator(search_results);
		} else {
			alert('There was a problem with the request.'); 
			console.log(httpRequest.responseText);
		}

	}
		httpRequest.open("GET", URL, true);
		httpRequest.send();
}

function displayCreator(results) {
	console.log("The creator search results are:");
	console.log(JSON.stringify(results));
	var output = "<br>" + "<table>"
		output += "<tr>" + "<td>" + "<img src=" + "\"" + results.data.results[0].thumbnail.path + "/portrait_xlarge" + "." 
					+ results.data.results[0].thumbnail.extension +  "\"" + ">" + "</td>" + "</tr>";
		output += "<th>" + results.data.results[0].fullName + "</th>";
		output += "</table>";
	var creator_div = document.getElementById("creator-data");
	creator_div.innerHTML = output;
	var loadingdiv = document.getElementById("loading");
	loadingdiv.style.display = "none";	
	
}
//return a random integer from min to max
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

