
var device = "upnp.0.JAM_RHYTHM_5404"; //Hier das upnp Gerät eintragen das gesteuert werden soll. 
 var control = 'javascript.0.scriptEnabled.UserDefined.Systeminfos.Server.Internetradio'; //Hier das Objekt eintragen wo die Steuerobjekte angelegt werden sollen
 var oldVol; 
 var outURL;
 var newVol;
 var debug = true;
  
 // Array mit mp3-Streams
 var sender = ["https://wdr-1live-live.icecastssl.wdr.de/wdr/1live/live/mp3/128/stream.mp3",
     "http://mp3.ffh.de/radioffh/hqlivestream.mp3",
     "http://swr-swr3-live.cast.addradio.de/swr/swr3/live/mp3/128/stream.mp3",
     "http://streams.bigfm.de/bigfm-deutschland-128-aac?usid=0-0-H-A-D-30",
     "https://antenneunna-ais-edge-3106-fra-eco-cdn.cast.addradio.de/antenneunna/live/mp3/high",
     "https://relay04.t4e.dj/main_high.mp3",
     "http://mp3.stream.tb-group.fm/tb.mp3",   
     "http://wdr-wdr2-ruhrgebiet.icecast.wdr.de/wdr/wdr2/ruhrgebiet/mp3/128/stream.mp3",
     "http://ndr-ndr2-niedersachsen.cast.addradio.de/ndr/ndr2/niedersachsen/mp3/128/stream.mp3",
     "http://mp3channels.webradio.rockantenne.de/heavy-metal",
     "http://streams.radiobob.de/bob-kuschelrock/mp3-192/mediaplayer",
     "http://mp3.radiorsg.c.nmdn.net/radiorsg/livestream.mp3",
     "http://ice912.echo.msk.ru:9120/stream",
     "http://mp3channels.webradio.antenne.de/80er-kulthits",
     "https://streams.regenbogen.de/rr-mannheim-128-mp3",
     "http://st03.dlf.de/dlf/03/128/mp3/stream.mp3",
     "http://tuner.m1.fm/charts.mp3",
     "http://server3.lokalradioserver.de:8000/stream2.mp3.m3u",
     "http://listen.to.techno4ever.net",
     "http://dsl.tb-stream.net:80",
     "http://mp3.ffh.de/ffhchannels/hq80er.mp3",
     "https://stream.rockland.de/rockland_ludwigshafen.mp3",
     "http://streamhq.top100station.com/top100station-high.mp3",
     "http://st01.dlf.de/dlf/01/128/mp3/stream.mp3"];
  
 // Array mit mp3-Sendern passend zu Streams
 var sname = ["1 Live", 
     "Hit Radio FFH", 
     "SWR 3", 
     "bigFM", 
     "Antenne Unna",
     "Techno4Ever",
     "TechnoBaseFM",
     "WDR2 Ruhrgebiet",
     "WDR2 Ruhrgebiet",
     "Rock Antenne - Heavy Metal",
     "Kuschelrock",
     "Radio RSG",
     "Echo of Moscow",
     "ANTENNE BAYERN - 80er Kulthits",
     "Radio Regenbogen",
     "Deutschlandfunk Nova",
     "Top Of The Charts",   
     "Hit Radio FFH - 80er", 
     "Rockland Radio - MH & LU", 
     "Top 100 - Station",
     "Deutschlandfunk"];
  
 //createState(name, initialValue, forceCreation, common, native, callback);
 createState(control + '.MediaControl.Play', false, {type: 'boolean', read: 'true', write: 'true', role: 'button.play'});
 createState(control + '.MediaControl.Pause', false, {type: 'boolean', read: 'true', write: 'true', role: 'button.pause'});
 createState(control + '.MediaControl.Stop', false, {type: 'boolean', read: 'true', write: 'true', role: 'button.stop'});
 createState(control + '.AudioControl.Vol_UP', false, {type: 'boolean', read: 'true', write: 'true', role: 'button.volume_up'});
 createState(control + '.AudioControl.Vol_Down', false, {type: 'boolean', read: 'true', write: 'true', role: 'button.volume_down'});
 createState(control + '.AudioControl.Mute', false, {type: 'boolean', read: 'true', write: 'true', role: 'button.mute'});
 createState(control + '.MediaControl.MediaURL', '', {type: 'string', read: 'true', write: 'true'});
 createState(control + '.Num2URL', '', {type: 'string', read: 'true', write: 'true'});
 createState(control + '.SenderName', '', {type: 'string', read: 'true', write: 'true'});
  
 on({id: control + '.Num2URL', change: "ne"}, function (obj) {
     var tmpnr = getState(control + '.Num2URL').val;
     setState(control + '.MediaControl.MediaURL', sender[tmpnr], true);
     setState(control + '.SenderName', sname[tmpnr], true);
 });
     
  
 on({id: control + '.MediaControl.Play', val: true
     }, function(obj){
  
         if(debug) log("PLAY gedrückt");
         //Wiedergabe starten
         setState(device + '.MediaRenderer.AVTransport.Play.InstanceID', 0);
         setState(device + '.MediaRenderer.AVTransport.Play.Speed', 1);
         setState(device + '.MediaRenderer.AVTransport.Play.request', 'true');
         setTimeout(function(){setState(obj.id, false);}, 150);
     });
     
 on({id: control + '.MediaControl.Pause', val: true
     }, function(obj){
         
         if(debug) log("PAUSE gedrückt");
         //Wiedergabe pausieren
         setState(device +  '.MediaRenderer.AVTransport.Pause.InstanceID', 0);
         setState(device + '.MediaRenderer.AVTransport.Pause.request', 'true');
         setTimeout(function(){setState(obj.id, false);}, 150);
     });
  
 on({id: control + '.MediaControl.Stop', val: true
     }, function(obj){
         
         if(debug) log("STOP gedrückt");
         //Wiedergabe stoppen
         setState(device +  '.MediaRenderer.AVTransport.Stop.InstanceID', 0);
         setState(device + '.MediaRenderer.AVTransport.Stop.request', 'true');
         setTimeout(function(){setState(obj.id, false);}, 150);
     });
     
 on({id: control + '.AudioControl.Vol_UP', val: true
     }, function(obj){
         oldVol = getState(device + '.MediaRenderer.RenderingControl.Volume').val;
         
         if(debug) log("old: " + oldVol);
         if(oldVol != "" && oldVol != null) {
             if(parseInt(oldVol) < 96) newVol = parseInt(oldVol) + 5; //der Wert um den die Lautstärke geändert wird, kann beliebig geändert werden
         }
         else
             newVol = 50;
         if(debug) log("new: " + newVol);
  
         //neue Lautstärke senden
         setState(device + '.MediaRenderer.RenderingControl.SetVolume.Channel', 'Master');
         setState(device + '.MediaRenderer.RenderingControl.SetVolume.DesiredVolume', newVol);
         setState(device +  '.MediaRenderer.RenderingControl.SetVolume.InstanceID', 0);
         setState(device + '.MediaRenderer.RenderingControl.SetVolume.request', 'true');
         setTimeout(function(){setState(obj.id, false);}, 150);
         setState(device + '.MediaRenderer.RenderingControl.Volume', newVol);
     });
     
 on({id: control + '.AudioControl.Vol_Down', val: true
     }, function(obj){
         oldVol = getState(device + '.MediaRenderer.RenderingControl.Volume').val;
         
         if(debug) log("old: " + oldVol);
         if(oldVol != "" && oldVol != null) {
             if(parseInt(oldVol) > 4) newVol = parseInt(oldVol) - 5; //der Wert um den die Lautstärke geändert wird, kann beliebig geändert werden
         }
         else
             newVol = 50;
         if(debug) log("new: " + newVol);
  
         //neue Lautstärke senden
         setState(device + '.MediaRenderer.RenderingControl.SetVolume.Channel', 'Master');
         setState(device + '.MediaRenderer.RenderingControl.SetVolume.DesiredVolume', newVol);
         setState(device +  '.MediaRenderer.RenderingControl.SetVolume.InstanceID', 0);
         setState(device + '.MediaRenderer.RenderingControl.SetVolume.request', 'true');
         setTimeout(function(){setState(obj.id, false);}, 150);
         setState(device + '.MediaRenderer.RenderingControl.Volume', newVol);
     });
     
 on({id: control + '.AudioControl.Mute', val: true
     }, function(){
         var oldMute = getState(device + '.MediaRenderer.RenderingControl.Mute').val;
  
         if(debug) log("MUTE gedrückt");        
         if(!oldMute){
             setState(device + '.MediaRenderer.RenderingControl.SetMute.InstanceID', 0);
             setState(device + '.MediaRenderer.RenderingControl.SetMute.Channel', 'Master');
             setState(device + '.MediaRenderer.RenderingControl.SetMute.DesiredMute', 1);
             setState(device + '.MediaRenderer.RenderingControl.SetMute.request', 'true');
             setState(device + '.MediaRenderer.RenderingControl.Mute', true);            
         }else{
             setState(device + '.MediaRenderer.RenderingControl.SetMute.InstanceID', 0);
             setState(device + '.MediaRenderer.RenderingControl.SetMute.Channel', 'Master');
             setState(device + '.MediaRenderer.RenderingControl.SetMute.DesiredMute', 0);
             setState(device + '.MediaRenderer.RenderingControl.SetMute.request', 'true');
             setState(device + '.MediaRenderer.RenderingControl.Mute', false);
         }
         //setTimeout(function(){setState(obj.id, false);}, 150);
     });
     
 on({id: control + '.MediaControl.MediaURL'
     }, function(obj){
     if(debug) log("NEUER SENDER gedrückt");
     setState(device + '.MediaRenderer.AVTransport.SetAVTransportURI.CurrentURI', obj.newState.val);
     setState(device + '.MediaRenderer.AVTransport.SetAVTransportURI.InstanceID', 0);
     setState(device + '.MediaRenderer.AVTransport.SetAVTransportURI.request', 'true');
     setTimeout(function () {setState('javascript.0.scriptEnabled.UserDefined.Systeminfos.Server.Internetradio.MediaControl.Play', true,true)}, 10000);
 });
  
