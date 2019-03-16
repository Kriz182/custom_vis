
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
            min-width: 310px;
            height: 350px;
            font-family: 'Open Sans', Helvetica, Arial, sans-serif; 
        }
        </style>`;
        var first4rows = data.slice(0,4);
       // A bunch of arrays to store the measure value for passing into the series later
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
            fourthMeasArray.push(Math.round(first4rows[i][queryResponse.fields.measure_like[3].name].value * 10) / 10)
        }
       // A names of all the cells from the dimensions for the xaxis as well as labels of the measures for the pies

        var firstCell = LookerCharts.Utils.htmlForCell(data[0][queryResponse.fields.dimensions[0].name]);
        var secondCell = LookerCharts.Utils.htmlForCell(data[1][queryResponse.fields.dimensions[0].name]);
        var thirdCell = LookerCharts.Utils.htmlForCell(data[2][queryResponse.fields.dimensions[0].name]);
        var fourthCell = LookerCharts.Utils.htmlForCell(data[3][queryResponse.fields.dimensions[0].name]);
        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measure_header_1 = queryResponse.fields.measure_like[0].label_short;
        var measure_header_2 = queryResponse.fields.measure_like[1].label_short;
        var measure_header_3 = queryResponse.fields.measure_like[2].label_short;
        var measure_header_4 = queryResponse.fields.measure_like[3].label_short;

       // just a function to get the sum of each arrays so user doesn't have to do Looker totals which add SQL overhead

        function getSum(total, num) {
          return total + Math.round(num);
        }

       
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

                            pieSize: {
                              label: 'Pie Size',
                              min: 50,
                              max: 100,
                              step: 1,
                              default: 100,
                              section: 'Pie Style',
                              type: 'number',
                              display: 'range'
                            }
                            textLabel: {
                              type: 'string',
                              label: 'Subtitle',
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
             for(let i=0;i<=3;i++){

                    var field = queryResponse.fields.measure_like[i].label_short;
                    id = "color_" + i
                    options[id] =
                    {
                        label: field,
                        default: Highcharts.getOptions().colors[i],
                        section: "Pie Style",
                        type: "string",
                        display: "color",
                        display_size: "half",
                        order: 1
                    }   
                    }

Highcharts.chart('combo_container', {
    title: {
                text: dimension_head,
                style: {
                    fontSize: config.textSize,
                    color: config.color_0
                }
            },subtitle: {
                text: config.textLabel,
                style: {
                fontSize: '10px',
                color: config.textColor
                }
            },
            credits: {
                    enabled: false
                },
    xAxis: {
        categories: [firstCell, secondCell, thirdCell, fourthCell]
    },
    // labels: {
    //     items: [{
    //         html: dimension_head,
    //         style: {
    //             left: '50px',
    //             top: '18px',
    //             color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
    //         }
    //     }]
    // },
    legend: {
          labelFormatter: function() {
            return '<span style="color:#6a26a0">' + this.name + '</span>';
          },
          enabled: config.legendtoggle,
          symbolWidth: 0
        },
    series: [{
        type: 'column',
        name: measure_header_1,
        data: firstMeasArray
    }, {
        type: 'column',
        name: measure_header_2,
        data: secondMeasArray
    }, {
        type: 'column',
        name: measure_header_3,
        data: thirdMeasArray
    }, {
        type: 'spline',
        name: measure_header_4,
        data: fourthMeasArray,
        marker: {
            lineWidth: 2,
            lineColor: config.color_3,
            fillColor: 'white'
        }
    }, {
        type: 'pie',
        name: measure_header_1,
        data: [{
            name: firstCell,
            y: firstMeasArray[0],
            color: config.color_0 // dim 1's color
        }, {
            name: secondCell,
            y: firstMeasArray[1],
            color: config.color_1 // dim 2's color
        }, {
            name: thirdCell,
            y: firstMeasArray[2],
            color: config.color_2 // dim 3's color
        }, {
            name: fourthCell,
            y: firstMeasArray[3],
            color: config.color_3 // dim 3's color
        }],
        center: [50, 0],
        size: config.pieSize,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }, {
        type: 'pie',
        name: measure_header_2,
        data: [{
            name: firstCell,
            y: secondMeasArray[0],
            color: config.color_0 // dim 1's color
        }, {
            name: secondCell,
            y: secondMeasArray[1],
            color: config.color_1 // dim 2's color
        }, {
            name: thirdCell,
            y: secondMeasArray[2],
            color: config.color_2 // dim 3's color
        }, {
            name: fourthCell,
            y: secondMeasArray[3],
            color: config.color_3 // dim 3's color
        }],
        center: [250, 0],
        size: config.pieSize,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }, {
        type: 'pie',
        name: measure_header_3,
        data: [{
            name: firstCell,
            y: thirdMeasArray[0],
            color: config.color_0 // dim 1's color
        }, {
            name: secondCell,
            y: thirdMeasArray[1],
            color: config.color_1 // dim 2's color
        }, {
            name: thirdCell,
            y: thirdMeasArray[2],
            color: config.color_2 // dim 3's color
        }, {
            name: fourthCell,
            y: thirdMeasArray[3],
            color: config.color_3 // dim 3's color
        }],
        center: [450, 0],
        size: config.pieSize,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }]
});


        this.trigger('registerOptions', options) // register options with parent page to update visConfig
        doneRendering()
    }
});