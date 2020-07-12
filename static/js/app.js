var dropdown = d3.select("#selDataset");   

//Populate the Dropdown in the webpage with the Subject ID's
d3.json("data/samples.json").then((data) => {
    //var Ids = data.names;
    //console.log(Ids);
    updateDemo(940);
    updateCharts(940);

    data.names.forEach((Id) => {
        dropdown.append("option").text(Id);
    });
});

//Function that calls the updates each time a dropdown selection is made
  function optionChanged(id) {
    updateDemo(id);
    updateCharts(id);
  }

//Update Demographic Data based off above chosen subject id
function updateDemo(id) {
    d3.json("data/samples.json").then((data) => {
        //console.log(data)
        var filtered_demodata = data.metadata.filter(sampleid => sampleid.id == id);
        var filtered_demodata_array = filtered_demodata[0];
        //console.log(filtered_demodata_array);
        var demohtml = d3.select("#sample-metadata");
        demohtml.html("");
        for (const [key, value] of Object.entries(filtered_demodata_array)) {
            //console.log(key, value);
            demoentry = key + ': '+ value;
            demohtml.append("p").text(demoentry);
            if(key=="wfreq"){
                GuageUpdate(value);
                // console.log("Gauge Chart:" + value);
            }
        }
    });
};
        
// Update Charts - comments throughout 

//Gauge Update is seperate due to the variable being part ot the metadata
// Advanced Challenge Assignment (Optional)
// The following task is advanced and therefore optional.
// Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ to plot the weekly washing frequency of the individual.
// You will need to modify the example gauge code to account for values ranging from 0 through 9.
// Update the chart whenever a new sample is selected.

function GuageUpdate(value) {
    wfreq = value;
    //console.log("Gauge Chart:" + wfreq);
    var data = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",        
        gauge: {
            axis: {range: [null, 9]},
            steps: [
                {range: [0, 1], color: "FF0000" },
                {range: [1, 2], color: "FF3300" },
                {range: [2, 3], color: "ff6600" },
                {range: [3, 4], color: "ff9900" },
                {range: [4, 5], color: "FFCC00" },
                {range: [5, 6], color: "FFFF00" },
                {range: [6, 7], color: "99ff00" },
                {range: [7, 8], color: "66ff00" },
                {range: [8, 9], color: "00FF00" }
            ],
            }
        }
    ];
    var layout = {width: 600, height: 500, margin: {t: 0, b: 0}};
    Plotly.newPlot("gauge", data, layout);
};


function updateCharts(id) {
    //console.log(id)
    d3.json("data/samples.json").then((data) => {
        //console.log(data)
        var filtered_data = data.samples.filter(sampleid => sampleid.id == id);
        // console.log(filtered_data)
        var sample_values = filtered_data[0].sample_values;
        var otu_ids = filtered_data[0].otu_ids;
        var otu_labels = filtered_data[0].otu_labels;
        // console.log(sample_values);
        // console.log(otu_ids);
        // console.log(otu_labels);


        // Horizontal Bar Chart based off the required information
        //  1. Use the D3 library to read in `samples.json`.
        //  2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        //  * Use `sample_values` as the values for the bar chart.
        //  * Use `otu_ids` as the labels for the bar chart.
        //  * Use `otu_labels` as the hovertext for the chart.


        var bar_data = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
          }];
        
        Plotly.newPlot('bar', bar_data);


        // Create a bubble chart that displays each sample.
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.

        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sample_values
            }
          };
          
        var data = [trace1];
       
        var layout = {
            showlegend: false,
            // height: 600,
            // width: 600
        };

        Plotly.newPlot('bubble', data, layout);
    });
 };