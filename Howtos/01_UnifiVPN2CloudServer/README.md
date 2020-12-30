
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















### Known issues

- updating nearly daily
- first version is german explanation
- english version will follow

### Changelog

### 0.0.1
* (Seqway) initial alpha version in german
