/* Pi-hole
pi-hole JSON Leser und Statusseiten Parser
InfluxDB Vorbereitung

23.04.2017 von Pix erstellt
28.05.2017 var tabelle umgestellt
31.05.2017 forceCreation und common/influx
11.02.2018 Parse Temperatur, LOAD, Mem, Aktivitität; jeweils mit Farbe
           Code optimiert
           Ablauf optimiert
26.02.2018 Update der Serversoftware wird abgefragt
01.03.2018 Muster zur Temperaturerkennung optimiert
           
todo: Reaktionen mit Optin und telegram bei Serverausfall, Temperatur zu hoch, etc.           
           
*/

const fC = false; // forceCreation
const logging = false;
const pfad = ".Pi-hole.";
const zeitplan = "*/5 * * * *"; // alle 5 Minuten
const zeitplan_parse = "*/1 * * * *"; // minütlich
const ip_pihole = "192.168.40.8"; // IP Pi-hole eintragen


// #############################################################################
// ab hier nix mehr ändern

const url = "http://" + ip_pihole + "/admin/api.php";
const url_parse = "http://" + ip_pihole + "/admin/index.php";

// Instanz des Javascript-Adapters ermitteln
var instanz = "javascript." + instance;
if (logging) log(instanz);

// ID definieren
const idJSON             = instanz + pfad + "JSON",
      idDomains          = instanz + pfad + "Domains_blocked",
      idDNSQueries       = instanz + pfad + "DNS_queries",
      idAdsBlocked       = instanz + pfad + "Ads_blocked",
      idAdsPercentage    = instanz + pfad + "Ads_percentage",
      idActive           = instanz + pfad + "aktiv",
      idTemp             = instanz + pfad + "Temperatur",
      idTempFarbe        = instanz + pfad + "Farbe.Temperatur",
      idMemory           = instanz + pfad + "Speicher",
      idMemoryFarbe      = instanz + pfad + "Farbe.Speicher",
      idVersionFTL       = instanz + pfad + "Version.FTL",
      idVersionPihole    = instanz + pfad + "Version.Pihole",
      idVersionInterface = instanz + pfad + "Version.Interface",
      idLoad             = instanz + pfad + "Load",
      idLoadFarbe        = instanz + pfad + "Farbe.Load",
      idAktiv            = instanz + pfad + "aktiv_parse",
      idAktivFarbe       = instanz + pfad + "Farbe.aktiv_parse",
      idTabelle          = instanz + pfad + "Tabelle",
      idUpdate           = instanz + pfad + "Update";

