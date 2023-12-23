jsonData = fetch("./mappings.json").then(response => response.json()).then(data => jsonData = data);
if (typeof browser === "undefined") {
    let browser = chrome;
}

async function bootstrap() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        const url = new URL(tabs[0].url)
        loadData(url.hostname);
    });

}

document.addEventListener('DOMContentLoaded', function () {
    bootstrap();
});


async function loadData(url) {
    const response = await fetch("https://kksupport.ddev.site/api/domainQuery/" + url);
    if (!response.ok) {
        return;
    }
    const kksupportResponse = await response.json();
    showFetchedData(kksupportResponse);

}

function showFetchedData(kksupportResponse) {

    const ipv4 = kksupportResponse["resolved"][0]["ip"];
    const isKKManaged = kksupportResponse["isKKManaged"];
    const isManagedBy = kksupportResponse["isManagedBy"];
    const cmsTitle = kksupportResponse["cms"];
    if (isKKManaged) {
        displayElement("isKKDomain", "<span style='color: green'>ja</span>")
        displayLink("manager", isManagedBy["title"], isManagedBy["url"]);
        displayElement("cms", cmsTitle);
    } else {
        displayElement("isKKDomain", "<span style='color: red'>nein</span>")
    }

    displayElement("ipv4", ipv4);
}


function setBasicInformations(hostname) {
    let ipv4 = browser.dns.resolve(hostname, ["disable_ipv6"]).then((value) => {
        displayElement("ipv4", value.addresses.map(item => `${item} <br>`).join(""));
    }).catch((error) => {
        console.log(error);
    });
    let ipv6 = browser.dns.resolve(hostname, ["disable_ipv4"]).then((value) => {
        displayElement("ipv6", value.addresses.map(item => `${item} <br>`).join(""));
    }).catch((error) => {
        console.log(error);
    });
    getManager(hostname);
    getCMS(hostname);
}

function setNameservers(hostname) {
    // set nameservers
}

function setDnsRecords(hostname) {
    // set dns records
}

function getManager(hostname) {
    jsonData.then((json) => {
        browser.dns.resolve(hostname, ["disable_ipv6"]).then((value) => {
            value.addresses.forEach(ipv4 => {
                for (let ipAddress in json.managers) {
                    if (ipAddress == ipv4) {
                        displayLink("manager", json.managers[ipAddress].title, json.managers[ipAddress].login);
                    }
                }
            });
        })
    });
}

function getCMS(hostname) {

}

function displayElement(id, text) {
    document.getElementById(id).innerHTML = text;
}

function displayLink(id, title, url) {
    let manager = document.getElementById(id);
    manager.innerHTML = "";
    let a = document.createElement("a");
    a.href = url;
    a.title = title;
    a.target = "_blank";
    a.innerText = title;
    a.classList.add("underline");
    document.getElementById("manager").appendChild(a);
}