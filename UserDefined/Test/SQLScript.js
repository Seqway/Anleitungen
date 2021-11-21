var anz = 0;
var total = 0;
var data = "";
var states = $('*').each(function(id, i) {
 
    if (getObject(id)) {
        anz = anz + 1;
        try {
            var devname = getObject(id).common.name;
            var logenabled = getObject(id).common.custom["sql.0"].enabled;
            //count total states with sql logging enabled
            total = total + 1;
            //onlz write states to file with sql logging enabled
            if (logenabled === true) {
                log('extract : ' + devname);
                var channel = getObject(id).common.name.split(":");
                var dp = getObject(id, "rooms");
                var raum = dp.enumNames;
                if (raum.length > 0) {
                    //    log(anz+"->"+id+":::::"+devname+"----"+channel[0]+">"+raum+"<");
                } else {
                    //    log(anz+"->"+id+":::::"+devname+"----"+channel[0]+">"+"----------"+"<");
                    raum = "-";
                }
                data = data + '"' + id + '","' + channel[0] + '","' + devname + '","' + raum + '"' + String.fromCharCode(10);
 
            }
 
        } catch (err) {}
    }
});
 
//log(data);
var fs = require('fs');
fs.writeFile('/tmp/namen.csv', data, 'binary', function(error) {
    console.log(' object scanned : ' + anz);
    console.log(' SQL enabled objects written to file : ' + total);
});