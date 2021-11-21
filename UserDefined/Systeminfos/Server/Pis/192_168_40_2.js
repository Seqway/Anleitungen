/* Skript zum Einlesen der Pi Server Systeminfos

FYI: Prozent Plattenbelegung kommt als String mit Einheit

14.09.2017 Daten kommen per Simple API vom Server (XU4)
21.10.2017 Temperatur Überwachung
01.01.2018 Lüfter eingepflegt
15.04.2018 LOAD, CORES und SPACE eingepflegt
18.04.2018 Einzelne Werte werden in Objekte geschrieben
           Bash-Quellskript fertiggestellt
*/
const logging = false;
const fC = true;

//const idLuefter = "hm-rpc.0.KEQ0193137.1.STATE"/*Lüfter Flur Anrichte.STATE*/;
const server = "Pi Server 1";
const pfad = "javascript." + instance + ".Systeminfos.Pis.Server.1.";

// Meldung
function meldung_push (text, titel, prio) {
    var dienst = 2; // telegram
    push(dienst, text, titel, prio, "j");
}

// Server 1
// Objekte für Systemdaten des Pis (Daten werden aus dem ARM-Rechner per SimpleAPI an ioBroker gesendet)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// TEMP
const idServerTemp = pfad + "Temperatur";
createState(idServerTemp, 0, fC, {
   read: true,
   write: true,
   name: server + " Temperatur",
   desc: "umgerechnete Temperatur zur Weiterverwendung",
   type: "number",
   role: "temperature",
   unit: "°C",
});
 
on(idServerTemp, function(data) {
    if (logging) log("neue Temperatur vom " + server + " empfangen: " + data.state.val + "°C");
});


on({
    id: idServerTemp,
    valGt: 89, // größer als 90°C
    oldValLt: 89, // alter Wert kleiner als 89°C
    logic: "and"
}, function (obj) {
    var nachricht = "Pi Server Temperatur ist im kritischen Bereich: " + obj.state.val + "°C";
    if (!getState(idLuefter).val ) {
        setState(idLuefter, true);
        nachricht += ". Der Lüfter in der Anrichte war aus und wurde nun eingeschaltet";
    }
    log(nachricht);
    meldung_push(nachricht, "ioBroker Warnung", 1);
});

// MEMTotal
const idServerMEMTotal = pfad + "Memory.MEMTotal";
createState(idServerMEMTotal, 0, fC, {
   read: true,
   write: true,
   name: server + " MEMTotal",
   type: "number",
   unit: "MB",
});
 
on(idServerMEMTotal, function(data) {
    if (logging) log("neuen Speicher vom " + server + " empfangen: " + data.state.val + "MB");
});

// MEM_FREE
const idServerMEM_FREE = pfad + "Memory.MEM_FREE";
createState(idServerMEM_FREE, 0, fC, {
   read: true,
   write: true,
   name: server + " MEM_FREE",
   type: "number",
   unit: "MB",
});
 
on(idServerMEM_FREE, function(data) {
    if (logging) log("neuen Speicher vom " + server + " empfangen: " + data.state.val + "MB");
});

// SD-Total
const idServerSD_Total = pfad + "SD.SD_Total";
createState(idServerSD_Total, 0, fC, {
   read: true,
   write: true,
   name: server + " SD_Total",
   type: "number",
   unit: "MB",
});
 
on(idServerSD_Total, function(data) {
    if (logging) log("neuen Speicher vom " + server + " empfangen: " + data.state.val + "MB");
});

// SD_Total_Used
const idServerSD_Total_Used = pfad + "SD.SD_Total_Used";
createState(idServerSD_Total_Used, 0, fC, {
   read: true,
   write: true,
   name: server + " SD_Total_Used",
   type: "number",
   unit: "MB",
});
 
on(idServerSD_Total_Used, function(data) {
    if (logging) log("neuen Speicher vom " + server + " empfangen: " + data.state.val + "MB");
});

