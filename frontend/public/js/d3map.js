    var mapWidth = 960;
    var mapHeight = 500;

    //Create SVG element and append map to the SVG
    var svg = d3.select("svg#mapMain")
                .attr("width", mapWidth)
                .attr("height", mapHeight);

    var gBackground = svg.append("g");
    var gDataPoints = svg.append("g");

    // D3 Projection
    var projection = d3.geo.albersUsa()
               .translate([mapWidth/2, mapHeight/2])    // translate to center of screen
               .scale([1000]);          					// scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
             .projection(projection);  		//tell path generator to use albersUsa projection

    // *********************** End of the map variables **************************************

    // *********************** Start to defining date slider variables ***********************

    var formatDateOnTop = d3.time.format("%b %d %Y")
    var formatDateOnSlider = d3.time.format("%b %Y")

    var margin = {top:0, right:50, bottom:0, left:50},
    sliderWidth = 960 -margin.left - margin.right,
    sliderHeight = 500 - margin.top - margin.bottom;

    var slidersvg = d3.select("svg#sliderMain")
                      .attr("width",sliderWidth)
                      .attr("height",sliderHeight);

    // ************************ End of slider variables *************************************

    // ************************ Defining Map Functions **************************************

    d3.json("data/us.json",function(error, us){
      if (error) throw error;

      gBackground.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path);

      gBackground.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("id", "state-borders")
          .attr("d", path);

      });

      d3.json("data/us-cities.json",function(error, city){
        if (error) throw error;

        newcity = ["Albuquerque", "Atlanta", "Austin", "Baltimore", "Birmingham", "Boston", "Charlotte", "Chicago", "Cincinnati", "Cleveland", "Colorado Springs", "Columbus", "Dallas-Ft. Worth", "Denver", "Detroit", "El Paso", "Fresno", "Greensboro", "Harrisburg", "Honolulu", "Indianapolis", "Jackson", "Jacksonville", "Kansas City", "Las Vegas", "Long Beach", "Louisville", "Memphis", "Milwaukee", "Nashville", "New Haven"]

        newfeat = []
        for (i = 0;i < city.features.length;i++)
        {
              if (newcity.includes(city.features[i].properties.name) == true)
                {  newfeat.push(city.features[i]);
                }
        }

        gDataPoints.selectAll("path")
         .data(newfeat)
         .enter()
         .append("image")
         .attr("class","path")
         .attr("xlink:href","data/1f354.svg")
         .attr("x", function(d,i) {return projection(d.geometry.coordinates)[0];})
         .attr("y", function(d,i) {return projection(d.geometry.coordinates)[1];})
         .attr("width","20")
         .attr("height","20");

      });
