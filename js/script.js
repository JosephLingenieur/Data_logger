
/**
 * Get the data of the row in the table with the given id
 * @param {string} id
 */
function pullDatabase(id) {
	toggleSpinner(true);
	var index = id.options[id.selectedIndex].value;
	if (index > 0) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var myObj = JSON.parse(this.responseText);
				var infoTable = document.getElementById("infoTable");
				infoTable.rows[1].cells[0].innerHTML = myObj.name;
				
				infoTable.rows[1].cells[1].innerHTML = myObj.gain + "x";
				infoTable.rows[1].cells[1].dataset.value = myObj.gain;
				
				infoTable.rows[1].cells[2].innerHTML = myObj.interval + " Sec";
				infoTable.rows[1].cells[2].dataset.value = myObj.interval;
				
				infoTable.rows[1].cells[3].innerHTML = myObj.shunt;
				infoTable.rows[1].cells[4].innerHTML = myObj.unit;
				infoTable.rows[1].cells[5].innerHTML = myObj.var;
				
				toggleSpinner(false);
				if (myObj.pid != "0") {
					document.getElementById("logButton").disabled = true;
				} else {
					document.getElementById("logButton").disabled = false;
				}
			}
		};
		xmlhttp.open("GET", "php/pull_db.php?id=" + index, true);
		xmlhttp.send();
	} else {
		alert("Please select a channel");
		return false;
	}
}

// for testing
function printVal() {
	var infoTable = document.getElementById("infoTable");
	infoTable.rows[1].cells[1].dataset.value = "test";
	alert(infoTable.rows[1].cells[1].dataset.value);
	return false;
}

/**
 * Update the column of the id in the table with the given value
 * @param {string} id
 * @param {string} column
 * @param {string} value
 */
function updateChannel(id, column, value) {
	var index = id.options[id.selectedIndex].value;
	if (index > 0) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				pullDatabase(id);
			}
		};
		xmlhttp.open("GET", "php/update_db.php?id=" + id.options[id.selectedIndex].value + "&c=" + 
			column + "&in=" + value.value, true);
		xmlhttp.send();
		if (value.type == 'text') {
			value.value = "";
		}
	} else {
		alert("Please select a channel");
		return false;
	}
}

function startLogging(id) {
	var index = id.options[id.selectedIndex].value;
	if (index > 0) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				pullDatabase(id);
			}
		};
		xmlhttp.open("GET", "php/update_db.php?id=" + id.options[id.selectedIndex].value + "&c=" + 
			"PID" + "&in=" + "1", true);
		xmlhttp.send();
		if (value.type == 'text') {
			value.value = "";
		}
	} else {
		alert("Please select a channel");
		return false;
	}
}

function stopLogging(id) {
	var index = id.options[id.selectedIndex].value;
	if (index > 0) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				pullDatabase(id);
			}
		};
		xmlhttp.open("GET", "php/update_db.php?id=" + id.options[id.selectedIndex].value + "&c=" + 
			"PID" + "&in=" + "0", true);
		xmlhttp.send();
		if (value.type == 'text') {
			value.value = "";
		}
	} else {
		alert("Please select a channel");
		return false;
	}
}



// id, name, interval, shunt, unit
function logData(id) {
	// disable just to be safe
	document.getElementById("logButton").disabled = true;

	// toggleLoader(true);
	var loopCount = "5";
	// var loopInterval = "1";
	var channelID = id.options[id.selectedIndex].value;

	if (channelID > 0) {
		var infoTable = document.getElementById("infoTable");
		var name = infoTable.rows[1].cells[0].innerHTML;
		var gain = infoTable.rows[1].cells[1].dataset.value;
		var loopInterval = infoTable.rows[1].cells[2].dataset.value;
		var shunt = infoTable.rows[1].cells[3].innerHTML;
		var unit = infoTable.rows[1].cells[4].innerHTML;
		var varVal = infoTable.rows[1].cells[5].innerHTML;

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("txtHint").innerHTML = this.responseText;

				var link = {value:this.responseText};
				// updateChannel(id, "PID", link);
			}
		};
		xmlhttp.open("GET", "php/log_data.php?c=" + loopCount + "&i=" + loopInterval + 
			"&g=" + gain + "&n="+ name + "&s=" + shunt + "&u=" + unit + "&index=" + channelID, true);
		xmlhttp.send();
	} else {
		alert("Please select a channel");
		return false;
	}
}

function killProcess(id) {
	var channelID = id.options[id.selectedIndex].value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("txtHint").innerHTML = this.responseText;
			// toggleLoader(false);
			document.getElementById("logButton").disabled = false;
		}
	};
	xmlhttp.open("GET", "php/kill_process.php?" + "index=" + channelID, true);
	xmlhttp.send();
}

/**
* Hide or show the loading indicator of the table
* @param {boolean} show
*/
function toggleSpinner(show) {
	var x = document.getElementById("spinner");
	if (show == true) {
		x.style.display = "inline-block";
	} else {
		x.style.display = "none";
	}
}

// just for testing
function toggleLoader(show) {
	var x = document.getElementById("loader");
	// var btn = document.getElementById("logButton");
	if (show == true) {
		x.style.display = "inline-block";
		// btn.disabled = true;
	} else {
		// btn.disabled = false;
		x.style.display = "none";
	}
}

function testing() {
	alert("Just don't click when I'm testing!");
	// body...
}

/**
* Function to open the sidebar on smaller width devices
*/
function w3_open() {
	document.getElementById("mySidebar").style.display = "block";
	document.getElementById("myOverlay").style.display = "block";
}

/**
* * Function to close the sidebar on smaller width devices
*/
function w3_close() {
	document.getElementById("mySidebar").style.display = "none";
	document.getElementById("myOverlay").style.display = "none";
}


