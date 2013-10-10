
$(function () {
  
    loadMedia("../sample/sample.jpg");

    parseJ3M("../sample/samplej3m.json");

});

function parseJ3M (path)
{

  $.getJSON(path, function(j3m) {
    
    $('#content_title').text(j3m.genealogy.hashes[0])

    //$('#creator_fingerprint').text(jemtest.intent.pgpKeyFingerprint);
  
 //  $('#destination').text(jemtest.intent.intendedDestination);
    //$('#timestamp').text(jemtest.data.exif.timestamp);

  $.each(j3m.intent,function(id, item){
        $("#intent_content").append("<div>" + id + ": " + item + "</div>");
    });

  $.each(j3m.data.exif,function(id, item){
        $("#camera_content").append("<div>" + id + ": " + item + "</div>");
    });

  $.each(j3m.genealogy,function(id, item){
        $("#gene_content").append("<div>" + id + ": " + item + "</div>");
    });


  $.each(j3m.data.userAppendedData,function(id, item){


      $.each(item,function(id, item){

        if(typeof item =='object')
        {
             $.each(item,function(id, item){
                 $("#user_content").append("<div>" + id + ": " + item + "</div>");
     
             });
        }
        else
          $("#user_content").append("<div>" + id + ": " + item + "</div>");

      });

    });


$.each(j3m.data.sensorCapture,function(id, item){

      $.each(item,function(id, item){


        if(typeof item =='object')
        {
             $.each(item,function(id, item){
                 $("#sensor_content").append("<div>" + id + ": " + item + "</div>");
     
             });
        }
        else
          $("#sensor_content").append("<div>" + id + ": " + item + "</div>");

      });

    });



  })

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