//#############################################################################
//########### RainRadar by Dutchman 0.2 driven by Buienradar.nl ###############
//#############################################################################

var lat;
var long;

//Get coordinates from system settings
result = getObject("system.config"),
    lat = result.common.latitude    ,
    long = result.common.longitude;

    $("javascript." + instance + ".RainRadar.Current.*").each((id, i) => {
        deleteState(id);
    });
    $("javascript." + instance + ".RainRadar.Forecast_3h.*").each((id, i) => {
        deleteState(id);
    });

createState('RainRadar.Current.City_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=1&voor=0", {name: "120x220px"});
createState('RainRadar.Current.City_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=2&voor=0", {name: "256x256px"});
createState('RainRadar.Current.City_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=2b&voor=0", {name: "330x330px"});
createState('RainRadar.Current.City_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=3&voor=0", {name: "550x512px"});
createState('RainRadar.Current.Region_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=1&voor=0", {name: "120x220px"});
createState('RainRadar.Current.Region_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=2&voor=0", {name: "256x256px"});
createState('RainRadar.Current.Region_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=2b&voor=0", {name: "330x330px"});
createState('RainRadar.Current.Region_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=3&voor=0", {name: "550x512px"});
createState('RainRadar.Current.Province_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=1&voor=0", {name: "120x220px"});
createState('RainRadar.Current.Province_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=2&voor=0", {name: "256x256px"});
createState('RainRadar.Current.Province_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=2b&voor=0", {name: "330x330px"});
createState('RainRadar.Current.Province_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=3&voor=0", {name: "550x512px"});
createState('RainRadar.Current.Country_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=1&voor=0", {name: "120x220px"});
createState('RainRadar.Current.Country_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=2&voor=0", {name: "256x256px"});
createState('RainRadar.Current.Country_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=2b&voor=0", {name: "330x330px"});
createState('RainRadar.Current.Country_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=3&voor=0", {name: "550x512px"});
createState('RainRadar.Forecast_3h.City_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=1&voor=1", {name: "120x220px"});
createState('RainRadar.Forecast_3h.City_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=2&voor=1", {name: "256x256px"});
createState('RainRadar.Forecast_3h.City_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=2b&voor=1", {name: "330x330px"});
createState('RainRadar.Forecast_3h.City_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=13&size=3&voor=1", {name: "550x512px"});
createState('RainRadar.Forecast_3h.Region_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=1&voor=1", {name: "120x220px"});
createState('RainRadar.Forecast_3h.Region_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=2&voor=1", {name: "256x256px"});
createState('RainRadar.Forecast_3h.Region_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=2b&voor=1", {name: "330x330px"});
createState('RainRadar.Forecast_3h.Region_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=11&size=3&voor=1", {name: "550x512px"});
createState('RainRadar.Forecast_3h.Province_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=1&voor=1", {name: "120x220px"});
createState('RainRadar.Forecast_3h.Province_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=2&voor=1", {name: "256x256px"});
createState('RainRadar.Forecast_3h.Province_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=2b&voor=1", {name: "330x330px"});
createState('RainRadar.Forecast_3h.Province_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=8&size=3&voor=1", {name: "550x512px"});
createState('RainRadar.Forecast_3h.Country_small', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=1&voor=1", {name: "120x220px"});
createState('RainRadar.Forecast_3h.Country_medium', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=2&voor=1", {name: "256x256px"});
createState('RainRadar.Forecast_3h.Country_tall', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=2b&voor=1", {name: "330x330px"});
createState('RainRadar.Forecast_3h.Country_huge', "https://gadgets.buienradar.nl/gadget/zoommap/?lat=" + lat + "&lng=" + long + "&overname=2&zoom=6&size=3&voor=1", {name: "550x512px"});