// SD_Total_Free
const idServerSD_Total_Free = pfad + "SD.SD_Total_Free";
createState(idServerSD_Total_Free, 0, fC, {
   read: true,
   write: true,
   name: server + " SD_Total_Free",
   type: "number",
   unit: "MB",
});
 
on(idServerSD_Total_Free, function(data) {
    if (logging) log("neuen Speicher vom " + server + " empfangen: " + data.state.val + "MB");
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// LOAD 
const idServerLoad1 = pfad + "Load1",
      idServerLoad5 = pfad + "Load5",
      idServerLoad15 = pfad + "Load15";

createState(idServerLoad1, 0, fC, {
   read: true,
   write: true,
   name: server + " Load1",
   desc: "/loadavg 1min",
   type: "number"
});
createState(idServerLoad5, 0, fC, {
   read: true,
   write: true,
   name: server + " Load5",
   desc: "/loadavg 5min",
   type: "number"
});
createState(idServerLoad15, 0, fC, {
   read: true,
   write: true,
   name: server + " Load15",
   desc: "/loadavg 15min",
   type: "number"
});

on({
    id: [
        idServerLoad1,
        idServerLoad5,
        idServerLoad15
        ]
}, function(data) {
    if (logging) log("neuer Load vom " + data.deviceName + " empfangen: " + data.state.val);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CORES (ändert sich eigentlich nicht)
const idServerCores = pfad + "Cores";
createState(idServerCores, 0, fC, {
   read: true,
   write: true,
   name: server + " Anzahl der Kerne",
   desc: "cat /proc/cpuinfo",
   type: "number",
   min: 0
});

on(idServerCores, function(data) {
   if (logging) log("neuer Wert Cores vom " + data.deviceName + " empfangen: " + data.state.val);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SPACE EXT Sda2
/*const idServerSda2_size = pfad + "Sda2.size";
const idServerSda2_used = pfad + "Sda2.used";
const idServerSda2_avail = pfad + "Sda2.avail";
const idServerSda2_use = pfad + "Sda2.use";
const idServerSda2_mounted = pfad + "Sda2.mounted";

createState(idServerSda2_size, 0, fC, {
   read: true,
   write: true,
   name: server + " Sda2 Size",
   desc: "umgerechneter df-Wert zur Weiterverwendung",
   type: "number",
   unit: "Bytes"
});
createState(idServerSda2_used, 0, fC, {
   read: true,
   write: true,
   name: server + " Sda2 used",
   desc: "umgerechneter df-Wert zur Weiterverwendung",
   type: "number",
   unit: "Bytes",
   custom: {
        "sql.0": {
            "enabled": true,
            "changesOnly": false,
            "debounce": "",
            "retention": 63072000 // 2 Jahre
        }
   }
});
createState(idServerSda2_avail, 0, fC, {
   read: true,
   write: true,
   name: server + " Sda2 avail",
   desc: "umgerechneter df-Wert zur Weiterverwendung",
   type: "number",
   unit: "Bytes",
   custom: {
        "sql.0": {
            "enabled": true,
            "changesOnly": false,
            "debounce": "",
            "retention": 63072000 // 2 Jahre
        }
   }
});
createState(idServerSda2_use, 0, fC, {
   read: true,
   write: true,
   name: server + " Sda2 Auslastung",
   desc: "umgerechneter df-Wert zur Weiterverwendung",
   type: "number",
   unit: "%",
   custom: {
        "sql.0": {
            "enabled": true,
            "changesOnly": false,
            "debounce": "",
            "retention": 63072000 // 2 Jahre
        }
   }
});
createState(idServerSda2_mounted, "", fC, {
   read: true,
   write: true,
   name: server + " Sda2 mounted on (Pfad)",
   desc: "umgerechneter df-Wert zur Weiterverwendung",
   type: "string"
});

on({
    id: [
        idServerSda2_size,
        idServerSda2_used,
        idServerSda2_avail,
        idServerSda2_use,
        idServerSda2_mounted
        ]
}, function(data) {
    if (logging) log("neue Daten vom " + data.deviceName + " empfangen (externe Platte an USB SDA2): " + data.state.val);
}); */