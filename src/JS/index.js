var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CMS = /** @class */ (function () {
    function CMS() {
    }
    return CMS;
}());
var Manager = /** @class */ (function () {
    function Manager() {
    }
    return Manager;
}());
var DataProvider = /** @class */ (function () {
    function DataProvider(domain) {
        if (domain === null)
            throw new Error("Domain is null");
        this.domain = domain;
        this.supportToolDomain = "https://kksupport.ddev.site/api/domainQuery/" + this.domain;
        this.data = this.getSupportToolData();
    }
    DataProvider.prototype.getSupportToolData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fetch(_this.supportToolDomain).then(function (response) {
                            if (response.status !== 200) {
                                console.error(_this.supportToolDomain);
                                throw new Error("Status code not 200");
                            }
                            return response.json();
                        }).then(function (data) {
                            resolve(data);
                            console.info("SupportTool data loaded");
                            console.info(data);
                        }).catch(function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    DataProvider.prototype.getIsKK = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.data.then(function (data) {
                            return data["isKKManaged"];
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataProvider.prototype.getManager = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.data.then(function (data) {
                            var manager = new Manager();
                            manager.title = data["isManagedBy"]["title"];
                            manager.login = data["isManagedBy"]["url"];
                            resolve(manager);
                        });
                    })];
            });
        });
    };
    DataProvider.prototype.getCMS = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.data.then(function (data) {
                            var cms = new CMS();
                            cms.title = data["cms"]["title"];
                            cms.login = data["cms"]["url"];
                            resolve(cms);
                        });
                    })];
            });
        });
    };
    DataProvider.prototype.getIP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.data.then(function (data) {
                            try {
                                var resolved = data["resolved"];
                                var ip = resolved.filter(function (item) { return item.type === "A"; })[0]["ip"];
                                resolve(ip);
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                    })];
            });
        });
    };
    DataProvider.prototype.getMX = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.data.then(function (data) {
                            try {
                                var resolved = data["resolved"];
                                var mx = resolved.filter(function (item) { return item.type === "MX"; })[0]["ip"];
                                resolve(mx);
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                    })];
            });
        });
    };
    DataProvider.prototype.getMailSettingsAdmin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.data.then(function (data) {
                            try {
                                var mailSettingsAdmin = data["mailsettings"]["admin"];
                                resolve(mailSettingsAdmin);
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                    })];
            });
        });
    };
    DataProvider.prototype.getMailSetting = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.data.then(function (data) {
                            try {
                                var mailSettings = data["mailsettings"]["secure"];
                                resolve([mailSettings[type]["servername"], mailSettings[type]["port"]]);
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                    })];
            });
        });
    };
    DataProvider.prototype.getImap = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMailSetting("imap")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataProvider.prototype.getPop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMailSetting("pop")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataProvider.prototype.getSmtp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMailSetting("smtp")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DataProvider;
}());
var ExtensionBuilder = /** @class */ (function () {
    function ExtensionBuilder(url) {
        this.url = url;
        if (this.url.hostname == "")
            throw new Error("Hostname is empty");
        this.dataProvider = new DataProvider(this.url.hostname);
    }
    ExtensionBuilder.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isKKNode, managerNode, cmsNode, ipNode, _a, _b, _c, _d, _e, _f, mxNode, mailAdminNode, imapServerNode, imapPortNode, popServerNode, popPortNode, smtpServerNode, smtpPortNode, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
            var _this = this;
            return __generator(this, function (_4) {
                switch (_4.label) {
                    case 0:
                        isKKNode = document.getElementById("isKK");
                        managerNode = document.getElementById("manager");
                        cmsNode = document.getElementById("cms");
                        ipNode = document.getElementById("ip");
                        if (isKKNode === null || managerNode === null || cmsNode === null || ipNode === null) {
                            throw new Error("Element not found");
                        }
                        _a = this.setContent;
                        _b = [isKKNode];
                        return [4 /*yield*/, this.dataProvider.getIsKK()];
                    case 1:
                        _b = _b.concat([(_4.sent()) ? "Ja" : "Nein"]);
                        return [4 /*yield*/, this.dataProvider.getIsKK()];
                    case 2:
                        _a.apply(this, _b.concat([(_4.sent()) ? "#00FF00" : "#FF0000"]));
                        _c = this.setLink;
                        _d = [managerNode];
                        return [4 /*yield*/, this.dataProvider.getManager().then(function (manager) { return manager.title; })];
                    case 3:
                        _d = _d.concat([_4.sent()]);
                        return [4 /*yield*/, this.dataProvider.getManager().then(function (manager) { return manager.login; })];
                    case 4:
                        _c.apply(this, _d.concat([_4.sent()]));
                        return [4 /*yield*/, this.dataProvider.getCMS().then(function (cms) {
                                if (cms.login == "") {
                                    _this.setContent(cmsNode, cms.title);
                                }
                                else {
                                    _this.setLink(cmsNode, cms.title, _this.url + cms.login);
                                }
                            })];
                    case 5:
                        _4.sent();
                        _e = this.setContent;
                        _f = [ipNode];
                        return [4 /*yield*/, this.dataProvider.getIP()];
                    case 6:
                        _e.apply(this, _f.concat([_4.sent()]));
                        mxNode = document.getElementById("mx");
                        mailAdminNode = document.getElementById("mail-admin");
                        imapServerNode = document.getElementById("imap-servername");
                        imapPortNode = document.getElementById("imap-port");
                        popServerNode = document.getElementById("pop-servername");
                        popPortNode = document.getElementById("pop-port");
                        smtpServerNode = document.getElementById("smtp-servername");
                        smtpPortNode = document.getElementById("smtp-port");
                        if (mxNode === null || imapServerNode === null || imapPortNode === null || popServerNode === null || popPortNode === null || smtpServerNode === null || smtpPortNode === null) {
                            throw new Error("Element not found");
                        }
                        _g = this.setContent;
                        _h = [mxNode];
                        return [4 /*yield*/, this.dataProvider.getMX()];
                    case 7:
                        _g.apply(this, _h.concat([_4.sent()]));
                        _j = this.setLink;
                        _k = [mailAdminNode];
                        return [4 /*yield*/, this.dataProvider.getMailSettingsAdmin().then(function (mailSettingsAdmin) { return mailSettingsAdmin; })];
                    case 8:
                        _k = _k.concat([_4.sent()]);
                        return [4 /*yield*/, this.dataProvider.getMailSettingsAdmin().then(function (mailSettingsAdmin) { return mailSettingsAdmin; })];
                    case 9:
                        _j.apply(this, _k.concat([_4.sent()]));
                        _l = this.setContent;
                        _m = [imapServerNode];
                        _o = "IP: ";
                        return [4 /*yield*/, this.dataProvider.getImap().then(function (imap) { return imap[0]; })];
                    case 10:
                        _l.apply(this, _m.concat([_o + (_4.sent())]));
                        _p = this.setContent;
                        _q = [imapPortNode];
                        _r = "Port: ";
                        return [4 /*yield*/, this.dataProvider.getImap().then(function (imap) { return imap[1]; })];
                    case 11:
                        _p.apply(this, _q.concat([_r + (_4.sent())]));
                        _s = this.setContent;
                        _t = [popServerNode];
                        _u = "IP: ";
                        return [4 /*yield*/, this.dataProvider.getPop().then(function (pop) { return pop[0]; })];
                    case 12:
                        _s.apply(this, _t.concat([_u + (_4.sent())]));
                        _v = this.setContent;
                        _w = [popPortNode];
                        _x = "Port: ";
                        return [4 /*yield*/, this.dataProvider.getPop().then(function (pop) { return pop[1]; })];
                    case 13:
                        _v.apply(this, _w.concat([_x + (_4.sent())]));
                        _y = this.setContent;
                        _z = [smtpServerNode];
                        _0 = "IP: ";
                        return [4 /*yield*/, this.dataProvider.getSmtp().then(function (smtp) { return smtp[0]; })];
                    case 14:
                        _y.apply(this, _z.concat([_0 + (_4.sent())]));
                        _1 = this.setContent;
                        _2 = [smtpPortNode];
                        _3 = "Port: ";
                        return [4 /*yield*/, this.dataProvider.getSmtp().then(function (smtp) { return smtp[1]; })];
                    case 15:
                        _1.apply(this, _2.concat([_3 + (_4.sent())]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ExtensionBuilder.prototype.setLink = function (node, content, link, color) {
        if (color === void 0) { color = "#9dc6fa"; }
        node.innerHTML = "";
        var linkNode = document.createElement("a");
        linkNode.setAttribute("href", link);
        linkNode.style.color = color;
        linkNode.style.textDecoration = "underline";
        linkNode.setAttribute("target", "_blank");
        linkNode.classList.add("link");
        linkNode.innerText = content;
        node.appendChild(linkNode);
    };
    ExtensionBuilder.prototype.setContent = function (node, content, color) {
        if (color === void 0) { color = "#ffffff"; }
        node.innerText = content;
        node.style.color = color;
    };
    return ExtensionBuilder;
}());
console.info("Supportpal started");
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = new URL(String(tabs[0].url));
    if (!url.origin.startsWith("http")) {
        var errorNode = document.getElementById("error");
        errorNode.innerText = "Keine URL gefunden";
        errorNode.style.display = "flex";
        throw new Error("Hostname is empty");
    }
    else {
        new ExtensionBuilder(new URL(String(tabs[0].url))).build();
    }
});
