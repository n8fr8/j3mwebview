
var cloudmadeApiKey = '23c00ae936704081ab019253c36a55b3';
var map;

var sensorData=new Array(); 



function loadMap (lat,lon) {
  // body...
    map = L.map('map').setView([lat,lon], 6);
L.tileLayer('http://{s}.tile.cloudmade.com/' + cloudmadeApiKey + '/110483/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }).addTo(map);


  var marker = L.marker([lat,lon]).addTo(map);


}

function addMapPoint (lat,lon)
{
  if (!map)
    loadMap(lat, lon)
  else
  {
    var marker = L.marker([lat,lon]).addTo(map);
  }
}

function setMapCoords ()
{
  /**
  n = 2 ^ zoom
xtile = ((lon_deg + 180) / 360) * n
ytile = (1 - (ln(tan(lat_rad) + sec(lat_rad)) / Pi)) / 2 * n
*/
}

function parseJ3M (path)
{

  $.getJSON(path, function(j3m) {
    
      $('#content_title').text(j3m.genealogy.hashes[0])

      if (j3m.data.exif.location)
      {

        loadMap(j3m.data.exif.location[0],j3m.data.exif.location[1]);
      }

      //$('#creator_fingerprint').text(jemtest.intent.pgpKeyFingerprint);
    
   //  $('#destination').text(jemtest.intent.intendedDestination);
      //$('#timestamp').text(jemtest.data.exif.timestamp);

      addList("Intent",j3m.intent);

    addList("Camera",j3m.data.exif);


    addList("Genealogy",j3m.genealogy);


    if (j3m.data.userAppendedData)
    {
          addList("User Data",j3m.data.userAppendedData);

    }


   var timestamp = 0;


    $.each(j3m.data.sensorCapture,function(id, item){

      $.each(item,function(id, item){


          if(typeof item =='object')
          {

               $.each(item,function(id, item){

                     if(typeof item =='object')
                      {
                           $.each(item,function(id2, item2){

                              if (item2.bssid)
                              {
                                 if (!sensorData['ssid'])
                                  {
                                      sensorData['ssid'] = new Array();
                                  }

                                  var sensorEvent = new SensorEvent('ssid', item2.ssid + " (" + item2.bssid + ")", timestamp);

                                  sensorData['ssid'][sensorData['ssid'].length] = sensorEvent;    
                            }
                            else
                            {
                               if (!sensorData[id])
                                {
                                    sensorData[id] = new Array();
                                }

                                var sensorEvent = new SensorEvent(id, item, timestamp);


                                sensorData[id][sensorData[id].length] = sensorEvent;
                            }

                          });
                      }
                      else
                      {
                        if (!sensorData[id])
                        {
                            sensorData[id] = new Array();
                        }

                        var sensorEvent = new SensorEvent(id, item, timestamp);


                        sensorData[id][sensorData[id].length] = sensorEvent;
                      }
       
               });



          }
          else
          {
            //$("#sensor_content").append("<div>" + id + ": " + item + "</div>");

              if (id == "timestamp")
              {
                timestamp = item;
              }
          }

      });


    });


   addChart("lightMeterValue","",sensorData["lightMeterValue"]);
    addChart("roll","",sensorData["roll"]);
     addChart("pitch","",sensorData["pitch"]);
      addChart("azimuth","",sensorData["azimuth"]);

      addMultiChart("Accelerometer","",sensorData["acc_x"],sensorData["acc_y"],sensorData["acc_z"]);

    sensorData["bluetoothDeviceName"].sort(function(a,b){return a.timestamp-b.timestamp});
      addList("bluetoothDeviceName",sensorData["bluetoothDeviceName"]);

      addList("cellTowerId",sensorData["cellTowerId"]);

    sensorData["ssid"].sort(function(a,b){return a.timestamp-b.timestamp});

        addList("ssid",sensorData["ssid"]);

  });


}

function addList(name, arraySensorData)
{

  $("#main-row").append('<div class="row-fluid"><div class="span12" id="' + name  + 'List"><h3>' + name + '</h3></div></div>');



  $.each(arraySensorData,function(id, item){

              if(item instanceof Array)
              {
                  $.each(item,function(id2, item2){
                      $("#" + name + "List").append("<div>" + id + ": " + item2 + "</div>");
                
                  });
              }
              else if(typeof item =='object')
              {
                $("#" + name + "List").append("<div>" + id + ": " + item.value + " at " + formatTime(item.timestamp) + "</div>");
              }
              else
              {
                $("#" + name + "List").append("<div>" + id + ": " + item + "</div>");


              }
  });

}

function addChart (name, chartType, arraySensorData)
{


  arraySensorData.sort(function(a,b){return a.timestamp-b.timestamp});


  $("#main-row").append('<div class="row-fluid"><div class="span12"><h3>' + name + '</h3><p><canvas id="' + name + 'Chart" height="300" width="1200"></canvas></p></div></div>');

  //Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#" + name + "Chart").get(0).getContext("2d");
  //This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx);

  var labels = new Array(); 
  var datas = new Array ();

var isEven = false;
   $.each(arraySensorData,function(id, item){

          if (isEven)
               labels[labels.length] = formatTime(item.timestamp);
          else
            labels[labels.length] = "";

            datas[datas.length] = item.value;

            isEven = !isEven;
      });

  var data = {
    labels : labels,
    datasets : [
      
      {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,1)",
        pointColor : "rgba(151,187,205,1)",
        pointStrokeColor : "#fff",
        data : datas
      }
    ]
  }

  var newChat = new Chart(ctx).Line(data);

}

