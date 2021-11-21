/* Luftdaten

Liest Daten eines Feinstaub-Sensors
von luftdaten.info aus

http://api.luftdaten.info/v1/sensor/####/

todo: Optin

05.06.2017 erstellt von Pix
10.07.2017 Code angepasst nach Fehler
*/


var sensorid = "5503";

var logging       = false;
var instanz       = 'javascript.' + instance + '.';
var pfad          = 'Luftdaten.' + sensorid + '.';
var cronStr       = "14,29,44,59 * * * *";

function createStates () {

// Allgemein   
    createState(pfad + 'json', {
        name: 'JSON',
        desc: 'JSON Ausgabe',
        type: 'string',
        role: 'json'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'json erstellt');
    });

    createState(pfad + 'sensor_id', {
        name: 'ID',
        desc: 'ID-Nummer des Sensors',
        type: 'string',
        role: 'text'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'sensor_id erstellt');
    });
    
    createState(pfad + 'sensor_type', {
        name: 'Typ',
        desc: 'Type des Sensors',
        type: 'string',
        role: 'text'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'sensor_type erstellt');
    });

    createState(pfad + 'location', {
        name: 'Ort',
        desc: 'Location des Sensors',
        type: 'string',
        role: 'text'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'location erstellt');
    });
    
    createState(pfad + 'lat', {
        name: 'Latitude',
        desc: 'Geographische Lage des Sensors - Breite',
        type: 'number',
        unit: '°',
        role: 'val'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'latitude erstellt');
    });
    
    createState(pfad + 'lon', {
        name: 'Longitude',
        desc: 'Geographische Lage des Sensors - Länge',
        type: 'number',
        unit: '°',
        role: 'val'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'longitude erstellt');
    });
    
    createState(pfad + 'country', {
        name: 'Country Code',
        desc: 'Geographische Lage des Sensors - Landeskürzel',
        type: 'string',
        role: 'text'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'country erstellt');
    });
    
    createState(pfad + 'Messung.timestamp', {
        name: 'Zeitstempel',
        desc: 'Zeitstempel der Messung',
        type: 'string',
        role: 'text'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'timestamp erstellt');
    });
    
    createState(pfad + 'Messung.P1', {
        name: 'P1',
        desc: 'Messung P1',
        type: 'number',
        role: 'val',
        custom: {
            "sql.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 63072000
            }
        }
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'Messung.P1 erstellt');
    });

    createState(pfad + 'Messung.P2', {
        name: 'P2',
        desc: 'Messung P2',
        type: 'number',
        role: 'val',
        custom: {
            "sql.0": {
            "enabled": true,
            "changesOnly": true,
            "debounce": "",
            "retention": 63072000
            }
        }
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'Messung.P2 erstellt');
    });


    createState(pfad + 'forceRefresh', {
        name: 'aktualisieren',
        desc: 'Werte neu einlesen',
        type: 'boolean',
        def:  false,
        role: 'indicator'
    }, function () {
        if (logging) log('Objekt ' + instanz + pfad + 'forceRefresh erstellt');
    });
}


function readData() {
    var request = require('request');
    var options = {
        url: 'http://api.luftdaten.info/v1/sensor/' + sensorid + '/',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
        }
    };  
    try {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {              // kein Fehler, Inhalt in body
                var p1, p2;
                var json = JSON.parse(body);
                if (logging) log('JSON: ' + JSON.stringify(json));
                setState(pfad + 'json', JSON.stringify(json));
                
                setState(pfad + 'sensor_id', json[0].sensor.id.toString());
                setState(pfad + 'sensor_type', json[0].sensor.sensor_type.name + ' by ' + json[0].sensor.sensor_type.manufacturer);
                
                setState(pfad + 'location', json[0].location.id.toString());
                setState(pfad + 'lat', parseFloat(json[0].location.latitude));
                setState(pfad + 'lon', parseFloat(json[0].location.longitude));
                setState(pfad + 'country', json[0].location.country);
                
                setState(pfad + 'Messung.timestamp', json[0].timestamp);
                p1 = json[0].sensordatavalues[0].value;
                p2 = json[0].sensordatavalues[1].value;
                
                setState(pfad + 'Messung.P1', parseFloat(p1));
                setState(pfad + 'Messung.P2', parseFloat(p2));
                
            } else {
                log("StatusCode = "+response.statusCode);
                log(error,'error');                               // Error beim Einlesen
            }
        });
        log('Luftdaten aktualisiert');
    } catch (e) {
        log('Fehler (try) Luftdaten.info: ' + e, 'error');
    }
}

// regelmässige Wiederholungen
schedule(cronStr, readData);

// einmaliger Start bei Skriptstart
createStates();
setTimeout(readData, 1500);

// Start beim Setzen auf true
on(instanz + pfad + 'forceRefresh', function (obj) {
    if (!obj.state.ack && obj.state.val) readData();
});
