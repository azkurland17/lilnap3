function get() {
  return new Promise((resolve, reject) => {
    let osColors = [];
    let osBorders = [];
    let osArray = [];
    let osAmounts = [];
    let browserColors = [];
    let browserBorders = [];
    let browserArray = [];
    let browserAmounts = [];
    $.ajax({
      type: "GET",
      url: "/charts/environment",
      //data: data
      success: function(data) {
        data.os.map(os => {
          osArray.push(os.os);
          osAmounts.push(os.count);
          osColors.push(colorSorterOS(os.os));
          osBorders.push("#FFFFFF");
          console.log(osArray);
          console.log(osAmounts);
        })
        data.browser.map(br => {
          browserArray.push(br.browser);
          browserAmounts.push(br.count);
          browserColors.push(colorSorterBr(br.browser));
          browserBorders.push("#FFFFFF");
          console.log(browserArray);
          console.log(browserAmounts);
        })

      },
      headers: {
        "Content-type": "application/json"
      },
      xhrFields: {
        withCredentials: true
      },
    }).then(test => {
      $(function() {

        //get the pie chart canvas
        var ctx1 = $("#pie-chartcanvas-1");
        var ctx2 = $("#pie-chartcanvas-2");

        //pie chart data
        var data1 = {
          labels: osArray,
          datasets: [{
            label: "TeamA Score",
            data: osAmounts,
            backgroundColor: osColors,
            borderColor: osBorders//,
            //borderWidth: [1, 1, 1, 1, 1]
          }]
        };

        //pie chart data
        var data2 = {
          labels: browserArray,
          datasets: [{
            label: "TeamA Score",
            data: browserAmounts,
            backgroundColor: browserColors,
            borderColor: browserBorders
          }]
        };

        //options
        var options1 = {
          responsive: true,
          title: {
            display: true,
            position: "top",
            text: "Users Operating Systems",
            fontSize: 18,
            fontColor: "#111"
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              fontColor: "#333",
              fontSize: 16
            }
          }
        };
        //options
        var options2 = {
          responsive: true,
          title: {
            display: true,
            position: "top",
            text: "Users Browsers",
            fontSize: 18,
            fontColor: "#111"
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              fontColor: "#333",
              fontSize: 16
            }
          }
        };

        //create Chart class object
        var chart1 = new Chart(ctx1, {
          type: "pie",
          data: data1,
          options: options1
        });

        //create Chart class object
        var chart2 = new Chart(ctx2, {
          type: "pie",
          data: data2,
          options: options2
        });
      });
    })
    resolve();
  });
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function colorSorterOS(o) {
  var ret;
  if (o.includes("Windows")) {
    ret = "#a2c8ec";
  }
  else if (o.includes("Mac")) {
    ret = "#ceb6d9";
  }
  else if (o.includes("Linux")) {
    ret = "#e3abce";
  }
  else if (o.includes("Ubuntu")){
    ret = "#fbcabb";
  }
  else{
    ret = getRandomColor();
  }
  return ret;
}

function colorSorterBr(b){
  var ret;
  if (b.includes("Chrome")) {
    ret = "#ffc6bd";
  }
  else if (b.includes("Firefox")) {
    ret = "#ffa55c";
  }
  else if (b.includes("Safari")) {
    ret = "#5cb0b4";
  }
  else if (b.includes("Edge")){
    ret = "#9bae45";
  }
  else if (b.includes("UC")){
    ret = "#ffd3a4";
  }
  else if (b.includes("Opera")){
    ret = "#f4ef5a";
  }
  else{
    ret = getRandomColor();
  }
  return ret;
}
