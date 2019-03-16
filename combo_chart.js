
/*
Looker Vis Components:
*/
looker.plugins.visualizations.add({
    create: function(element, config){
        element.innerHTML = "<div id='combo_container'></div>";
    },
    updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        var html = `<style>
            #combo_container {
            margin: 0 auto;
            max-width: 300px;
            min-width: 280px;
        }
        </style>`;
        var first4rows = data.slice(0,4);
        var firstMeas = Math.round(first4rows[0][queryResponse.fields.measure_like[0].name].value * 10) / 10;
        var secondMeas = Math.round(first4rows[1][queryResponse.fields.measure_like[0].name].value * 10) / 10;
        var thirdMeas = Math.round(first4rows[2][queryResponse.fields.measure_like[0].name].value * 10) / 10;
        var fourthMeas = Math.round(first4rows[3][queryResponse.fields.measure_like[0].name].value * 10) / 10;

        var firstMeasArray = [];
        for(let i=0;i<4;i++){
            firstMeasArray.push(Math.round(first4rows[i][queryResponse.fields.measure_like[0].name].value * 10) / 10)
        }
        var secondMeasArray = [];
        for(let i=0;i<4;i++){
            secondMeasArray.push(Math.round(first4rows[i][queryResponse.fields.measure_like[1].name].value * 10) / 10)
        }
        var thirdMeasArray = [];
        for(let i=0;i<4;i++){
            thirdMeasArray.push(Math.round(first4rows[i][queryResponse.fields.measure_like[2].name].value * 10) / 10)
        }
        var fourthMeasArray = [];
        for(let i=0;i<4;i++){
            fourthMeasArray.push(Math.round(first4rows[i][queryResponse.fields.measure_like[0].name].value * 10) / 10)
        }

        var firstCell = LookerCharts.Utils.htmlForCell(data[0][queryResponse.fields.dimensions[0].name]);
        var secondCell = LookerCharts.Utils.htmlForCell(data[1][queryResponse.fields.dimensions[0].name]);
        var thirdCell = LookerCharts.Utils.htmlForCell(data[2][queryResponse.fields.dimensions[0].name]);
        var fourthCell = LookerCharts.Utils.htmlForCell(data[3][queryResponse.fields.dimensions[0].name]);
        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measure_head = queryResponse.fields.measure_like[0].label_short;
        console.log(queryResponse,data);
        console.log(firstMeasArray,secondMeasArray,thirdMeasArray,fourthMeasArray);
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "combo_container";


        Highcharts.setOptions({
            colors: ['#F62366', '#9DFF02', '#0CCDD6', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
        });
                options = {
                            font_style: {
                              type: "string",
                              label: "Font Style",
                              values: [
                                {"Looker": "Helvetica"},
                                {"Impact": "Impact"},
                                {"Arial": "Arial"}
                              ],
                              display: "select",
                              default: "Looker",
                              section: "Style",
                              order: 2
                            },

                            textSize: {
                              label: 'Text Size',
                              min: 2,
                              max: 50,
                              step: .5,
                              default: 15,
                              section: 'Style',
                              type: 'number',
                              display: 'range'
                            },
                            textColor: {
                              label: 'Text Color',
                              default: '#6a26a0',
                              section: 'Style',
                              type: 'string',
                              display: 'color',
                              order:1 
                            },
                            textLabel: {
                              type: 'string',
                              label: 'Label',
                              placeholder: 'Add a label or description',
                              section: 'Style'
                            },
                            legendtoggle: {
                                label: 'Legend on/off',
                                type: 'boolean',
                                display: 'select',
                                section: "Style",
                                default: false
                            }
                }
             // Create an option for the first 4 rows in the query
             for(let i=0;i<4;i++){

                    var field = first4rows[i][queryResponse.fields.dimensions[0].name];
                    id = "color_" + i
                    options[id] =
                    {
                        label: field.value,
                        default: Highcharts.getOptions().colors[i],
                        section: "Style",
                        type: "string",
                        display: "color",
                        display_size: "half",
                        order: 1
                    }   
                    }

Highcharts.chart('combo_container', {
    title: {
        text: 'Combination chart'
    },
    xAxis: {
        categories: [firstCell, secondCell, thirdCell, fourthCell]
    },
    labels: {
        items: [{
            html: measure_head,
            style: {
                left: '50px',
                top: '18px',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
            }
        }]
    },
    series: [{
        type: 'column',
        name: 'Jane',
        data: firstMeasArray
    }, {
        type: 'column',
        name: 'John',
        data: secondMeasArray
    }, {
        type: 'column',
        name: 'Joe',
        data: thirdMeasArray
    }, {
        type: 'spline',
        name: 'Average',
        data: fourthMeasArray,
        marker: {
            lineWidth: 2,
            lineColor: config.color_3,
            fillColor: 'white'
        }
    }, {
        type: 'pie',
        name: 'Total consumption',
        data: [{
            name: 'Jane',
            y: 13,
            color: config.color_0 // Jane's color
        }, {
            name: 'John',
            y: 23,
            color: config.color_1 // John's color
        }, {
            name: 'Joe',
            y: 19,
            color: config.color_2 // Joe's color
        }],
        center: [100, 80],
        size: 100,
        showInLegend: true,
        dataLabels: {
            enabled: false
        }
    }]
});


        this.trigger('registerOptions', options) // register options with parent page to update visConfig
        doneRendering()
    }
});
