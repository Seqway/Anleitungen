// Original-Datenpunkt
const idOrigin = 'linux-control.0.VM_Influx.info.is_online'; 
// Optional: Status-Datenpunkt, wenn Kommando und Status getrennt.
// Bei Nicht-Verwendung Leerstring '' zuweisen
const idRead = '';
// Alias-Datenpunkt
const idAlias = 'linux-control.0.VM_Influx.info.is_online_InfluxDBneu';
var typeAlias, read, write, nameAlias, role, desc, min, max, unit, states, custom, raum, gewerk;

// Folgende kommentieren, wenn keine Änderung der Eigenschaft erforderlich
nameAlias = 'VM Influx';
desc = 'per Script erstellt';
typeAlias = 'number'; // oder 'number'
read = "val ? 1 : 0"; // Erkennung "Aus" --> false erfolgt automatisch  
// write = "val ? String(1) : String(0)";
// role = 'value';
// min = 0; // nur Zahlen
// max = 100; // nur Zahlen
// unit = '%'; // nur für Zahlen
// states = {0: 'true', 1: 'false'}; // Zahlen (Multistate) oder Logikwert (z.B. Aus/Ein)
// custom = []; // verhindert doppelte Ausführung von history, ...
// raum = 'EG_Flur'; // Groß-/Kleinschreibung in der ID beachten !
// gewerk = 'Licht'; // Groß-/Kleinschreibung in der ID beachten !

// Ab hier nichts ändern !!

function createAlias(idDst, idSrc, idRd) {

   if(existsState(idDst)) log(idDst + ' schon vorhanden !', 'warn');

   else {

      var obj = {};

      obj.type = 'state';

      obj.common = getObject(idSrc).common;

      obj.common.alias = {};

      if(idRd) {

          obj.common.alias.id = {};

          obj.common.alias.id.read = idRd;

          obj.common.alias.id.write = idSrc;

          obj.common.read = true;

      } else obj.common.alias.id = idSrc;

      if(typeAlias) obj.common.type = typeAlias;

      if(obj.common.read !== false && read) obj.common.alias.read = read;

      if(obj.common.write !== false && write) obj.common.alias.write = write;

      if(nameAlias) obj.common.name = nameAlias;

      if(role) obj.common.role = role;

      if(desc) obj.common.desc = desc;

      if(obj.common.type == 'number') {

         if(min !== undefined) obj.common.min = min;

         if(max !== undefined) obj.common.max = max;

         if(unit) obj.common.unit = unit;

      } else {

         if(obj.common.min !== undefined) delete obj.common.min;

         if(obj.common.max !== undefined) delete obj.common.max;

         if(obj.common.unit) delete obj.common.unit;

      }

      if(states) obj.common.states = states;

      if(custom && obj.common.custom) obj.common.custom = custom;

      obj.native = {};

      setObject(idDst, obj, function() {

         if(idRd) setState(idRd, getState(idRd).val, true);

         else setState(idSrc, getState(idSrc).val, true); 

      });

      if(raum && existsObject('enum.rooms.' + raum)) {

         let obj = getObject('enum.rooms.' + raum)

         obj.common.members.push(idDst);

         setObject('enum.rooms.' + raum, obj);

      }

      if(gewerk && existsObject('enum.functions.' + gewerk)) {

         let obj = getObject('enum.functions.' + gewerk)

         obj.common.members.push(idDst);

         setObject('enum.functions.' + gewerk, obj);

      }

   } 

}

 

createAlias('alias.0.' + idAlias, idOrigin, idRead);

 
