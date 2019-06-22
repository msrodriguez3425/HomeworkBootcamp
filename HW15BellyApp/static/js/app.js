function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    var metadataURL = "/metadata/" + sample;
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(metadataURL).then(function (data) {
      Object.entries(data).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`
        );
      })
    })
  }
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    console.log(`Current Sample:${sample}`)
    var chartsURL = `/samples/${sample}`;
    d3.json(chartsURL).then(function (data) {
    
    //pie chart
    console.log("bruh")
    var trace_pie= {
      values:data.sample_values.slice(0,10),
      labels:data.otu_ids.slice(0,10),
      hovertext:data.otu_labels.slice(0,10),
      type:'pie'
    };

    var pie_data = [trace_pie]

    var pie_layout = {
      showlegend:true,
      title:"B.button Bacteria Composition "
    };

    

    Plotly.newPlot("pie",pie_data,pie_layout)

    // @TODO: Build a Bubble Chart using the sample data
    console.log(`sample values : ${data.sample_values}`)
    var trace_bubble = {
      x:data.otu_ids,
      y:data.sample_values,
      type:'scatter',
      mode: 'markers',
      marker:{
        size: data.sample_values,
        color: data.otu_ids
      },
      hovertext: data.otu_labels
    };

    var bubble_data = [trace_bubble];

    var bubble_layout = {
      xaxis:{
        title:  "ID"
      },
      yaxis:{
        title:"Sample Value"
      },
      title:"Belly Button Bubble B'chart",
    };

    Plotly.newPlot("bubble",bubble_data,bubble_layout);
  
    }
  )}
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    console.log("Hello!!!!!")
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sample_names) => {
      
      console.log(sample_names)
      
      sample_names.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sample_names[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();