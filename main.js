// From https://www.w3docs.com/snippets/javascript/how-to-make-http-get-request-in-javascript.html
function httpGet(theUrl) {
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", theUrl, false); 
    xmlHttpReq.send(null);
    return xmlHttpReq.responseText;
}

const ipRangeUrl = "https://ip-ranges.amazonaws.com/ip-ranges.json";
let ipMap = new Map();

function load() {
    document.getElementById("results").style.display = "none";
    
    // Update the url in data element
    document.getElementById("data").href = ipRangeUrl;
    document.getElementById("data").innerHTML = ipRangeUrl;

    // Load any saved values
    let region = localStorage.getItem("region");
    let service = localStorage.getItem("service");

    // Load the IP ranges
    let json = JSON.parse(httpGet(ipRangeUrl));

    if (!json) {
        console.log("Error: Could not load IP ranges");
        return;
    }

    //Make a map of each region and service combination to the IP prefix
    ipMap = new Map();

    //Remove all options from the region and service dropdowns
    document.getElementById("region-select").innerHTML = "";
    document.getElementById("service-select").innerHTML = "";

    for (const prefix of json.prefixes) {
        let key = prefix.region + prefix.service;
        ipMap.set(key, prefix.ip_prefix);

        //Add the region to the dropdown if it doesn't exist
        if (!document.getElementById(prefix.region)) {
            let option = document.createElement("option");
            option.value = prefix.region;
            option.text = prefix.region;
            option.id = prefix.region;
            document.getElementById("region-select").appendChild(option);
        }

        //Add the service to the dropdown if it doesn't exist
        if (!document.getElementById(prefix.service)) {
            let option = document.createElement("option");
            option.value = prefix.service;
            option.text = prefix.service;
            option.id = prefix.service;
            document.getElementById("service-select").appendChild(option);
        }
    }

    //If the region or service exists in the dropdown, select it
    if (region && document.getElementById(region)) {
        document.getElementById("region-select").value = region;
        updateResults();
    }

    if (service && document.getElementById(service)) {
        document.getElementById("service-select").value = service;
        updateResults();
    }
}

function updateResults() {
    let region = document.getElementById("region-select").value;
    let service = document.getElementById("service-select").value;

    let key = region + service;
    let ip = ipMap.get(key);

    if (ip) {
        document.getElementById("copy").style.display = "inline";
        document.getElementById("copy").innerHTML = "📋";
    } else {
        document.getElementById("copy").style.display = "none";
    }

    document.getElementById("ip").innerHTML = ip;
    document.getElementById("region").innerHTML = region;
    document.getElementById("service").innerHTML = service;
    document.getElementById("results").style.display = "block";
    save();
}

function copyIP() {
    let region = document.getElementById("region-select").value;
    let service = document.getElementById("service-select").value;

    let key = region + service;
    let ip = ipMap.get(key);

    if (ip) {
        console.log("Copying " + ip);
        navigator.clipboard.writeText(ip);
        document.getElementById("copy").innerHTML = "✅";
        setTimeout(function() { document.getElementById("copy").innerHTML = "📋"; }, 2000);
    } else {
        console.log("Error: IP not found");
    }
}

function save() {
    localStorage.setItem("region", document.getElementById("region-select").value);
    localStorage.setItem("service", document.getElementById("service-select").value);
}