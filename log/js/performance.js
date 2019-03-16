var timeperrender = [];
var avgTimePerPage = [];
var browserArray = [];
var timeBrowser = [];
var timeOs = [];
var osArray = [];
var colorsBos = [];
var borderColorBos = [];
var colorsB = [];
var borderColorB = [];
$.ajax({
  type: "GET",
  url: "/charts/performance",
  //data: data
  success: function(data) {
    console.log(data);
    timeperrender = data.timeperrender;

    data.avgTimePerPage.map(p => {
      avgTimePerPage.push(p.time);
    })
    data.avgBrowser.map(a => {
      browserArray.push(a.browser);
      timeBrowser.push(a.time);
      colorsB.push(colorSorterBr(a.browser));
      borderColorB.push("#ffffff");
    })
    data.avgOS.map(os => {
      osArray.push(os.os);
      timeOs.push(os.time);
      colorsBos.push(colorSorterOS(os.os));
      borderColorBos.push("#ffffff");
    })
  },
  headers: {
    "Content-type": "application/json"
  },
  xhrFields: {
    withCredentials: true
  }
}).then(test => {
  $(function() {
    // For drawing the lines
    //var africa = N;
    // Our labels along the x-axis
    var hours = ["12 am", "1 am", "2 am", "3 am", "4 am", "5 am", "6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 pm",
      "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm"
    ];

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          data: timeperrender,
          label: "Average Loading Time (ms)",
          borderColor: "#3e95cd",
          fill: false
        }]
      }

    });


    //CHART FOR LOADING PER PAGE
    Chart.defaults.global.legend.display = false;

    var pageLabel = ["donate", "learn", "home", "error"];
    var cty = document.getElementById("myChartPage");
    var myChart = new Chart(cty, {
      type: 'bar',
      data: {
        labels: pageLabel,
        datasets: [{
          data: avgTimePerPage,
          label: "Average Loading Time (ms)",
          //borderColor: "#3e95cd",
          backgroundColor: ["#a4f6a5", "#f8a978", "#f1eb9a", "#f68787"],
          fill: true
        }]
      }

    });

    //Chart for loading Per Browser
    Chart.defaults.global.legend.display = false;
    var dataB = {
      labels: browserArray,
      datasets: [{
        data: timeBrowser,
        label: "Average Loading Time (ms)",
        backgroundColor: colorsB,
        borderWidth: [1, 1, 1, 1, 1]
      }],
      options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Average Loading Time (ms)"
            }
          }]
        }
      }

    };

    var p = document.getElementById("myPieChart");
    var myPieChart = new Chart(p, {
      type: 'bar',
      data: dataB
    });
  })


  //////LOAD TIME PER OS
  Chart.defaults.global.legend.display = false;
  var dataBos = {
    labels: osArray,
    datasets: [{
      data: timeOs,
      backgroundColor: colorsBos,
      borderWidth: [1, 1, 1, 1, 1]
    }],
    options: {
      scales: {
        xAxes: [{
          stacked: false,
          beginAtZero: true,
          scaleLabel: {
            labelString: 'Month'
          },
          ticks: {
            stepSize: 1,
            min: 0,
            autoSkip: false
          }
        }]
      }
    }
  };

  var q = document.getElementById("myOSChart");
  var myOSChart = new Chart(q, {
    type: 'bar',
    data: dataBos
  });
})


function colorSorterOS(o) {
  var ret;
  if (o.includes("Windows")) {
    ret = "#a2c8ec";
  } else if (o.includes("Mac")) {
    ret = "#ceb6d9";
  } else if (o.includes("Linux")) {
    ret = "#e3abce";
  } else if (o.includes("Ubuntu")) {
    ret = "#fbcabb";
  } else {
    ret = getRandomColor();
  }
  return ret;
}

function colorSorterBr(b) {
  var ret;
  if (b.includes("Chrome")) {
    ret = "#ffc6bd";
  } else if (b.includes("Firefox")) {
    ret = "#ffa55c";
  } else if (b.includes("Safari")) {
    ret = "#5cb0b4";
  } else if (b.includes("Edge")) {
    ret = "#9bae45";
  } else if (b.includes("UC")) {
    ret = "#ffd3a4";
  } else if (b.includes("Opera")) {
    ret = "#f4ef5a";
  } else {
    ret = getRandomColor();
  }
  return ret;
}
