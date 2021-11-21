// -----------------------------------------------------------------------------
// ----- Abfragen von Werten aus der Datenbank (SQL) ---------------------------
// -----------------------------------------------------------------------------

// ----- Datenpunkt der ausgelesen werden soll ---------------------------------
var id = "hm-rpc.1.KEQ0054069.1.TEMPERATURE";
// ----- Datenpunkte in die gespeichert werden soll ----------------------------
var maxid = 'javascript.0.Datenpunkte.Temp_Aussen.Statistik_Luft_Aussen_Max7days';
var minid = 'javascript.0.Datenpunkte.Temp_Aussen.Statistik_Luft_Aussen_Min7days';
var dt = 168;                // Zeitraum in Stunden
    dt = dt*3600*1000;      // Zeitraum umrechnen in ??

// ----- Datenpunkte anlegen ---------------------------------------------------
createState(maxid, " ");
createState(minid, " ");
//log('1. ) Datenpunkte angelegt ');

SQLAbfrage(id);

//-----  SQL-Abfrage durchführen
function SQLAbfrage () {
//    log('2. ) Datenpunkt => ' + id);
//    log('2a.) Abfrage    => SELECT * FROM datapoints WHERE name = \'' + id + '\'');
    sendTo('sql.0', 'query', 'SELECT * FROM iobroker.datapoints WHERE name = \'' + id + '\'', GetResults);
}
//---------------------------------------

function GetResults (dpoint) {
//    log('3. ) Funktion -> GetResults aufrufen');
    var end_time =   new Date().getTime();
    var start_time = new Date().getTime() - dt;
//    log('3a.) Startzeit : ' + start_time);
//    log('3b.) Endzeit   : ' + end_time);
//    log('     Datenpunkt: ' + dpoint.result);
//    log('3c.) result    : ' + JSON.stringify(dpoint.result) + ' -//- ' + start_time);
//    log('     Datenpunkt: ' + dpoint.result[0].id + ' ---//--- ' + dpoint.result[0].name);
    sendTo('sql.0', 'query', 'SELECT Round(Min(val),1) As MinVal FROM iobroker.ts_number WHERE ts >= ' + start_time + ' AND id=' + dpoint.result[0].id + ' GROUP BY id',minimum);
    sendTo('sql.0', 'query', 'SELECT Round(Max(val),1) As MaxVal FROM iobroker.ts_number WHERE ts >= ' + start_time + ' AND id=' + dpoint.result[0].id + ' GROUP BY id',maximum);
}

//-----  Werte schreiben (maximum, minimum)
//-----  minimum
function minimum(result) {
//  log('min )Funktion -> ' + JSON.stringify(result.result));
  setState(minid, result.result[0].MinVal);
}
//-----  maximum
function maximum(result) {
//    log('max )Funktion -> ' + JSON.stringify(result.result));
    setState(maxid, result.result[0].MaxVal);
//    log('---- fertig -----------------------------------------');
    
}
//---------------------------------------

// ----- Funktion jede Minute aufrufen
schedule("*/5 * * * *", function(){SQLAbfrage(id);});