var Virt_Schalter;


// Verhindern von gleichen Mitteilungen
Virt_Schalter = false;

on({id: 'hm-rpc.1.KEQ0173234.1.STATE', change: "ne"}, function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
  if (getState("hm-rpc.1.KEQ0173234.1.STATE").val === false && Virt_Schalter === false) {
    sendTo("telegram.0", "send", {
        text: 'Entwarnung: Taupunktsunterschreitung Wintergarten / Lüfter AUSgeschaltet',
        user: 'Schecki_Homematic'
    });
    console.debug("telegram['Schecki_Homematic']: " + 'Entwarnung: Taupunktsunterschreitung Wintergarten / Lüfter AUSgeschaltet');
    Virt_Schalter = true;
  } else if (getState("hm-rpc.1.KEQ0173234.1.STATE").val === true && Virt_Schalter === true) {
    sendTo("telegram.0", "send", {
        text: 'Warnung: Taupunktsunterschreitung Wintergarten / Lüfter EINgeschaltet',
        user: 'Schecki_Homematic'
    });
    console.debug("telegram['Schecki_Homematic']: " + 'Warnung: Taupunktsunterschreitung Wintergarten / Lüfter EINgeschaltet');
    Virt_Schalter = false;
  }
});
