
$(function () {
  

  $("#img-main").css({top: 0, left: 0});

var maskWidth  = $("#img-mask").width();
var maskHeight = $("#img-mask").height();
var imgPos     = $("#img-main").offset();
var imgWidth   = $("#img-main").width();
var imgHeight  = $("#img-main").height();

var x1 = (imgPos.left + maskWidth) - imgWidth;
var y1 = (imgPos.top + maskHeight) - imgHeight;
var x2 = imgPos.left;
var y2 = imgPos.top;

$("#img-main").draggable({ containment: [x1,y1,x2,y2] });
$("#img-main").css({cursor: 'move'});

  //$('#creator').text(jemtest.intent.alias);
  //$('#creator_fingerprint').text(jemtest.intent.pgpKeyFingerprint);
  
 //  $('#destination').text(jemtest.intent.intendedDestination);
  
  /**
  * "genealogy": {
        "localMediaPath": "/cdbd82faa427cd6ee515ee80e9833f1733f84e34",
        "dateCreated": 1380650827093,
        "hashes": [
            "fde4fe74d21d40d3d56ff52da74e92b0"
        ],
        "createdOnDevice": "f9eb211123fc2415917f5cad7ab61ca6c73caad0"
    }
  */
  
  //$('#timestamp').text(jemtest.data.exif.timestamp);
  
});