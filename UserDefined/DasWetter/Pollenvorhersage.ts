// ########################################################################################################
// Polleninfo auswerten heute und die n‰chsten Tage
// Version 1.51
// ########################################################################################################
//// <reference path="..\..\..\javascript.d.ts" />
// @ts-check
"use strict";
///< script> var exports = {}; < / script>

/**************************************************************************************************
* Initiale Optionen
**************************************************************************************************/
//Welcher Ort soll abgefragt werden?
var baseUrl: string = "https://www.wetteronline.de/pollen/schwerte";

//Wo sollen die Daten unter javascript.0... abgelegt werden?
var baseObjPath: string = 'Datenpunkte.DasWetter.pollenvorhersage';

/**************************************************************************************************
* Globale TypeScript Definitionen
**************************************************************************************************/
interface iRequestOptions {
		url: string;
		headers: any;
}

/**
 * Function for check if a object is a primitive object (string, number, etc)
 * @param    obj           any object to check if it is a primitive object
 * @returns              boolean which is true if object in parameter is a primitive object
 */
function isPrimitive(obj:any):boolean {
    return (obj !== Object(obj));
}


/**
 * write any objects given as parameter to log as debug
 * @param    param       a nist of different objects
 */
function logDebug(...param: any[]):void {
	if (arguments.length > 0) {
		var text:string[] = [];
		for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string' || arguments[i] instanceof String) {
                text.push(arguments[i]);
		    } else if(arguments[i] === null) {
                text.push('null');
		    } else if(arguments[i] === undefined) {
                text.push('undefined');
            } else if (isPrimitive(arguments[i])) {
                text.push(arguments[i]);
            } else {
                text.push(JSON.stringify(arguments[i]));
            }
            //enum close bracket cannot be found in "channel[state.id=*.TEMPERATURE](rooms=WZ|Wohnung|Wohnzimmer"
			
		}
		log(text.join(' '), 'debug');
	}
}

/**
 * write any objects given as parameter to log as Information
 * @param    param       a nist of different objects
 */
function logInfo(...param: any[]):void {
	if (arguments.length > 0) {
		var text:string[] = [];
		for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string' || arguments[i] instanceof String) {
                text.push(arguments[i]);
		    } else if(arguments[i] === null) {
                text.push('null');
		    } else if(arguments[i] === undefined) {
                text.push('undefined');
            } else if (isPrimitive(arguments[i])) {
                text.push(arguments[i]);
            } else {
                text.push(JSON.stringify(arguments[i]));
            }
            //enum close bracket cannot be found in "channel[state.id=*.TEMPERATURE](rooms=WZ|Wohnung|Wohnzimmer"
			
		}
		log(text.join(' '), 'info');
		setState("javascript.0.Ereignisliste.event",'INFO|'+text.join(' '));
	}
    //logEnhanced(logtext, 'info');
	//console.debug(p);
	//logs(logtext,loglevels.debug);
}

/**
 * write any objects given as parameter to log as warning
 * @param    param       a nist of different objects
 */
function logWarning(...param: any[]):void {
	if (arguments.length > 0) {
		var text:string[] = [];
		for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string' || arguments[i] instanceof String) {
                text.push(arguments[i]);
		    } else if(arguments[i] === null) {
                text.push('null');
		    } else if(arguments[i] === undefined) {
                text.push('undefined');
            } else if (isPrimitive(arguments[i])) {
                text.push(arguments[i]);
            } else {
                text.push(JSON.stringify(arguments[i]));
            }
            //enum close bracket cannot be found in "channel[state.id=*.TEMPERATURE](rooms=WZ|Wohnung|Wohnzimmer"
			
		}
		log(text.join(' '), 'warn');
		setState("javascript.0.Ereignisliste.event",'WARN|'+text.join(' '));
	}
    //logEnhanced(logtext, 'warn');
	//console.warn(p);
	//logs(logtext,loglevels.warn);
}

/**
 * write any objects given as parameter to log as error
 * @param    param       a nist of different objects
 */
function logError(...param: any[]):void {
	if (arguments.length > 0) {
		var text:string[] = [];
		for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string' || arguments[i] instanceof String) {
                text.push(arguments[i]);
		    } else if(arguments[i] === null) {
                text.push('null');
		    } else if(arguments[i] === undefined) {
                text.push('undefined');
            } else if (isPrimitive(arguments[i])) {
                text.push(arguments[i]);
            } else {
                text.push(JSON.stringify(arguments[i]));
            }
            //enum close bracket cannot be found in "channel[state.id=*.TEMPERATURE](rooms=WZ|Wohnung|Wohnzimmer"
			
		}
		log(text.join(' '), 'error');
		setState("javascript.0.Ereignisliste.event",'ERROR|'+text.join(' '));
	}
}
// ########################################################################################################
// Lokale TypeScript Definitionen
// ########################################################################################################
import request = require("request");

var Pollenarten:string[] = ['Erle','Hasel','Pappel','Weide','Ulme','Birke','Buche','Ampfer','Roggen','Graeser','Eiche','Wegerich','Beifuss','Ambrosia'];
var tageVorhersage = ['d0','d1','d2','d3','d4','d5','d6'];
var tageVorhersageName = ['heute','morgen','uebermorgen','heute + 3','heute + 4','heute + 5','heute + 6'];

