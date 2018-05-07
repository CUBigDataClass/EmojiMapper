function emojicloudLoad(){
var div = document.getElementById("cloud");
var canvas = document.getElementById("canvas_cloud");

$.ajax({
    type: "GET",
    url: "/emoji/"+document.getElementById("wordcloudDiv1").getAttribute('trend')+"/"+document.getElementById("wordcloudDiv1").getAttribute('date'),              
    dataType: "json",
    error: function (response) {           
      alert('Error: There was a problem processing your request, please refresh the browser and try again');
    },
    success: function (response) {
        var parsedJSON = response;
        console.log(response);
        var list1=[]
        for (var i=0;i<parsedJSON.length;i++) {
            list1.push([])
            list1[i].push(parsedJSON[i]._id)
            list1[i].push(""+parsedJSON[i].total)
        }
        console.log(list1);
        var options =
        {
        list : list1,
        gridSize :5,
        weightFactor: function (size) {
            if(size>200){
                return 200;
            }else{
                return size;
            }
        }
        }
        WordCloud(document.getElementById('canvas_cloud'), options);
        

      }
  });

}    window.setInterval("emojicloudLoad()", 15000);




