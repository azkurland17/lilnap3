$(function(){

  //get the pie chart canvas
  var ctx1 = $("#pie-chartcanvas-OS");
  var ctx2 = $("#pie-chartcanvas-Browser");

  //pie chart data
  var dataOS = {
    labels: ["match1", "match2", "match3", "match4", "match5"],
    datasets: [
      {
        label: "TeamA Score",
        data: [10, 50, 25, 70, 40],
        backgroundColor: [
          "#DEB887",
          "#A9A9A9",
          "#DC143C",
          "#F4A460",
          "#2E8B57"
        ],
        borderColor: [
          "#CDA776",
          "#989898",
          "#CB252B",
          "#E39371",
          "#1D7A46"
        ],
        borderWidth: [1, 1, 1, 1, 1]
      }
    ]
  };

  //pie chart data
  var dataBrowser = {
    labels: ["match1", "match2", "match3", "match4", "match5"],
    datasets: [
      {
        label: "TeamB Score",
        data: [20, 35, 40, 60, 50],
        backgroundColor: [
          "#FAEBD7",
          "#DCDCDC",
          "#E9967A",
          "#F5DEB3",
          "#9ACD32"
        ],
        borderColor: [
          "#E9DAC6",
          "#CBCBCB",
          "#D88569",
          "#E4CDA2",
          "#89BC21"
        ],
        borderWidth: [1, 1, 1, 1, 1]
      }
    ]
  };

  //options
  var optionsOS = {
    responsive: true,
    title: {
      display: true,
      position: "top",
      text: "Users OS",
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
  var optionsBrowser = {
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
    data: dataOS,
    options: optionsOS
  });

  //create Chart class object
  var chart2 = new Chart(ctx2, {
    type: "pie",
    data: dataBrowser,
    options: optionsBrowser
  });
});
