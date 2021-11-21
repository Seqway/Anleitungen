var link = 'http://192.168.40.31/config/xmlapi/rssilist.cgi';
var request = require('request');
var parseString = require('xml2js').parseString;

function ImportRSSI() 
{
    request(link, function (error, response, body) 
    {
        var xml, result;
    
        parseString(body, function (err, result) 
        {
            for (var i = 0; i < result.rssiList.rssi.length; i++) 
            {
                var Device = result.rssiList.rssi[i].$;

                var DeviceId = Device.device;
                var DeviceTx = Device.tx;
                var DeviceRx = Device.rx;
                
                createState('HMSignalStrength.'+DeviceId+'.tx', DeviceTx, true);
                createState('HMSignalStrength.'+DeviceId+'.rx', DeviceRx, true);
            }
        });
             
    });
}    

ImportRSSI();
"* */1 * * *";