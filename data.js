var places = [];
var global = [];

function setMap() {
    map = new L.Map("map"); // creates a map at HTML div called "map"
    cartocdn = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
    cartoAttrib = "Carto geodatabase is good for this application"; // ???
    carto = new L.TileLayer(cartocdn);
    map.setView([51.5, 0.12],2); // centered on London lat, long
    map.addLayer(carto);
    layergroup = L.layerGroup().addTo(map);
}

function api() {
    axios.get("https://api.covid19api.com/summary")
        .then(response => {
            document.getElementById("date").innerHTML = "COVID-19 Cases By Type (Latest Update: " + response.data['Date'] + ")"; // displays time of last update in HTML element called "date"
            sort(response.data); // runs parseData with the new data
        })
        .catch(error => {
            console.log(error); // debugging data
        })
}

function sort(response) {
    console.log("Hello World");
    console.log(response);
    data = response;
    global = Object.values(data['Global'])
    allvalues = Object.values(data['Countries']);
    for (let i = 0; i < allvalues.length; i++) {
        a = allvalues[i]['Country'];
        if (places.length < allvalues.length) {
            places.push(a)
        }
    }
    console.log(places)
}

function autocomplete(inp, arr) {
    // the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values
    var currentFocus;
    // execute a function when someone writes in the text field:
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        // close any already open lists of autocompleted values
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        // create a DIV element that will contain the items (values):
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "step1-list");
        a.setAttribute("class", "step1-items");
        // append the DIV element as a child of the autocomplete container:
        this.parentNode.appendChild(a);
        //for each item in the array...
        for (i = 0; i < arr.length; i++) {
            // check if the item starts with the same letters as the text field value:
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            // create a DIV element for each matching element:
            b = document.createElement("DIV");
            // make the matching letters bold:
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            // insert a input field that will hold the current array item's value:
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            // execute a function when someone clicks on the item value (DIV element):
            b.addEventListener("click", function(e) {
                // insert the value for the autocomplete text field:
                inp.value = this.getElementsByTagName("input")[0].value;
                // close the list of autocompleted values, or any other open lists of autocompleted values:
                closeAllLists();
            });
            a.appendChild(b);
            }
        }
    });
    //execute a function presses a key on the keyboard:
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "step1-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            // If the arrow DOWN key is pressed, increase the currentFocus variable:
            currentFocus++;
            // and and make the current item more visible:
            addActive(x);
        } else if (e.keyCode == 38) { //up
            // If the arrow UP key is pressed, decrease the currentFocus variable:
            currentFocus--;
            // and and make the current item more visible:
            addActive(x);
        } else if (e.keyCode == 13) {
            // If the ENTER key is pressed, prevent the form from being submitted,
            e.preventDefault();
            if (currentFocus > -1) {
            // and simulate a click on the "active" item:
            if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        // a function to classify an item as "active":
        if (!x) return false;
        // start by removing the "active" class on all items:
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        // add class "step1-active":
        x[currentFocus].classList.add("step1-active");
    }
    function removeActive(x) {
        // a function to remove the "active" class from all autocomplete items:
        for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("step1-active");
        }
    }
    function closeAllLists(elmnt) {
        // close all autocomplete lists in the document, except the one passed as an argument:
        var x = document.getElementsByClassName("step1-items");
        for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
        }
    }
    // execute a function when someone clicks in the document:
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
});
}

function keyBind() {
    input = document.getElementById("find");
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("submit").click();
        }
    });
}

function country() {
    document.getElementById("answer").innerHTML = "";
    correct = document.getElementById("find").value;
    console.log(correct);
    if (places.includes(correct) == false ) {
        alert("The Country You Entered Is Not Valid, Please Retry Again");
    }
    for (let i = 0; i < allvalues.length; i++) {
        thing = allvalues[i]['TotalConfirmed'] - allvalues[i]['TotalDeaths'] - allvalues[i]['TotalRecovered']
        if (allvalues[i]['Country'] == correct) {
            console.log(allvalues[i]);
            document.getElementById("answer").innerHTML = "Total Confirmed Cases: " + allvalues[i]['TotalConfirmed'].toLocaleString() + "<br>Active: " + thing.toLocaleString() + "<br>Deaths: " + allvalues[i]['TotalDeaths'].toLocaleString() + "<br>Recoveries: " + allvalues[i]['TotalRecovered'].toLocaleString() + "<br>New Confirmed: " + allvalues[i]['NewConfirmed'].toLocaleString() + "<br>New Deaths: " + allvalues[i]['NewDeaths'].toLocaleString() + "<br>New Recoveries: " + allvalues[i]['NewRecovered'].toLocaleString();
        }
    }
}

function all1() {
    if (document.getElementById("closed").checked == true) {
        document.getElementById("deaths").checked = true;
        document.getElementById("recoveries").checked = true;
    } else {
        document.getElementById("deaths").checked = false;
        document.getElementById("recoveries").checked = false;
    }
}

function part1() {
    if (document.getElementById("deaths").checked == true && document.getElementById("recoveries").checked == true) {
        document.getElementById("closed").checked = true;
        document.getElementById("closed").indeterminate = false;
    } else if (document.getElementById("deaths").checked != true && document.getElementById("recoveries").checked != true) {
        document.getElementById("closed").checked = false;
        document.getElementById("closed").indeterminate = false;
    } else {
        document.getElementById("closed").checked = false;
        document.getElementById("closed").indeterminate = true;
    }
}

