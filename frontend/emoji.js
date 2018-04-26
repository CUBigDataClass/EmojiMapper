//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          					// scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  		//tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg = d3.select("body")
       			.append("svg")
       			.attr("width", width)
       			.attr("height", height);

var g = svg.append("g");

d3.json("data/us.json",function(error, us){
	if (error) throw error;

  g.append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path)

    g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);


	d3.json("data/us-cities.json",function(error, city){
		if (error) throw error;

		city = d3.shuffle(city.features)
		
		g.append("circle")
		 .data()
	})

});
