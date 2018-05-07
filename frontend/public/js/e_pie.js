function e_pieLoad(){
    
    $.ajax({
        type: "GET",
        url: "/e_pie/"+document.getElementById("e_piediv").getAttribute('trend')+"/"+document.getElementById("e_piediv").getAttribute('date'),              
        dataType: "json",
        error: function (response) {           
          alert('Error: There was a problem processing your request, please refresh the browser and try again');
        },
        success: function (response) {
          
        var jsonData =  response
        var data = {};
        var sites = [];
        jsonData.forEach(function(e) {
            if(e._id === true){
                sites.push("has_emoji");
                data["has_emoji"] = e.count;
            }
            else{
                sites.push("no_Emoji");
                data["no_Emoji"] = e.count
            }  
        })    
        console.log("sites",sites)
        console.log("data",data)
              var chart = c3.generate({
                bindto : "#e_pie",
                data: {
                    json: [ data ],
                    keys: {
                        value: sites,
                    },
                    type:'pie'
                },
            });
          }
      });
    }
    window.setInterval("e_pieLoad()", 5000);