getData(24);

function getData(hours) {
	Papa.parse("https://rocky-taiga-02859.herokuapp.com/https://nwac.us/data-portal/csv/q/?datalogger_id=1&year=2021", {
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
			// console.log(formatted);
			var precipV = precip(formatted);
			var maxTempV = maxTemp(formatted);
			var minTempV = minTemp(formatted);
			var avgTempV = avgTemp(formatted);
			var currentTempV = currentTemp(formatted);

			makeTable(precipV, maxTempV, minTempV, avgTempV, currentTempV);
		}
	});
}

function snow(data) {

}

function precip(data) {
	var total = 0;
	data.forEach((item, index) => {
		total += parseFloat(item["Precipitation"]);
	})
	console.log(`24 hour precip: ${total} inches`)
	return total;
}

function nonSnowPrecip(data) {

}

function maxTemp(data) {
	var max = -100;
	data.forEach((item, index) => {
		temp = parseFloat(item["Temperature"]);
		if(temp > max) {
			max = temp;
		}
	})
	console.log(`24 hour max temp: ${max} F`)
	return max;
}

function minTemp(data) {
	var min = 200;
	data.forEach((item, index) => {
		temp = parseFloat(item["Temperature"]);
		if(temp < min) {
			min = temp;
		}
	})
	console.log(`24 hour min temp: ${min} F`)
	return min;
}

function avgTemp(data) {
	var total = 0;
	var count = 0;
	data.forEach((item, index) => {
		total += parseFloat(item["Temperature"]);
		count++;
	})
	average = total / count;
	console.log(`24 hour average temp: ${average} F`)
	return average.toString().substring(0, 5);
}

function currentTemp(data) {
	temp = parseFloat(data[0]["Temperature"])
	console.log(`Current temperature: ${temp} F`);
	return temp;
}

function currentSnowBase(data) {
	temp = parseFloat(data[0]["24 Hour Snow"])
	console.log(`Current temperature: ${temp} F`);
	return temp;
}

function makeTable(precipV, maxTempV, minTempV, avgTempV, currentTempV) {
	const table = document.createElement("TABLE");
	table.style.width = "100%";
	var valueNames = table.insertRow(-1);
	var values = table.insertRow(-1);
	console.log('here')

	precipTitle = valueNames.insertCell(0);
	precipTitle.innerHTML = "Precip";
	maxTempTitle = valueNames.insertCell(1);
	maxTempTitle.innerHTML = "Max Temp";
	minTempTitle = valueNames.insertCell(2);
	minTempTitle.innerHTML = "Min Temp";
	avgTempTitle = valueNames.insertCell(3);
	avgTempTitle.innerHTML = "Average Temp";
	currentTempTitle = valueNames.insertCell(4);
	currentTempTitle.innerHTML = "Current Temp";

	precipValue = values.insertCell(0);
	precipValue.innerHTML = `${precipV} in`;
	maxTempValue = values.insertCell(1);
	maxTempValue.innerHTML = `${maxTempV}° F`;
	minTempValue = values.insertCell(2);
	minTempValue.innerHTML = `${minTempV}° F`;
	avgTempValue = values.insertCell(3);
	avgTempValue.innerHTML = `${avgTempV}° F`;
	currentTempValue = values.insertCell(4);
	currentTempValue.innerHTML = `${currentTempV}° F`;

	var loading = document.getElementById("loading");
	loading.remove();

	var div1 = document.getElementById("div1");
	div1.appendChild(table);
}