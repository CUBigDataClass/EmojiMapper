function pieLoad(){
    
    $.ajax({
        type: "GET",
        url: "/pie/"+document.getElementById("piediv").getAttribute('trend')+"/"+document.getElementById("piediv").getAttribute('date'),              
        dataType: "json",
        error: function (response) {           
          alert('Error: There was a problem processing your request, please refresh the browser and try again');
        },
        success: function (response) {
          
          var jsonData =  response
        var data = {};
        var sites = [];
        jsonData.forEach(function(a) {
            if(a._id === true){
                sites.push("has_location");
                data["has_location"] = a.count;
            }
            else{
                sites.push("no_location");
                data["no_location"] = a.count
            } 
        })    
        console.log("sites",sites)
        console.log("data",data)
              var chart = c3.generate({
                bindto : "#pie",
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
    window.setInterval("pieLoad()", 5000);

