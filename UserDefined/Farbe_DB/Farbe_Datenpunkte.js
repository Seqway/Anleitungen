createState('datenpunkt.0.Temp_Aussen.Farbe_Temp_Aussen'), {name: 'Farbe Datenpunkt für VIS'};

var idWert = "hm-rpc.1.KEQ0054069.1.TEMPERATURE";

on({id: idWert}, function (data) {
    var farbe;
    if (data.state.val <= 4) farbe = 'blue';
    if ((data.state.val > 5) && (data.state.val <19)) farbe = 'green';
    if ((data.state.val >= 19) && (data.state.val <28)) farbe = 'orange';
    if (data.state.val >= 29) farbe = 'red';
    setState('datenpunkt.0.Temp_Aussen.Farbe_Temp_Aussen', farbe);
});