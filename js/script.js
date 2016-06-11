/*
Title: Creator Search 
Author: Dustin Chase
E-mail: dustin.chase@gmail.com
Description:  

*/

var my_key = "ccb6288e75d288d68ca50a4dbd86dc17";
var comicsArray = null;
window.onload = init;  

function init() {
	document.getElementById("random-comic").setAttribute("onclick", "getComics();");
	getComics();
}

function getComics() {
	var TWENTY_FOUR_HOURS = 60 * 60 * 24 * 1000; //24 hours in milliseconds
	
	//if comics data exists in storage and it is not too old, use it
	if (localStorage["comicsArray"]) {
		comicsArray = JSON.parse(localStorage["comicsArray"]);
		if((new Date()) - new Date(comicsArray["retrievedOn"]) < TWENTY_FOUR_HOURS) {
			var comic = pickComic(); 
			displayComic(comic);
		} else {
			refreshData();
		}
	} else { //otherwise, get new data and store it
		refreshData(); 
	}
}

function pickComic() {
	var numComics = comicsArray["data"]["count"];
	var comic; 
	do {
		var rand = randomIntFromInterval(0, numComics);
		comic = comicsArray["data"]["results"][rand];
	} while (comic["creators"]["available"] == 0);
	
	return comic; 
}

function refreshData() {
	var url = "http://gateway.marvel.com:80/v1/public/comics?format=comic&formatType=comic&limit=100&apikey=ccb6288e75d288d68ca50a4dbd86dc17";
	var request = new XMLHttpRequest();
	request.onload = function() {
		if (request.status === 200) {
			comicsArray = JSON.parse(request.responseText);
			comicsArray.retrievedOn = new Date();
			localStorage.setItem("comicsArray", JSON.stringify(comicsArray));
			var comic = pickComic();
			displayComic(comic); 
		}
	}
	request.open("GET", url, true);
	request.send();
} 

function displayComic(comic) {
	var table = document.getElementById("comic-data");
	$( ".creator" ).remove(); //remove any creators already displayed
	var img = document.getElementById("comic-image");
	img.setAttribute("src", comic["images"][0]["path"] + "/portrait_uncanny" + "." + comic["images"][0]["extension"]);
	var title = document.getElementById("comic-title");
	title.innerHTML = comic["title"];
	
	var desc = document.getElementById("comic-description");
	desc.innerHTML = comic["description"] === null ? comic["series"]["name"] : comic["description"];
	
	var numCreators = comic["creators"]["available"];
	for (var i = 0; i < numCreators; i++) {
		var tr = document.createElement("tr");
		tr.setAttribute("class", "creator");		
		var name = document.createElement("td");
		name.setAttribute("id", comic["creators"]["items"][i].name); 
		
		name.addEventListener("click", function() {
			search(this.id); 
		}); 
		name.innerHTML = comic["creators"]["items"][i].name; 
		
		var role = document.createElement("td");
		role.innerHTML = comic["creators"]["items"][i].role;
		tr.appendChild(name);
		tr.appendChild(role);
		
		table.appendChild(tr);
	}
	console.log(comicsArray["attributionHTML"]); 
	$("#attr-footer").innerHTML = comicsArray["attributionHTML"]; 
	
}
//return a random integer from min to max
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function search(toSearchFor) {
      var api = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
      var cb = '&callback=display';
      var newScript = document.createElement("script");
      newScript.setAttribute("src", api + toSearchFor + cb);
	  newScript.setAttribute("id", "jsonp");
	  
	  var oldScript = document.getElementById("jsonp"); 
      var head = document.getElementsByTagName("head")[0];
      if (oldScript == null) {
		head.appendChild(newScript); 
	  } else {
		head.replaceChild(newScript, oldScript); 
	  }
	  
}

function display(data) {
	var page = 'http://en.wikipedia.org/?curid=';
    var list = document.getElementById("search_results"); 
	var sliders = document.getElementsByClassName("slide"); 
	if (sliders.length > 0) {
		$(".slide").hide("slow", function() { $(this).remove();});
	}
	var results = data.query.pages;
	for (var i in results) {
		var item = document.createElement("li");
	    item.setAttribute("class", "slide");
		var anchor = document.createElement("a");
		anchor.setAttribute("href", page + results[i].pageid);
		anchor.setAttribute("target", "_blank");
		var dt = document.createElement("dt");
		dt.innerHTML = results[i].title;
		var dd = document.createElement("dd");
		dd.innerHTML = results[i].extract; 
		anchor.appendChild(dt);
		anchor.appendChild(dd);
		item.appendChild(anchor);
		list.appendChild(item);
  }
  
	
}
