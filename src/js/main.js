// require("./lib/pym");




// homepage effects still to come
// fade in elements on scroll
// do something with big page title







// interactive javascript
    var data_url = require("./interactiveData");
    var url = "https://cdn.jsdelivr.net/npm/us-atlas@2/us/states-10m.json";

    var width = window.innerWidth;
    var height = width*0.67;
    var centered;


    // create area for map
    var svg = d3.select("#map").append("svg").append("g").attr("transform","scale(" + width/1000 + ")");
    var projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
    var path = d3.geoPath();

    d3.select("#map").attr("style","height:" + (width*0.67) + "px")

    var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);



    // select area for table
    var table = d3.select("#table tbody");






    // get the data
    Promise.all([d3.json(url)]).then(function(data) {



      // map data
      var us = data[0]; 

      // shootings data
      var shootings = data_url.records;

      // only use the shootings data that we need instead of the entire dataset
      shootings = shootings.map(function(d) {
        return {
          lat: d.lat,
          long: d.long,
          date: d.date,
          school_name: d.school_name,
          city: d.city,
          state: d.state,
          killed: d.killed,
          injured: d.injured,
        }
      });

      // draw map
      svg.append("g")
          .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("d", path)
          .on("click", zoomstate);

      svg.append("path")
          .attr("class", "state-borders")
          .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
      


      // draw points on map
      svg.selectAll("circle")
        .data(shootings)
      .enter()
        .append("circle")
        .on("mouseover", activateTooltip)
        .on("mouseout", deactivateTooltip)
        .attr("class", function(d) {
          return d.state + " map-dot";
        })
        .attr("r", function(d) {
          return 10;
        })
        .attr("cx", function(d) {
          return 0;
        })
        .attr("cy", function(d) {
          return 0;
        })
        .attr("transform", function(d) {
          return "translate(" + projection([+d.long, +d.lat]) + ")";
        });


      function activateTooltip(d) {
        div.transition()    
          .duration(250)    
          .style("opacity", .9);    
        div.html(d.school_name + 
          "<br/>" + d.city + ", " + d.state + 
          "<br/>" + d.killed + " killed, " + d.injured + " injured" +
          "<br/>" + d.date
          )  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 60) + "px");
      }

      function deactivateTooltip(d) {
        // div.transition()    
        //         .duration(500)    
        //         .style("opacity", 0); 
      }



        // function for zooming into map
      function zoomstate(d) {
        var x, y, k;

        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }

        svg.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });

        svg.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
      }







      // organize shootings by state to create dropdown
      var shootingsByState = d3.nest()
      .key(function(d) { return d.state; })
      .rollup(function(v) { return {
        count: v.length
      }; })
      .entries(shootings);

      shootingsByState.sort(function(a, b) {
          var x = a.key; var y = b.key;
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });

      // if you change this, be sure to also change it in the below filterData function!
      shootingsByState.unshift({
        key: "View All States",
        value: null
      })

      // create function for the dropdown filtering
      var filterData = function() {
          // get selected state
          var selectedState = d3.select("#filtercontainer select").property('value');

          // fade out table data for other states, bring back selected state (while making sure our even/odd background look stays intact)
          if (selectedState !== "View All States") {
            d3.selectAll("tbody tr:nth-child(odd)").style("background-color", "white");
            d3.selectAll("table tbody tr").style("display", "none");
            d3.selectAll("tbody tr." + selectedState).style("display", "table-row");
            d3.selectAll("tbody tr." + selectedState).style("background-color", function(d,i) {
              if (i % 2 == 0) {
                return "#f0f0f0";
              }
            });
          } else {
            d3.selectAll("table tbody tr").style("display", "table-row").style("background-color", function(d,i) {
              if (i % 2 == 0) {
                return "#f0f0f0";
              }
            });
          }


      };

      // draw table filter dropdown
      var dropdown = d3.select("#filtercontainer")
          .insert("select")
          .on("change", filterData);

      dropdown.selectAll("option")
                    .data(shootingsByState)
                  .enter().append("option")
                    .attr("value", function (d) { return d.key; })
                    .text(function (d) {
                        return d.key;
                    });

      // filter data to what we need for table 
      var shootingsTable = shootings.map(function(d) {
        return {
          date: d.date,
          school_name: d.school_name,
          city: d.city,
          state: d.state,
          killed: d.killed,
          injured: d.injured,
        }
      });

      drawTable(shootingsTable);

      // draw table
      function drawTable(tabledata) {
        table.selectAll("tr").remove();

        var tr = table
         .selectAll("tr")
         .data(tabledata)
         .enter().append("tr")
         .attr("class",function(d) { return d.state; });

        d3.selectAll("tbody tr:nth-child(odd)").style("background-color", "#f0f0f0");

        var td = tr.selectAll("td")
         .data(function(d, i) { return Object.values(d); })
         .enter().append("td")
           .text(function(d) { return d; });
      }



      // sort table when clicking on header
      var tableheaders = d3.selectAll("th");
      var value;
      var headerClick = false;

      tableheaders.on("click",function() {

        d3.selectAll(".tablearrow").remove();

        value = d3.select(this).attr("data-cat");

        if (headerClick == false) {
          headerClick = true;
          d3.select(this).append("span").attr("class","tablearrow").html('&#x25BC;');
          shootingsTable = shootingsTable.sort(function(a,b){return d3.descending(a[value], b[value]); });
          drawTable(shootingsTable);
          filterData();
        } else {
          headerClick = false;
          d3.select(this).append("span").attr("class","tablearrow").html('&#x25B2;');
          shootingsTable = shootingsTable.sort(function(a,b){return d3.ascending(a[value], b[value]); });
          drawTable(shootingsTable);
          filterData();
        }
        
      })
    });
