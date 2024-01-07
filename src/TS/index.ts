class CMS {
    public title: string;
    public login: string;
}

class ERPNextLink {
    public name: string;
    public url: string;
}

class Manager {
    public title: string;
    public login: string;
}

class DataProvider {

    domain: string;
    supportToolDomain: string;
    data: Promise<JSON>;

    public constructor(domain: string) {
        if (domain === null) throw new Error("Domain is null");
        this.domain = domain;
        this.supportToolDomain = "https://kksupport.ddev.site/api/domainQuery/" + this.domain;
        this.data = this.getSupportToolData();
    }

    public async getSupportToolData(): Promise<JSON> {
        return new Promise<JSON>((resolve, reject) => {
            fetch(this.supportToolDomain).then((response) => {
                if (response.status !== 200) {
                    console.error(this.supportToolDomain);
                    throw new Error("Status code not 200");

                }
                return response.json();
            }).then((data) => {
                resolve(data);
                console.info("SupportTool data loaded");
                console.info(data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async getIsKK(): Promise<boolean> {
        return await this.data.then((data) => {
            return data["isKKManaged"];
        });
    }

    public async getManager(): Promise<Manager> {
        return new Promise<Manager>((resolve, reject) => {
            this.data.then((data) => {
                let manager: Manager = new Manager();
                manager.title = data["isManagedBy"]["title"];
                manager.login = data["isManagedBy"]["url"];
                resolve(manager);
            });
        });
    }

    public async getCMS(): Promise<CMS> {
        return new Promise<CMS>((resolve, reject) => {
            this.data.then((data) => {
                let cms: CMS = new CMS();
                cms.title = data["cms"]["title"];
                cms.login = data["cms"]["url"];
                resolve(cms);
            });
        });
    }

    public async getERPNextUrl(): Promise<ERPNextLink> {
        return new Promise<ERPNextLink>((resolve, reject) => {
            this.data.then((data) => {
                const erpLink = new ERPNextLink();
                erpLink.name = data["erpnextUrl"]["name"];
                erpLink.url = data["erpnextUrl"]["url"];
                resolve(erpLink);
            });
        });
    }

    public async getIP(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.data.then((data) => {
                try {
                    let resolved: any = data["resolved"];
                    let ip = resolved.filter(item => item.type === "A")[0]["ip"];
                    resolve(ip);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    public async getMX(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.data.then((data) => {
                try {
                    let resolved: any = data["resolved"];
                    let mx = resolved.filter(item => item.type === "MX")[0]["ip"];
                    resolve(mx);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    public async getMailSettingsAdmin(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.data.then((data) => {
                try {
                    let mailSettingsAdmin: any = data["mailsettings"]["admin"];
                    resolve(mailSettingsAdmin);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    private async getMailSetting(type: string): Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            this.data.then((data) => {
                try {
                    let mailSettings: any = data["mailsettings"]["secure"];
                    resolve([mailSettings[type]["servername"], mailSettings[type]["port"]]);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    public async getImap(): Promise<Array<string>> {
        return await this.getMailSetting("imap");
    }

    public async getPop(): Promise<Array<string>> {
        return await this.getMailSetting("pop");
    }

    public async getSmtp(): Promise<Array<string>> {
        return await this.getMailSetting("smtp");
    }

}

class ExtensionBuilder {
    url: URL;
    dataProvider: DataProvider;

    public constructor(url: URL) {
        this.url = url;
        if (this.url.hostname == "") throw new Error("Hostname is empty");
        this.dataProvider = new DataProvider(this.url.hostname);
    }

    public async build(): Promise<void> {
        // default information
        let isKKNode: HTMLElement = document.getElementById("isKK")!;
        let managerNode: HTMLElement = document.getElementById("manager")!;
        let cmsNode: HTMLElement = document.getElementById("cms")!;
        let ipNode: HTMLElement = document.getElementById("ip")!;
        let erpnextUrl: HTMLElement = document.getElementById("erpnextUrl")!;

        if (isKKNode === null || managerNode === null || cmsNode === null || ipNode === null || erpnextUrl === null) {
            throw new Error("Element not found");
        }
        this.setContent(isKKNode, await this.dataProvider.getIsKK() ? "Ja" : "Nein", await this.dataProvider.getIsKK() ? "#00FF00" : "#FF0000");
        this.setLink(managerNode, await this.dataProvider.getManager().then((manager) => {
            return manager.title;
        }), await this.dataProvider.getManager().then((manager) => {
            return manager.login;
        }));
        this.setLink(erpnextUrl, await this.dataProvider.getERPNextUrl().then((manager) => {
            return manager.name;
        }), await this.dataProvider.getERPNextUrl().then((manager) => {
            return manager.url;
        }));
        await this.dataProvider.getCMS().then((cms) => {
            if (cms.login == "") {
                this.setContent(cmsNode, cms.title);
            } else {
                this.setLink(cmsNode, cms.title, this.url + cms.login);
            }
        });
        this.setContent(ipNode, await this.dataProvider.getIP());

        // mail settings
        let mxNode: HTMLElement = document.getElementById("mx")!;
        let mailAdminNode: HTMLElement = document.getElementById("mail-admin")!;
        let imapServerNode: HTMLElement = document.getElementById("imap-servername")!;
        let imapPortNode: HTMLElement = document.getElementById("imap-port")!;
        let popServerNode: HTMLElement = document.getElementById("pop-servername")!;
        let popPortNode: HTMLElement = document.getElementById("pop-port")!;
        let smtpServerNode: HTMLElement = document.getElementById("smtp-servername")!;
        let smtpPortNode: HTMLElement = document.getElementById("smtp-port")!;

        if (mxNode === null || imapServerNode === null || imapPortNode === null || popServerNode === null || popPortNode === null || smtpServerNode === null || smtpPortNode === null) {
            throw new Error("Element not found");
        }
        this.setContent(mxNode, await this.dataProvider.getMX());
        this.setLink(mailAdminNode, await this.dataProvider.getMailSettingsAdmin().then((mailSettingsAdmin) => {
            return mailSettingsAdmin;
        }), await this.dataProvider.getMailSettingsAdmin().then((mailSettingsAdmin) => {
            return mailSettingsAdmin;
        }));
        this.setContent(imapServerNode, "IP: " + await this.dataProvider.getImap().then((imap) => {
            return imap[0];
        }));
        this.setContent(imapPortNode, "Port: " + await this.dataProvider.getImap().then((imap) => {
            return imap[1];
        }));
        this.setContent(popServerNode, "IP: " + await this.dataProvider.getPop().then((pop) => {
            return pop[0];
        }));
        this.setContent(popPortNode, "Port: " + await this.dataProvider.getPop().then((pop) => {
            return pop[1];
        }));
        this.setContent(smtpServerNode, "IP: " + await this.dataProvider.getSmtp().then((smtp) => {
            return smtp[0];
        }));
        this.setContent(smtpPortNode, "Port: " + await this.dataProvider.getSmtp().then((smtp) => {
            return smtp[1];
        }));

    }

    private setLink(node: HTMLElement, content: string, link: string, color: string = "#9dc6fa"): void {
        node.innerHTML = "";
        let linkNode: HTMLAnchorElement = document.createElement("a");
        linkNode.setAttribute("href", link);
        linkNode.style.color = color;
        linkNode.style.textDecoration = "underline";
        linkNode.setAttribute("target", "_blank");
        linkNode.classList.add("link");
        linkNode.innerText = content;
        node.appendChild(linkNode);
    }

    private setContent(node: HTMLElement, content: string, color: string = "#ffffff"): void {
        node.innerText = content;
        node.style.color = color;
    }
}

console.info("Supportpal started");
chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    let url = new URL(String(tabs[0].url))
    if (!url.origin.startsWith("http")) {
        let errorNode: HTMLElement = document.getElementById("error")!;
        errorNode.innerText = "Keine URL gefunden";
        errorNode.style.display = "flex";
        throw new Error("Hostname is empty");
    } else {
        new ExtensionBuilder(new URL(String(tabs[0].url))).build();
    }
});