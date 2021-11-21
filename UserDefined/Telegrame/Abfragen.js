on({id: 'telegram.0.communicate.request', change: 'any'}, function (obj) {
    var stateval = getState('telegram.0.communicate.request').val;              // Statevalue in Variable schreiben
    var benutzer = stateval.substring(1,stateval.indexOf("]"));                 // Benutzer aus Statevalue extrahieren
    var befehl = stateval.substring(stateval.indexOf("]")+1,stateval.length);   // Befehl/Text aus Statevalue extrahieren

     if (befehl.search(/(?=.*(\bTEMPERATUR\b|\bWARM\b|\bKALT\b)).+/ig) != -1) {
        sendTo('telegram', {
            user: benutzer,
            text: 'Für welchen Raum möchtest du die Temperatur abfragen?',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'alle Räume', callback_data: '%Tempalle'}],
                    [{ text: 'Flur', callback_data: '%TempFlur'}],
                    [{ text: 'Wohnzimmer', callback_data: '%TempWohnzimmer'}],
                    [{ text: 'Badezimmer', callback_data: '%TempBadezimmer'}], 
                    [{ text: 'Gästezimmer', callback_data: '%TempGaestezimmer'}],
                    [{ text: 'Schlafzimmer', callback_data: '%TempSchlafzimmer'}],
                ]
             }
        });
    }    
    
// Auswahl alle Räume oder einzeln.
    else if (befehl === "%Tempalle") {
            sendTo('telegram', {
            user: benutzer,
            text: "Temperatur alle Räume angefragt",
            answerCallbackQuery: {
            text: 'Teich ' + getState("hm-rpc.1.LEQ0244790.2.TEMPERATURE").val + '°C\nAussen ' + getState("hm-rpc.1.KEQ0054069.1.TEMPERATURE").val + '°C\nGarage ' + getState("hm-rpc.1.KEQ0054038.1.TEMPERATURE").val + '°C\nWasser_Teich ' + getState("hm-rpc.1.LEQ0101090.1.STATE").val + '\nWasser_Teich ' + getState("hm-rpc.1.NEQ1764987.1.STATE").val,
            showAlert: true
            }
        });
    } 
    else if (befehl === "%TempFlur") {
            sendTo('telegram', {
            user: benutzer,
            text: "Flurtemperatur angefragt",
            answerCallbackQuery: {
            text: 'Die Temperatur im im Flur beträgt ' + getState("hm-rpc.0..1.ACTUAL_TEMPERATURE").val + '°C',
            showAlert: true
            }
        });
    } 
    else if (befehl === "%TempSchlafzimmer") {
            sendTo('telegram', {
            user: benutzer,
            text: "Schlafzimmertemperatur angefragt",
            answerCallbackQuery: {
            text: 'Die Temperatur im Schlafzimmer beträgt ' + getState("hm-rpc.0..1.ACTUAL_TEMPERATURE").val + '°C',
            showAlert: true
            }
        });
    }
    else if (befehl === "%TempGaestezimmer") {
            sendTo('telegram', {
            user: benutzer,
            text: "Gästezimmertemperatur angefragt",
            answerCallbackQuery: {
            text: 'Die Temperatur im Gästezimmer beträgt ' + getState("hm-rpc.0..1.ACTUAL_TEMPERATURE").val + '°C',
            showAlert: true
            }
        });
    }
    else if (befehl === "%TempWohnzimmer") {
            sendTo('telegram', {
            user: benutzer,
            text: "Wohnzimmertemperatur angefragt",
            answerCallbackQuery: {
            text: 'Die Temperatur im Wohnzimmer beträgt ' + getState("hm-rpc.0..1.ACTUAL_TEMPERATURE").val + '°C',
            showAlert: true
            }
        });
    }
    else if (befehl === "%TempBadezimmer") {
            sendTo('telegram', {
            user: benutzer,
            text: "Badezimmertemperatur angefragt",
            answerCallbackQuery: {
            text: 'Die Temperatur im Badezimmer beträgt ' + getState("hm-rpc.0..1.ACTUAL_TEMPERATURE").val + '°C',
            showAlert: true
            }
        });
    }
});