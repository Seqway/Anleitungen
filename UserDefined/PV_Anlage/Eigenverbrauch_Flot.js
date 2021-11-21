const idVerbrauch = "modbus.0.inputRegisters.3518_PV_Verbrauch";
const idLeistung = "modbus.0.inputRegisters.3502_PV_Erzeugung";
const idEigenverbrauch = "javascript.0.Datenpunkte.PV_Anlage.Eigenverbrauch_Flot";

createState(idEigenverbrauch, 0, {
    name: "Eigenverbrauch",
    unit: "W",
    type: "number",
    read: true,
    write: false,
});

let verbrauch = 0;
let leistung = 0;

function eigenverbrauchBerechnen() {
    setState(idEigenverbrauch, Math.min(verbrauch, leistung));
}

// Bei Änderungen aktualisieren
on(idVerbrauch, obj => {
    verbrauch = obj.state.val;
    eigenverbrauchBerechnen();
});
on(idLeistung, obj => {
    leistung = obj.state.val;
    eigenverbrauchBerechnen();
});

// einmalig zu Beginn aktualisieren
verbrauch = getState(idVerbrauch).val;
leistung = getState(idLeistung).val;
eigenverbrauchBerechnen();
