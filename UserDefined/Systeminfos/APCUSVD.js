
// Liest den Status einer APC USV aus durch Abfragen des apcupsd CGI-Skripts 
// Weiterführende Infos zu apcupds: http://www.apcupsd.com
// Author : frost - 19.06.2016


// hier IP Adresse und ggfalls URL des apcupds Server anpassen
var upsIP = "192.168.40.8:88";
var upsURL =  "http://" + upsIP + "/cgi-bin/apcupsd/upsfstats.cgi";

//-----------------------------------------------------------------

var request = require('request');

var ups_apcupsd_ver = "0.0.0";
var ups_Model = "apc";
var ups_Status = "unknown";
var ups_LineVoltage = 0;
var ups_LoadPercent = 0;
var ups_BatteryCharge = 0;
var ups_TimeLeft = 0;
var ups_Temperature = 0;
var ups_BatteryVoltage = 0;
var ups_LastSupplyFault = "never";
var ups_TimeOnBattery = 0;
var ups_SerialNo = "12345";


// Datenpunkte erstellen mit Default-Werten
createState('USV.APC.IP',upsIP);
createState('USV.APC.apcupsd_ver',ups_apcupsd_ver);
createState('USV.APC.Model',ups_Model);
createState('USV.APC.Status',ups_Status);
createState('USV.APC.LineVoltage',ups_LineVoltage);
createState('USV.APC.CurrentLoad',ups_LoadPercent);
createState('USV.APC.BatteryCharge',ups_BatteryCharge);
createState('USV.APC.TimeLeft',ups_TimeLeft);
createState('USV.APC.Temperature',ups_Temperature);
createState('USV.APC.BatteryVoltage',ups_BatteryVoltage);
createState('USV.APC.LastSupplyFault',ups_LastSupplyFault);
createState('USV.APC.TimeOnBattery',ups_TimeOnBattery);
createState('USV.APC.Serialnumber',ups_SerialNo);


schedule("*/1 * * * *", function ()  // alle x Minuten
{

	request(upsURL, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{
		    
		    // entferne nicht benötigte HTML Tags
		    var ups_data = body.substring (body.indexOf ("<body>"));
		    
			// Extrahiere Daten aus Antwort
			var data_lines = ups_data.split(/\r?\n/);
			var i = 0;
			while (i < data_lines.length)
			{
				var curr_line = data_lines[i].split(":", 1);
				curr_line[1] = data_lines[i].substring (data_lines[i].indexOf(":") + 2).trim();
				
				if (curr_line.length > 1)   // Sicherheitsabfrage
				{
    				if (curr_line[0].indexOf ("VERSION") >= 0)
    				{
    					ups_apcupsd_ver = curr_line[1].split(" ")[0];
    				}
    				else if (curr_line[0].indexOf ("MODEL") >= 0)
    				{
    					ups_Model = curr_line[1];
    				}
    				else if (curr_line[0].indexOf ("STATUS") >= 0)
    				{
    					if (curr_line[1].search("ONLINE") >= 0)
    					{
    					    ups_Status = 1;
    					}
    					else
    					{
    					    ups_Status = 0; // something is wrong with the power line
    					}
    					
    					// Aktivieren, falls "ONLINE" und "ONBATT" angezeigt werden soll
    					// ups_Model = curr_line[1];
    				}
    				else if (curr_line[0].indexOf ("LINEV") >= 0)
    				{
    					ups_LineVoltage = curr_line[1].split(" ")[0] + " V";
    				}
    				else if (curr_line[0].indexOf ("LOADPCT") >= 0)
    				{
    					ups_LoadPercent = curr_line[1].split(" ")[0] + " %";
    				}
    				else if (curr_line[0].indexOf ("BCHARGE") >= 0)
    				{
    					ups_BatteryCharge = curr_line[1].split(" ")[0] + " %";
    				}
    				else if (curr_line[0].indexOf ("TIMELEFT") >= 0)
    				{
    					ups_TimeLeft = curr_line[1].split(" ")[0] + " min";
    				}
    				else if (curr_line[0].indexOf ("ITEMP") >= 0)
    				{
    					ups_Temperature = curr_line[1].split(" ")[0] + " °C";
    				}
    				else if (curr_line[0].indexOf ("BATTV") >= 0)
    				{
    					ups_BatteryVoltage = curr_line[1].split(" ")[0] + " V";
    				}
    				else if (curr_line[0].indexOf ("XONBATT") >= 0)
    				{
    					ups_LastSupplyFault = curr_line[1];
    				}
    				else if (curr_line[0].indexOf ("TONBATT") >= 0)
    				{
    					ups_TimeOnBattery = curr_line[1].split(" ")[0] + " s";
    				}
    				else if (curr_line[0].indexOf ("SERIALNO") >= 0)
    				{
    					ups_SerialNo = curr_line[1];
    				}
				}
				
				i++;
			}

			// Schreibe Daten in Datenpunkte
			setState('USV.APC.IP',upsIP);
			setState('USV.APC.apcupsd_ver',ups_apcupsd_ver);
			setState('USV.APC.Model',ups_Model);
			setState('USV.APC.Status',ups_Status);
			setState('USV.APC.LineVoltage',ups_LineVoltage);
			setState('USV.APC.CurrentLoad',ups_LoadPercent);
			setState('USV.APC.BatteryCharge',ups_BatteryCharge);
			setState('USV.APC.TimeLeft',ups_TimeLeft);
			setState('USV.APC.Temperature',ups_Temperature);
			setState('USV.APC.BatteryVoltage',ups_BatteryVoltage);
			setState('USV.APC.LastSupplyFault',ups_LastSupplyFault);
			setState('USV.APC.TimeOnBattery',ups_TimeOnBattery);
			setState('USV.APC.Serialnumber',ups_SerialNo);
			
		} 
		else 
		{
			log(error);
			log('APCUPSD not found', 'warn');
		}

	}); // end of request

}); // end of schedule