function all2() {
    if (document.getElementById("new").checked == true) {
        document.getElementById("new_confirmed").checked = true;
        document.getElementById("new_deaths").checked = true;
        document.getElementById("new_recoveries").checked = true;
    } else {
        document.getElementById("new_confirmed").checked = false;
        document.getElementById("new_deaths").checked = false;
        document.getElementById("new_recoveries").checked = false;
    }
}

function part2() {
    if (document.getElementById("new_confirmed").checked == true && document.getElementById("new_deaths").checked == true && document.getElementById("new_recoveries").checked == true) {
        document.getElementById("new").checked = true;
        document.getElementById("new").indeterminate = false;
    } else if (document.getElementById("new_confirmed").checked != true && document.getElementById("new_deaths").checked != true && document.getElementById("new_recoveries").checked != true) {
        document.getElementById("new").checked = false;
        document.getElementById("new").indeterminate = false;
    } else {
        document.getElementById("new").checked = false;
        document.getElementById("new").indeterminate = true;
    }
}

function markers() {
    layergroup.clearLayers();
    for (let i = 0; i < allvalues.length; i++) {
        shortcode = allvalues[i]['CountryCode'].toLowerCase(); // converts country code into lowercase to get coordinates (second data set uses a lowercase code)
        a = allvalues[i]['Country'];
        b = allvalues[i]['TotalConfirmed'];
        c = allvalues[i]['TotalDeaths'];
        d = allvalues[i]['TotalRecovered'];
        e = allvalues[i]['NewConfirmed'];
        f = allvalues[i]['NewDeaths'];
        g = allvalues[i]['NewRecovered'];
        h = b - c - d; // Active Cases
        if (countries[shortcode] != undefined) { // prevents error by only looping if its not undefined and only draws circles if there are any cases in the current country
            latitude = countries[shortcode][0];
            longitude = countries[shortcode][1];
            if (document.getElementById("total").checked == true && b > 0) {
                L.circle([latitude,longitude],{color:'black',radius:b}).addTo(layergroup).bindPopup("'" + a + " : " + b.toLocaleString() + "'"); // draws circle with the variables as arguments
            }
            if (document.getElementById("deaths").checked == true && c > 0) {
                L.circle([latitude,longitude],{color:'red',radius:c}).addTo(layergroup).bindPopup("'" + a + " : " + c.toLocaleString() + "'"); // draws circle with the variables as arguments
            }
            if (document.getElementById("recoveries").checked == true && d > 0) {
                L.circle([latitude,longitude],{color:'green',radius:d}).addTo(layergroup).bindPopup("'" + a + " : " + d.toLocaleString() + "'"); // draws circle with the variables as arguments
            }
            if (document.getElementById("new_confirmed").checked == true && e > 0) {
                L.circle([latitude,longitude],{color:'grey',radius:e}).addTo(layergroup).bindPopup("'" + a + " : " + e.toLocaleString() + "'"); // draws circle with the variables as arguments
            }
            if (document.getElementById("new_deaths").checked == true && f > 0) {
                L.circle([latitude,longitude],{color:'orange',radius:f}).addTo(layergroup).bindPopup("'" + a + " : " + f.toLocaleString() + "'"); // draws circle with the variables as arguments
            }
            if (document.getElementById("new_recoveries").checked == true && g > 0) {
                L.circle([latitude,longitude],{color:'blue',radius:g}).addTo(layergroup).bindPopup("'" + a + " : " + g.toLocaleString() + "'"); // draws circle with the variables as arguments
            }
            if (document.getElementById("active").checked == true && h > 0) {
                L.circle([latitude,longitude],{color:'yellow',radius:h}).addTo(layergroup).bindPopup("'" + a + " : " + h.toLocaleString() + "'"); // draws circle with the variables as arguments
            }
        }
    }
}

google.charts.load("current", {'packages':['corechart']});
google.charts.setOnLoadCallback(world);

function world() {
    total = global[1];
    console.log(total);
    active = global[1] - global[3] - global[5]; // determines the amount of active cases by subtracting the total cases by the closed cases (deaths and recoveries)
    document.getElementById("worldstats").innerHTML = "Total Confirmed Cases: " + total.toLocaleString() + "<br>Active: " + active.toLocaleString() + "<br>Deaths: " + global[3].toLocaleString() + "<br>Recoveries: " + global[5].toLocaleString();
    var graph = google.visualization.arrayToDataTable([
        ['Type', 'Amount'], // establishes the arguments
        ['Active', active],
        ['Dead', global[3]],
        ['Recovered', global[5]],
    ]);
    // Optional; add a title and set the width and height of the chart
    options = {'title':'Confirmed Cases By Status Worldwide (' + total.toLocaleString() + ' Total)'};
    // Display the chart inside the <div> element with id="piechart"
    chart = new google.visualization.PieChart(document.getElementById("piechart"));
    chart.draw(graph, options);
}

/*
var table = document.getElementById("everything");
var row = table.insertRow();
var column1 = row.insertCell(0)
var column2 = row.insertCell(1)
var column3 = row.insertCell(2)
var column4 = row.insertCell(3)
var column5 = row.insertCell(4)
var column6 = row.insertCell(5)
var column7 = row.insertCell(6)
var column8 = row.insertCell(7)
column1.innerhtml = a;                
column2.innerhtml = b;
column3.innerhtml = h;
column4.innerhtml = c;
column5.innerhtml = d;
column6.innerhtml = e;
column7.innerhtml = f;
column8.innerhtml = g;
*/