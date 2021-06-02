addStation(24, "https://nwac.us/data-portal/csv/q/?datalogger_id=1&year=2021", "Alpental Base");
addStation(24, "https://nwac.us/data-portal/csv/q/?datalogger_id=28&year=2021", "Crystal Base");

function addStation(hours, url, stationName) {
	Papa.parse(`https://rocky-taiga-02859.herokuapp.com/${url}`, {
		download: true,
		complete: function (results) {
			var formatted = [];
			for (i = 1; i <= hours; i++) {
				formatted[i - 1] = {};
				formatted[i - 1]["Date/Time"] = results["data"][i][0];
				formatted[i - 1]["Temperature"] = results["data"][i][2];
				formatted[i - 1]["Humidity"] = results["data"][i][3];
				formatted[i - 1]["Precipitation"] = results["data"][i][4];
				formatted[i - 1]["Wind Direction"] = results["data"][i][6];
				formatted[i - 1]["Wind Average"] = results["data"][i][7];
				formatted[i - 1]["Wind Min"] = results["data"][i][8];
				formatted[i - 1]["Wind Max"] = results["data"][i][9];
				formatted[i - 1]["24 Hour Snow"] = results["data"][i][13];
			}
			var precip = getPrecip(formatted);
			var maxTemp = getMaxTemp(formatted);
			var minTemp = getMinTemp(formatted);
			var avgTemp = getAvgTemp(formatted);
			var currentTemp = getCurrentTemp(formatted);

			if(document.getElementById("table") == null) {
				makeInitialTable();
			}
			addRow([stationName, precip, maxTemp, minTemp, avgTemp, currentTemp]);
		}
	});
}

function getSnow(data) {

}

function getPrecip(data) {
	var total = 0;
	data.forEach((item, index) => {
		total += parseFloat(item["Precipitation"]);
	})
	return total.toString().substring(0, 5);
}

function getNonSnowPrecip(data) {

}

function getMaxTemp(data) {
	var max = -100;
	data.forEach((item, index) => {
		temp = parseFloat(item["Temperature"]);
		if(temp > max) {
			max = temp;
		}
	})
	return max;
}

function getMinTemp(data) {
	var min = 200;
	data.forEach((item, index) => {
		temp = parseFloat(item["Temperature"]);
		if(temp < min) {
			min = temp;
		}
	})
	return min;
}

function getAvgTemp(data) {
	var total = 0;
	var count = 0;
	data.forEach((item, index) => {
		total += parseFloat(item["Temperature"]);
		count++;
	})
	average = total / count;
	return average.toString().substring(0, 5);
}

function getCurrentTemp(data) {
	temp = parseFloat(data[0]["Temperature"])
	return temp;
}

function getCurrentSnowBase(data) {
	temp = parseFloat(data[0]["24 Hour Snow"])
	return temp;
}

function makeInitialTable() {
	const table = document.createElement("table");
	table.style.width = "100%";
	table.id = "table";
	table.classList.add("table", "table-bordered");
	var header = table.createTHead();
	var body = table.createTBody();
	body.id = "table-body"
	var valueNames = header.insertRow(0);
	var arr = ["Station", "Precipitation", "Max Temperature", "Min Temperature", "Average Temperature", "Current Temperature"]

	arr.forEach((item, index) => {
		var th = document.createElement("th");
		th.innerHTML = item;
		valueNames.appendChild(th);
	})

	var loading = document.getElementById("loading");
	loading.remove();

	var div1 = document.getElementById("div1");
	div1.appendChild(table);
}

function addRow(data) {
	var body = document.getElementById("table-body");
	console.log(data)
	console.log(body)
	var values = body.insertRow(-1);
	var units = ["", " in", "° F", "° F", "° F", "° F"]

	data.forEach((item, index) => {
		values.insertCell(-1).innerHTML = item + units[index];
	})
}