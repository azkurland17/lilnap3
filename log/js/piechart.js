function get() {

}
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
  url: "/charts/pie/os",
  //data: data
  success: function(data) {
    data.map(os => {
      osArray.push(os.os);
      osAmounts.push(os.count);
      osColors.push(colorSorter(os.os));
      osBorders.push("#FFFFFF");
      console.log(osArray);
      console.log(osAmounts);
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
    var options = {
      responsive: true,
      title: {
        display: true,
        position: "top",
        text: "Pie Chart",
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
      options: options
    });

    //create Chart class object
    var chart2 = new Chart(ctx2, {
      type: "pie",
      data: data2,
      options: options
    });
  });
})

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function colorSorter(o) {
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
    ret = getRandomColor;
  }
  return ret;
}