function addMultiChart (name, chartType, arraySensorData1,arraySensorData2,arraySensorData3)
{


  arraySensorData1.sort(function(a,b){return a.timestamp-b.timestamp});

  arraySensorData2.sort(function(a,b){return a.timestamp-b.timestamp});

  arraySensorData3.sort(function(a,b){return a.timestamp-b.timestamp});

  $("#main-row").append('<div class="row-fluid"><div class="span12"><h3>' + name + '</h3><p><canvas id="' + name + 'Chart" height="300" width="1200"></canvas></p></div></div>');

  //Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#" + name + "Chart").get(0).getContext("2d");
  //This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx);

  var labels = new Array(); 
  var datas1 = new Array ();
 
  var datas2 = new Array ();
 
  var datas3 = new Array ();

var isEven = false;
   $.each(arraySensorData1,function(id, item){

          if (isEven)
               labels[labels.length] = formatTime(item.timestamp);
          else
            labels[labels.length] = "";

            datas1[datas1.length] = item.value;

            isEven = !isEven;
      });

  $.each(arraySensorData2,function(id, item){


            datas2[datas2.length] = item.value;

      });

  $.each(arraySensorData3,function(id, item){

            datas3[datas3.length] = item.value;

      });



  var data = {
    labels : labels,
    datasets : [
      
      {
        fillColor : "rgba(151,187,205,0)",
        strokeColor : "rgba(151,0,0,1)",
        pointColor : "rgba(151,187,205,0)",

        pointStrokeColor : "rgba(151,187,205,0)",
        data : datas1
      },
      {
              fillColor : "rgba(205,187,205,0)",
      strokeColor : "rgba(0,151,0,1)",
      pointColor : "rgba(151,187,205,0)",

        pointStrokeColor : "rgba(151,187,205,0)",
        data : datas2
      },
      {
        fillColor : "rgba(151,205,187,0)",
        strokeColor : "rgba(0,0,151,1)",
        pointColor : "rgba(151,187,205,0)",

        pointStrokeColor : "rgba(151,187,205,0)",
        data : datas3
      }

    ]
  }

  var newChat = new Chart(ctx).Line(data);

}


function loadMedia (path)
{

  $("#img-main").attr("src",path);


  //  setupMediaMask(1200,900);


}

function setupMediaMask (imgWidth, imgHeight)
{

  $("#img-main").css({top: 0, left: 0});

var maskWidth  = $("#img-mask").width();
var maskHeight = $("#img-mask").height();
var imgPos     = $("#img-main").offset();

var x1 = (imgPos.left + maskWidth) - imgWidth;
var y1 = (imgPos.top + maskHeight) - imgHeight;
var x2 = imgPos.left;
var y2 = imgPos.top;

$("#img-main").draggable({ containment: [x1,y1,x2,y2] });
$("#img-main").css({cursor: 'move'});

}

function SensorEvent(type, value, timestamp){
    this.type = type;
    this.value = value;
    this.timestamp = timestamp;
}

var formatTime = function(unixTimestamp) {
    var dt = new Date(unixTimestamp * 1000);

    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var seconds = dt.getSeconds();

    // the above dt.get...() functions return a single digit
    // so I prepend the zero here when needed
    if (hours < 10) 
     hours = '0' + hours;
http://www.chartjs.org/docs/
    if (minutes < 10) 
     minutes = '0' + minutes;

    if (seconds < 10) 
     seconds = '0' + seconds;

    return hours + ":" + minutes + ":" + seconds;
}       