function stripTags(data:string):string {
    return data.replace(/(&nbsp;|<([^>]+)>)/ig, "");
}

function getDate(days: number): string { // Eingabe 0, 1, 2, ...
    var jetzt = new Date();
    jetzt.setHours(0);
    jetzt.setMinutes(0);
    jetzt.setSeconds(0);
    jetzt.setMilliseconds(0);
    var newdate = new Date();
    newdate.setTime(jetzt.getTime() + (24 * 60 * 60 * 1000 * days) ); // heute + anzahl tage ins Millisekunden
    var date :string = newdate.getDate().toString();
    var month: string = (newdate.getMonth()+1).toString();
    var year: string = newdate.getFullYear().toString();
    date = (date.length < 2) ? '0' + date : date;
    month = (month.length < 2) ? '0' + month : month;
    var result:string = year+month+date;
    logDebug('Datum in Link: ', result);
    return (result); // Ausgabe z.B. 20160506
}

function GetPollenIndex(pflanze:string, html:string):number {
    var code ={'kein':0, 'schwach':1, 'm‰ﬂig':2, 'stark':3}; 
    var result:string= "";
    var start:number =html.indexOf(pflanze)+pflanze.length;
    
    result=html.slice(start);
    result=result.trim();
	//logDebug('result for ',pflanze,html.slice(0,600));
    var stop:number =result.indexOf(' ');
    result=result.slice(0,stop);
    logDebug('pflanze=',pflanze,'code=',result);
    return code[result];
}

function initializePollenwetter(baseObj:string, name:string):void {
	createState(baseObj,0,false, {
		name: name,
		type: "string",
		role: 'json',
		read: true,
		write: false});

    for(let i=0;i<Pollenarten.length;i++) {
		createState(baseObj + '.' + Pollenarten[i].toLowerCase(),0,false, {
			name: 'Pollenart '+ Pollenarten[i],
			type: "number",
			role: 'value',
			read: true,
			write: false});
    }
    
    for(let i=0;i<4;i++) {
        createState(baseObj+'.text.'+i.toString(),0,false, {
    		name: name,
    		type: "string",
    		role: 'text',
    		read: true,
    		write: false});
        createState(baseObj+'.html.'+i.toString(),0,false, {
    		name: name,
    		type: "string",
    		role: 'html',
    		read: true,
    		write: false});
        createState(baseObj+'.count.'+i.toString(),0,false, {
    		name: name,
    		type: "number",
    		role: 'value',
    		read: true,
    		write: false});
    }
}

function removeOldPollenwetter():void {
    for(var i=0;i<Pollenarten.length;i++) {
		deleteState(baseObjPath + '.' + Pollenarten[i].toLowerCase());
    }
}

function readPollenwetterForDay(day:number, baseObj:string):void {
    try {
		var options:iRequestOptions = {
			url: ((day>0) ? baseUrl + '?fcdatstr=' + getDate(day) : baseUrl), // korrekten Link erstellen ,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
			}
		};
        request(options, function (error, response, body):void {
            if (!error && response.statusCode == 200) {              // kein Fehler, Inhalt in body
				body=body.replace(/\t/g, ' ');
				body=body.replace(/(\n|\r)/g, '');
				var start:number =body.indexOf('<ul id="pollentable">');
				if (start>-1) { body=body.slice(start); }
                body=stripTags(body);
				//logDebug('body',body);
				let pobj:any = {};
				let pot = ['','','',''];
				let poh = ['','','',''];
				let poc = [0,0,0,0];
                for(let i=0;i<Pollenarten.length;i++) {
					let pi:number = GetPollenIndex(Pollenarten[i],body);
					pobj[Pollenarten[i].toLowerCase()] = pi;
				    poc[pi]++;
				    pot[pi] = pot[pi] + Pollenarten[i] + '\r\n';
				    poh[pi] = poh[pi] + Pollenarten[i] + '<br/>';
                    setState(baseObj+'.'+Pollenarten[i].toLowerCase(),pi);
                }
                for(let i=0;i<4;i++) {
                    setState(baseObj+'.text.'+i.toString(),pot[i]);
                    setState(baseObj+'.html.'+i.toString(),poh[i]);
                    setState(baseObj+'.count.'+i.toString(),poc[i]);
                }
				setState(baseObj,JSON.stringify(pobj));
            } else {
                logInfo("StatusCode="+response.statusCode);
                logError(error);                               // Error beim Einlesen
            }
        });
    } catch (e) {
        logError('Fehler (try) leseWebseite: ' + e);
    }
}

function readPollenwetter() {
    for (let d:number = 0; d < tageVorhersage.length; d++) {
		let path: string = baseObjPath + '.' + tageVorhersage[d];
        initializePollenwetter(path, tageVorhersageName[d]);
		readPollenwetterForDay(d, path);
    }
}

//removeOldPollenwetter();
readPollenwetter();
schedule("8 0 * * *", readPollenwetter);