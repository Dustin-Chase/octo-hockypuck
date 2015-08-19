/*
Title: Steranko Search 
Author: Dustin Chase
E-mail: dustin.chase@gmail.com
Description: Marvel API. Searches Marvel database for comics where Jim Steranko was creator
						 in some capacity. Selects a random comic from this list and displays 
						 details (e.g. cover image, story summary, role of Steranko etc.)
						 
						 Updates daily. 

*/


/*Create a new HttpRequestObject
@ param: none
@ return: an HttpRequestObject on success, undefined variable on failure
@ Description: Tries to create an XMLHttp request for modern browsers. If failure, 
@              tries to create an ActiveXObject (IE 5, 6). If neither succeeds, return
@              will be undefined. 
*/
function createHttpRequestObject() {
	var xmlHttp = new XMLHttpRequest || new ActiveXObject("Microsoft.XMLHTTP");
	return xmlHttp;		 
}


/*Create a new AJAX request and search for requested title
@ param: none
@ return: an HttpRequestObject on success, undefined variable on failure
@ Description: Search for creator ID
*/
function search() {
	event.preventDefault();
	var search_results;
	my_key = "secret_key";
	//search by comic:creator, filter by comics only
	var URL = "http://gateway.marvel.com:80/v1/public/creators/61/comics?format=comic&formatType=comic&limit=100&apikey=" + my_key;
	var httpRequest = createHttpRequestObject(); 
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState != 4) {
			return; 
		}
		if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			search_results  = JSON.parse(httpRequest.responseText);
			console.log("The search results by creator are:");
			console.log(JSON.stringify(search_results));
			display(search_results);
		} else {
			alert('There was a problem with the request.'); 
			console.log(httpRequest.responseText);
		}

	}
		httpRequest.open("GET", URL, true);
		httpRequest.send();
}

function display(results) {
	event.preventDefault();
	var num_comics = results.data.results.length;
	var index = randomIntFromInterval(0, num_comics - 1);
	console.log("Index is: " + index);
	console.log("The selected title is:" + results.data.results[index].title);
	var comicURI = results.data.results[index].resourceURI;
	var comicID = comicURI.substring(comicURI.lastIndexOf("/") + 1, comicURI.length);
	console.log("The ID of that title is: " + comicID);
	var data_div = document.getElementById("comic-data");
	console.log(results.data.results[index].thumbnail.path + "/portrait_uncanny" + "." 
					+ results.data.results[index].thumbnail.extension);
	var output = "<table>"
		output += "<tr>" + "<td>" + "<img src=" + "\"" + results.data.results[index].thumbnail.path + "/portrait_uncanny" + "." 
					+ results.data.results[index].thumbnail.extension +  "\"" + ">" + "</td>" + "</tr>";
		output += "<th>" + results.data.results[index].title + "</th>";
		for (i in results.data.results[index].creators.items) {
			if (results.data.results[index].creators.items[i].name.indexOf("Steranko" > -1)) {
				output += "<tr id=\"steranko\">" + "<td>" + results.data.results[index].creators.items[i].name + " ";
			}
			else {
				output += "<tr>" + "<td>" + results.data.results[index].creators.items[i].name + " ";
			}
			output += results.data.results[index].creators.items[i].role + "</td>" + "</tr>";
		}			
		output += "</table>"
	data_div.innerHTML = output; 
	
	var attribution_div = document.getElementById("attr-footer");
	output = results.attributionHTML;
	attribution_div.innerHTML = output; 
}


//return a random integer from min to max
function randomIntFromInterval(min, max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

$('#loading')
    .hide()  // Hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    })
;