// States erstellen
createState(idJSON, "", fC, {
    name: "JSON Datei vom Pi-hole Server",
    desc: "Kopie der JSON Datei",
    type: "string",
    read: true,
    write: true,
    role: "json",
    custom: {
        "influxdb.0": {
            "enabled": false,
            "changesOnly": false,
            "debounce": "",
            "retention": 657000 // 1 Monat
        }
    }
});
createState(idDomains, 0, fC, {
    name: "Pi-hole Domains blocked today", 
    desc: "Heute blockierte Domains (API)",
    type: "number", 
    def:  0,
    read: true,
    write: true,
    role: "value",
    custom: {
        "influxdb.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 657000 // 1 Monat
        }
    }
});
createState(idDNSQueries, 0, fC, {
    name: "Pi-hole DNS Queries today", 
    desc: "Heutige DOmain Name Server Anfragen (API)",
    type: "number", 
    def:  0,
    read: true,
    write: true,
    role: "value",
    custom: {
        "influxdb.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 657000 // 1 Monat
        }
    }
});
createState(idAdsBlocked, 0, fC, {
    name: "Pi-hole Ads blocked today", 
    desc: "Heute blockierte Werbungen (API)",
    type: "number", 
    def:  0,
    read: true,
    write: true,
    role: "value",
    custom: {
        "influxdb.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 657000 // 1 Monat
        }
    }
});
createState(idAdsPercentage, 0, fC, {
    name: "Pi-hole Ads percentage today", 
    desc: "Anteil heute blockierter Werbungen an allen Werbungen (API)", // weiß nicht, ob das korrekt übersetzt ist
    type: "number", 
    def:  0,
    read: true,
    write: true,
    min: 0,
    max: 100,
    role: "value",
    custom: {
        "influxdb.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 63072000 // 2 Jahre
        }
    }
});
createState(idActive, false, fC, {
    name: "Ist der Pi-hole Server aktiv?", 
    desc: "Liefert das Webinterface pi.hole/admin/api.php Daten? (API)",
    type: "boolean", 
    read: true,
    write: true,
    role: "indicator",
    custom: {
        "influxdb.0": {
            "enabled": false,
            "changesOnly": false,
            "debounce": "",
            "retention": 657000 // 1 Monat
        }
    }
});
createState(idAktiv, false, fC, {
    name: "Ist der Pi-hole Server aktiv?", 
    desc: "Läuft der Server (Webseite)",
    type: "boolean", 
    read: true,
    write: true,
    role: "indicator",
    custom: {
        "influxdb.0": {
            "enabled": false,
            "changesOnly": false,
            "debounce": "",
            "retention": 657000 // 1 Monat
        }
    }
});
createState(idAktivFarbe, "#FFFFFFF", fC, {
    name: "Pi-hole Aktivität HEX-Farbwert", 
    desc: "Indikator Farbwert Aktivität des Pi-Hole Servers (Webseite)",
    type: "string",
    def:  "#FFFFFF",
    read: true,
    write: true,
    role: "text"
});
createState(idLoad, "0", fC, {
    name: "Pi-hole CPU Load", 
    desc: "CPU Belastung (Load) des Pi-Hole Servers (Webseite)",
    type: "string",
    def:  "0",
    read: true,
    write: true,
    role: "text"
});
createState(idLoadFarbe, "#FFFFFFF", fC, {
    name: "Pi-hole Load HEX-Farbwert", 
    desc: "Indikator Farbwert LOAD des Pi-Hole Servers (Webseite)",
    type: "string",
    def:  "#FFFFFF",
    read: true,
    write: true,
    role: "text"
});
/*createState(idTemp, 0, fC, {
    name: "Pi-hole Temperatur", 
    desc: "Wärmeentwicklung des Pi-Hole Servers (Webseite)",
    type: "number",
    unit: "°C",
    def:  0,
    read: true,
    write: true,
    role: "value.temperature",
    custom: {
        "influxdb.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 63072000 // 2 Jahre
        }
    }
});
createState(idTempFarbe, "#FFFFFFF", fC, {
    name: "Pi-hole Temperatur HEX-Farbwert", 
    desc: "Indikator Farbwert des Pi-Hole Servers (Webseite)",
    type: "string",
    def:  "#FFFFFF",
    read: true,
    write: true,
    role: "text"
});*/
createState(idVersionPihole, "", fC, {
    name: "Pi-hole Version", 
    desc: "Software Version Pi-hole (Webseite)",
    type: "string",
    def:  "",
    read: true,
    write: true,
    role: "text"
});
createState(idVersionFTL, "", fC, {
    name: "FTL Version", 
    desc: "Software Version FTL (Webseite)",
    type: "string",
    def:  "",
    read: true,
    write: true,
    role: "text"
});
createState(idVersionInterface, "", fC, {
    name: "Web Interface Version", 
    desc: "Software Version Web Interface (Webseite)",
    type: "string",
    def:  "",
    read: true,
    write: true,
    role: "text"
});
createState(idMemory, 0, fC, {
    name: "Pi-hole Speichernutzung", 
    desc: "von Pi-Hole belegter Hauptspeicher (Webseite)",
    type: "number",
    unit: "%",
    def:  0,
    read: true,
    write: true,
    min: 0,
    max: 100,
    role: "value",
    custom: {
        "influxdb.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 63072000 // 2 Jahre
        }
    }
});
createState(idMemoryFarbe, "#FFFFFFF", fC, {
    name: "Pi-hole Speichernutzung HEX-Farbwert", 
    desc: "Indikator Farbwert Speichernutzung des Pi-Hole Servers (Webseite)",
    type: "string",
    def:  "#FFFFFF",
    read: true,
    write: true,
    role: "text"
});
createState(idTabelle, "", true, {
    name: "Pi-hole HTML Tabelle",
    desc: "HMTL Tabelle mit den Daten der JSON-Datei",
    type: "string",
    read: true,
    write: true,
    role: "html",
    custom: {
        "influxdb.0": {
            "enabled": false,
            "changesOnly": false,
            "debounce": "",
            "retention": 63072000 // 2 Jahre
        }
    }
});
createState(idUpdate, false, fC, {
    name: "Ist ein Pi-hole Softwareupdate möglich?", 
    desc: "Gibt es eine neue Version der Serversoftware? (Webseite)",
    type: "boolean", 
    read: true,
    write: true,
    role: "indicator"
});
 

