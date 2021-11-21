# **How to configure Doorbird Adapter**

```json
// Manual under preparation :construction: :construction: :construction:
```
:snowman: :snowman:
# **Vorwort**
Hallo liebe Leute,

da meine Klingel den geist aufgegeben hat, suchte ich nach aktuellen "smarten" Lösungen und bin sehr schnell auf die Doorbird Klingel gestossen. Und dazu gibt es natürlich auch im Iobroker einen Adapter.

Wie nun die Doorbird Klingel mit dem Adapter zu verbinden ist sowie welche Einstellungen in der App zu tätigen sind, soll diese Anleitung nun beschreiben.

Viel Spaß beim Lesen und Konfigurieren.

# **Iobroker Konfiguration**
Die Beschreibung bezieht sich auf die Iobroker Doorbird Version v.0.1.5

Folgende Einstellungen sind zu tätigen in dem Adapter:

**Adapter IP:**

Hier kommt die IP-Adresse deines Iobrokers rein (ist evtl. standardmässig schon ausgefüllt)

**Adapter Port:**

Hier kommt der (Standard)Port hinein, auf dem mit der Doorbird kommuniziert wird. Dies ist per Standard die

<font color='green'>8100</font>

**Doorbird Device IP:**

Hier ist die IP Adresse der Doorbird einzutragen, wie Sie in deinem netzwerk integriert ist. Diese kann per WLan oder Lan angeschlossen sein und eine entsprechende IP Adresse in deinem eigenen Netzwerk bekommen.
Typischerweise, als beispiel, sieht dies so aus 

<font color='green'>192.168.x.y</font>

**Doorbird Device ID:**

Hier wird es etwas kniffelig, da nicht eindeutig zu erkennen ist, was genau mit der Device ID gemeint ist.
Daher hier noch einmal klar definiert gemäß der Beschreibung der Doorbird:

Hiermit sind die ersten 6 Stellen deines Usernamens gemeint, welches deiner Doorbird beigelegt ist. Dies sollten alles Buchstaben sein.

beispiel:
Username --> abcdef0123
Also nur dort folgendes eintragen:

<font color='green'>abcdef</font>

**Username:**

Hier kommt nun der komplette Username hinein, also:

<font color='green'>abcdef0123</font>

**Password:**

Hier kommt dein gewähltes Passwort hinein für die Doorbird.

## Known issues

(still) to do or to update

## Changelog

### 0.0.1
* (Seqway) official release based on doorbird adapter version v.0.1.5

## Support me
If you like my work, please consider a personal donation  
(this is an personal Donate link for me - Seqway aka Dirk)  
[![Donate](https://raw.githubusercontent.com/iobroker-community-adapters/ioBroker.sourceanalytix/master/admin/button.png)](http://paypal.me/Seqway)
