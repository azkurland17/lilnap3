// let returned;
// let os;
// $.ajax({
//   // the call
//   type: "POST",
//   url: "http://localhost:4000/data",
//   // what happens after the call
//   success: function(returnData) {
//
//     returned = JSON.parse(returnData)
//     console.log(returnData)
//     let x;
//     for (i in returned) {
//       x += returned[i].os;
//     }
//     console.log(x)
//
//   },
//   xhrFields: {
//     withCredentials: true
//   },
// });


// Our labels along the x-axis
var years = [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050];
// For drawing the lines
var africa = [86,114,106,106,107,111,133,221,783,2478];

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: years,
    datasets: [
      {
        data: africa,
        label: "Africa",
        borderColor: "#3e95cd",
        fill: false
      }
    ]
  }
});


var dataPie = {
    datasets: [{
        data: [10, 20, 30]
    }],
    labels: [
        'Red',
        'Yellow',
        'Blue'
    ]
};
r = Math.floor(Math.random() * 200);
g = Math.floor(Math.random() * 200);
b = Math.floor(Math.random() * 200);
color = 'rgb(' + r + ', ' + g + ', ' + b + ')';

// For a pie chart
var p = document.getElementById("myPieChart");
var myPieChart = new Chart(p,{
    type: 'pie',
    data: dataPie,
    options: color
});
