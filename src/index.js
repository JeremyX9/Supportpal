jsonData = fetch("./mappings.json").then(response => response.json()).then(data => jsonData = data);

browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = new URL(tabs[0].url);
    let hostname = url.hostname;
    if (hostname) {
        setBasicInformations(hostname);
        setNameservers(hostname);
        setDnsRecords(hostname);

    }
});

function setBasicInformations(hostname) {
    let ipv4 = browser.dns.resolve(hostname, ["disable_ipv6"]).then((value) => { displayElement("ipv4", value.addresses.map(item => `${item} <br>`).join("")); }).catch((error) => { console.log(error); });
    let ipv6 = browser.dns.resolve(hostname, ["disable_ipv4"]).then((value) => { displayElement("ipv6", value.addresses.map(item => `${item} <br>`).join("")); }).catch((error) => { console.log(error); });
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
    a.classList.add("text-red-700");
    a.classList.add("hover:text-red-500");
    a.classList.add("underline");
    document.getElementById("manager").appendChild(a);
}