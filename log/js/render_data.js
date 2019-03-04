function post(){
  $.ajax({
    type: "POST",
    url: "http://localhost:4000/data",
    data: JSON.stringify({
      'user': document.getElementById("user").value,
      'pass': document.getElementById("pass").value
    }),
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
      "Content-type": "application/json"
    },
    xhrFields: {
      withCredentials: true
    },
  });
}