var request = require("request");

function parseWebsite() { // für Version 3.3
    var options = {
        url: url_parse,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
        }
    }; 
    try {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {              // kein Fehler, Inhalt in body
                // Temperatur Zahl
/*                const temp_pattern = /\d+\.?\d*(?=&nbsp;&deg;C)/;
                if (body.match(temp_pattern) === null) log('gesuchter Quellcode (Temperatur Pi-Hole) nicht gefunden', 'error');
                else {
                    var temp_arr =  body.match(temp_pattern);
                    var temp = parseFloat(temp_arr[0]);
                    if (logging) log("Temperatur: " + temp + "°C");
                    setState(idTemp, temp);        
                }
                // Temperatur Farbe String
                const tempfarbe_pattern = /.{7}(?="><\/i> Temp)/;
                if (body.match(tempfarbe_pattern) === null) log('gesuchter Quellcode (Temperatur Farbe Pi-Hole) nicht gefunden', 'error');
                else {
                    var tempfarbe_arr =  body.match(tempfarbe_pattern);
                    if (logging) log("Temperatur-Farbe (HEX-Wert): " + tempfarbe_arr[0]);
                    setState(idTempFarbe, tempfarbe_arr[0]);        
                }
*/                // Speicherbelegung Zahl
                const mem_pattern = /\d{1,2}\.\d{1}(?=&thinsp;%<\/a>)/;
                if (body.match(mem_pattern) === null) log('gesuchter Quellcode (Speicherbelegung Pi-Hole) nicht gefunden', 'error');
                else {
                    var mem_arr =  body.match(mem_pattern);
                    var mem = parseFloat(mem_arr[0]);
                    if (logging) log("Speicherbelegung: " + mem + "%");
                    setState(idMemory, mem);        
                }
                // Farbe Speicherbelegung String / HEX-Wert
                const memfarbe_pattern = /.{7}(?="><\/i> Memory)/;
                if (body.match(memfarbe_pattern) === null) log('gesuchter Quellcode (Farbe Speicherbelegung Pi-Hole) nicht gefunden', 'error');
                else {
                    var memfarbe_arr =  body.match(memfarbe_pattern);
                    if (logging) log("Speicherbelegung Farbe: " + memfarbe_arr[0]);
                    setState(idMemoryFarbe, memfarbe_arr[0]);        
                }
                // LOAD String zB 0 0 0 oder 10.4 1.45 0
                const load_pattern = /Load:&nbsp;&nbsp;(\d*|\d*\.\d*)&nbsp;&nbsp;(\d*|\d*\.\d*)&nbsp;&nbsp;(\d*|\d*\.\d*)/;
                if (body.match(load_pattern) === null) log('gesuchter Quellcode (LOAD Pi-Hole) nicht gefunden', 'error');
                else {
                    var load_arr =  body.match(load_pattern);
                    var load0 = load_arr[0].replace(/Load:/i,"");
                    var load = load0.replace(/&nbsp;/g,"  ");
                    if (logging) log("CPU LOAD Server: " + load);
                    setState(idLoad, load);        
                }
                // Farbe LOAD String / HEX-Wert
                const loadfarbe_pattern = /.{7}(?="><\/i>.*Load:)/;
                if (body.match(loadfarbe_pattern) === null) log('gesuchter Quellcode (Farbe LOAD Pi-Hole) nicht gefunden', 'error');
                else {
                    var loadfarbe_arr =  body.match(loadfarbe_pattern);
                    if (logging) log("LOAD Farbe: " + loadfarbe_arr[0]);
                    setState(idLoadFarbe, loadfarbe_arr[0]);        
                }
                // Version Pihole zB 3.2.1 String
                const versionpi_pattern = /<b>Pi-hole Version \s*<\/b>\s*v\d*(\.\d*)*\.\d*/; // x.x.x oder x.x
                if (body.match(versionpi_pattern) === null) log('gesuchter Quellcode (Pi-Hole Version) nicht gefunden', 'error');
                else {
                    var versionpi_arr =  body.match(versionpi_pattern);
                    var versionpi = versionpi_arr[0].replace(/<b>Pi-hole Version <\/b> v/,"");
                    if (logging) log("Version Pihole Server: " + versionpi);
                    setState(idVersionPihole, versionpi);        
                }
                // Version FTL zB 3.2.1 String
                const versionftl_pattern = /<b>FTL Version.*v\d*(\.\d*)*\.\d*/;
                if (body.match(versionftl_pattern) === null) log('gesuchter Quellcode (FTL Version) nicht gefunden', 'error');
                else {
                    var versionftl_arr =  body.match(versionftl_pattern);
                    var versionftl = versionftl_arr[0].replace(/<b>FTL Version.*v/,"");
                    if (logging) log("FTL Version Pihole Server: " + versionftl);
                    setState(idVersionFTL, versionftl);        
                }
                // Version Web Interface zB 3.2.1 String
                const versioninterface_pattern = /<b>Web Interface Version.*<\/b>v\d*(\.\d*)*\.\d*/;
                if (body.match(versioninterface_pattern) === null) log('gesuchter Quellcode (Web Interface Version) nicht gefunden', 'error');
                else {
                    var versioninterface_arr =  body.match(versioninterface_pattern);
                    var versioninterface = versioninterface_arr[0].replace(/<b>Web Interface Version.*<\/b>v/,"");
                    if (logging) log("Web Interface Version Pihole Server: " + versioninterface);
                    setState(idVersionInterface, versioninterface);        
                }
                // Aktiv zB true/false boolean holt das aus String
                //const aktiv_pattern = /i>.*(?=<\/a><a id="temperature">)/;
                //if (body.match(aktiv_pattern) === null) log('gesuchter Quellcode (Pi-hole aktiv) nicht gefunden', 'error');
                //else {
                //    var aktiv_arr =  body.match(aktiv_pattern);
                //    var aktiv = aktiv_arr[0].replace(/i>\s*/,"");
                //    var aktiv_bool = (aktiv === "Active") ? true : false;
                //    if (logging) log("Pihole Server aktiv? " + aktiv + "(" + aktiv_bool + ")");
                //    setState(idAktiv, aktiv_bool);     
                //}
                // Farbe Aktiv String / HEX-Wert
                //const aktivfarbe_pattern = /.{7}(?="><\/i.*<\/a><a id="temperature">)/;
                //if (body.match(aktivfarbe_pattern) === null) log('gesuchter Quellcode (Farbe Aktivität Pi-Hole) nicht gefunden', 'error');
                //else {
                //    var aktivfarbe_arr =  body.match(aktivfarbe_pattern);
                //    if (logging) log("Aktivität Farbe: " + aktivfarbe_arr[0]);
                //    setState(idAktivFarbe, aktivfarbe_arr[0]);        
                //}
                // Update available
                const update_pattern = /Update available!/;
                if (body.match(update_pattern) === null) setState(idUpdate, false); //log('gesuchter Quellcode (Update Warnung) nicht gefunden', 'error');
                else {
                    var update_arr =  body.match(update_pattern);
                    var update = update_arr[0];
                    var update_bool = update === ("Update available!") ? true : false;
                    if (logging) log("Pihole Softwareupdate möglich? (" + update_bool + ")");
                    setState(idUpdate, update_bool);          
                }
            } else {
                log("StatusCode = " + response.statusCode);
                log(error, 'error');                               // Error beim Einlesen
            }
        });
    } catch (e) {
        log('Fehler (try) leseWebseite (Pi-Hole Index.html): ' + e, 'error');
    }
    if (logging) log('Pi-Hole Webseite eingelesen, Temperatur und Speicherbelegung gespeichert');
}


