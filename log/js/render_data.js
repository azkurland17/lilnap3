$.ajax({
  type: "GET",
  url: "http://localhost:4000/data",
  success: function(returnData) {
    returnData = JSON.parse(returnData);
    console.log(typeof returnData);
    let html = `<tr>`
    for (var key in returnData[0]) {
      html += `<th>${key}</th>`;
    }
    returnData.forEach(object => {
      html += `<tr>`;
      for (var key in object) {
        html += `<th>${object[key]}</th>`;
      }
      html += `</tr>`;
    });
    document.getElementById("data").innerHTML = html;

  },
  headers: {
    "Accept": "application/json"
  },
  xhrFields: {
    withCredentials: true
  },
});
