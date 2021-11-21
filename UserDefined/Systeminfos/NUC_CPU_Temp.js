var SSH = require('simple-ssh');
 
var ssh = new SSH({
    host: '192.168.40.6',
    port: 22,
    user: 'dirk',
    pass: 'Ute0975'
});

schedule("* * * * *", function () {
  exec('ssh dirk@192.168.40.6 cat /sys/devices/virtual/thermal/thermal_zone0/temp', function (error, result, stderr) {
      setState("javascript.0.Datenpunkte.NUC.nuc_temp"/*nuc_temp*/, (result / 1000));
          console.debug(result);
  });
}
);