function readPihole() {
    if (logging) log("Pi-hole: URL " + url + " wird abgefragt ...");
    var tabelle ="<table class='pihole_tabelle'><caption>Pi-hole</caption><thead><tr><th>Admin Service: " + url + "</th></tr></thead><tbody>";
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result;
            var dnsblocked,
                dnsqueries,
                adsblocked,
                adspercentage; 
            try{
                result = JSON.parse(body);
                var data = JSON.stringify(result, null, 2);
                if (logging) log(data);
                if (logging) log(body);
                setState(idJSON, data);
                if (logging) log("JSON: "+ getState(idJSON).val);
                
                if (result) { // CHECK
                
                    setState(idActive, true);
                    if (logging) log("Pi-hole liefert Daten und ist aktiv");
                    // http://forum.iobroker.net/viewtopic.php?f=24&t=6053&sid=65e9ec9396fe557147e535c5a4631982#p68823
                    dnsblocked = (result.domains_being_blocked)/*.replace(/,/, "")*/;
                    dnsqueries = (result.dns_queries_today)/*.replace(/,/, "")*/;
                    adsblocked = result.ads_blocked_today;
                    adspercentage = result.ads_percentage_today;
                    
                    if ( isNaN(parseFloat(adspercentage)) === false ) {
                        setState(idAdsPercentage, parseFloat(adspercentage));
                    } else setState(idAdsPercentage, 100);
                    setState(idDomains, parseFloat(dnsblocked));
                    setState(idDNSQueries, parseFloat(dnsqueries));
                    setState(idAdsBlocked, parseFloat(adsblocked));
                
                    // Eintrag anfügen
                    tabelle += "<tr><td class='pihole_label'>Anzahl blockierter Domains:</td>"
                            +  "<td class='pihole_data'>" + dnsblocked + "</td></tr>"
                            
                            +  "<tr><td class='pihole_label'>DNS-Abfragen (heute):</td>"
                            +  "<td class='pihole_data'>" + dnsqueries + "</td></tr>"
                        
                            +  "<tr><td class='pihole_label'>Blockierte Werbung (heute):</td>"
                            +  "<td class='pihole_data'>" + adsblocked + "</td></tr>"
                        
                            +  "<tr><td class='pihole_label'>Werbeanteil (heute in Prozent):</td>"
                            +  "<td class='pihole_data'>" + adspercentage + "</td></tr>";
                } else tabelle += "<tr><td class='pihole_data'>Pi-hole nicht gefunden!</td></tr>";
                // Ende Teil,d er aus dem Try raus kann
            } catch (fehler_try) {
                log("Pi-hole - Parse Fehler: " + fehler_try, "error");
            }    
        } else {
            log("Pi-hole - Fehler: " + error, "warn");
        }
        tabelle += "</tbody></table>";  
        setState(idTabelle, tabelle);                     
        if (logging) log("HTML-Tabelle: " + tabelle);
    });   // Ende request 
}

function main() {
    readPihole();
    setTimeout(parseWebsite, 3000); // verzögertes Parsen
}
schedule(zeitplan_parse, parseWebsite);
schedule(zeitplan, readPihole);
setTimeout(main, 500);