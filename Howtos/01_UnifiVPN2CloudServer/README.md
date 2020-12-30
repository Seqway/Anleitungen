# **Create VPN connection to a Cloud server with a Unifi USG3 and double NAT (behind a router)**

```json
// And here the first Manual under preparation - updating nearly daily
```
:snowman: still under :construction: :snowman:
# **Vorwort**

Hallo Leute,

ich habe mich nach langer Zeit mal dazu entschlossen, wie es ist einen externen gemieteten Server in sein eigenes Netzwerk zu integrieren.
Bisher habe ich mich immer gesträubt, da vernünftige Server als dedicated root Server dann doch schon bei >30€ aufwärts liegen.

Allerdings habe ich mich nun für einen Cloud :cloud: Server entschieden um zumindest mal zu testen wie das ist und wie es geht. 

Die Entscheidung hat mir für mich persönlich die Firma Hetzner abgenommen, da ich mal eben einen Cloud Server für 2,89€ pro Monat mieten kann :exclamation: Well done und thank you :exclamation:

Also auf geht’s – interessant wird es allerdings erst dadurch, dass ich eine Unifi USG3 habe und diese sich des Doppel-NATs bedient und somit es noch etwas schwieriger ist ABER auf jeden Fall machbar.
Diese Konstellation werden denke ich viele möglicherweise haben, die die Box des ISP nur noch als Modem nutzen möchten (und evtl. als DECT Station) aber das Netzwerk aus welchen Gründen auch immer zB mit Unifi Geräten aufbauen möchte. In meinem Fall hier mit einer Unifi / UI / Ubiquity USG 3 als "Zentrale".
Da auch die Konfiguration des Hetzner Netzwerkes sowie der USG und des internen / externen Datenverkehrs nicht einfach mal trivial ist schreibe ich alles zusammen und somit ist dieses Manual entstanden.
Schon einmal vorher sorry für diese lange bebilderte Anleitung :joy:

# **Aufbau**
* Cloud Server mit IP-Adresse zzz.zz.z.z (hier beispielhaft 172iger Bereich)
* Unifi USG hinter Fritzbox (Exposed Host) und somit Doppel-NAT (ganz wichtig bei dieser Konfiguration, da Doppel-NAT für die USG nicht so einfach zu händeln ist) mit IP-Adresse xxx.xxx.xx.x (hier beispielhaft 192iger Bereich)
* Gesamter Datenverkehr geht nur über eine VPN Site to Site Verbindung
* Beide Netzwerke sollen untereinander erreichbar sein um zB einen iobroker auf dem Cloud-Server laufen zu lassen 
* sämtlicher Datenverkehr in der Could geht über ein zentrales Gateway und hat somit auch Zugang zum Internet. Bei mir ist es eine OPNsnese Firewall

# **1.	Vorbereitung des Cloud Servers**
Ich habe mich für die Hetzner Cloud entschieden und habe dort den einfachsten Server genommen, den es dort gibt. Dort soll einfach nur ein Firewall erstellt werden.
Dies habe ich Software-technisch mittels OPNsense gelöst – darauf bezieht sich auch meine Beschreibung. Alternativ kann man auch das Iso.Image für einen Mikrotik nehmen - kommt bei mir aber nicht zum Zuge.

Wie das Netzwerk und Subnetze und die Server anzulegen sind, [ist gut hier beschrieben.](https://blog.resch.cloud/2020/05/16/privates-netzwerk-in-der-hetzner-cloud/)

Deswegen gehe ich nicht weiter darauf ein, wie das Hetzner-Netzwerk aufzusetzen ist. 
ABER bitte nicht das Mikrotech Image einspielen sondern dafür die OPNsense.
Hat man den Rechner angemietet, so bitte die Funktion des ISO-Images nutzen. Zugangsdaten gibt es per E-Mail (Einmalpassowrt).

<details>
<summary>Click to expand</summary>

![](Pics/01_Bild.png)

</details>

Empfehlung Nr. 1 - wie oben beschrieben:
Da es sein kann, dass man sich mal beim konfigurieren vertut (so wie bei mir) ist es hilfreich einen zweiten Cloudserver aufzusetzen, so wie es auch in der Anleitung im Link steht und damit dann die OPNsense zu administrieren. Über das Web-Interface bei Hetzner kommt man IMMER an diesen Rechner dran !
Mich hat das für 4 Tage keine 50 Cent gekostet, da Hetzner Stundengenau abrechnet 

Empfehlung Nr.2 – erstmal Internetzugang sperren und alles über VPN machen!

Dazu erstmal auf dem OPNsense Server die LAN Netzwerkkarte abschalten! 
WAN Interface setzen.

Bitte auf die Konsole gehen:
02_Bild
Login Daten eingeben (Login plus Passwort)
Bitte dann Option 1 wählen und durch den GUIDE gehen und nur WAN setzen auf vtnet0. LAN bitte leer lassen. Wird später konfiguriert.














### Known issues

- updating nearly daily
- first version is german explanation
- english version will follow

### Changelog

### 0.0.1
* (Seqway) initial alpha version in german
