
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

    $.each(j3m.intent,function(id, item){
          $("#intent_content").append("<div><b>" + id + ":</b> " + item + "</div>");
      });

    $.each(j3m.data.exif,function(id, item){
          $("#camera_content").append("<div><b>" + id + ":</b> " + item + "</div>");
      });

    $.each(j3m.genealogy,function(id, item){
          $("#gene_content").append("<div><b>" + id + ":</b> " + item + "</div>");
      });

    if (j3m.data.userAppendedData)
    {
      $.each(j3m.data.userAppendedData,function(id, item){


          $.each(item,function(id, item){

            if(typeof item =='object')
            {
                 $.each(item,function(id, item){
                     $("#user_content").append("<div><b>" + id + ":</b> " + item + "</div>");
         
                 });
            }
            else
              $("#user_content").append("<div>" + id + ": " + item + "</div>");

          });

        });
    }


   var timestamp = 0;


    $.each(j3m.data.sensorCapture,function(id, item){

      $.each(item,function(id, item){


          if(typeof item =='object')
          {

               $.each(item,function(id, item){

                      if (!sensorData[id])
                      {
                          sensorData[id] = new Array();
                      }

                      var sensorEvent = new SensorEvent(id, item, timestamp);


                      sensorData[id][sensorData[id].length] = sensorEvent;
       
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

      addChart("acc_x","",sensorData["acc_x"]);
      addChart("acc_y","",sensorData["acc_y"]);
      addChart("acc_z","",sensorData["acc_z"]);
  });


}

function addChart (name, chartType, arraySensorData)
{



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
