function post(data, logType, buttonType) {
  /* type = event, error, static */

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/api/log/" + logType,
    data: JSON.stringify({
      'buttonType': buttonType,
      'logType': logType
    }),
    success: function(returnData) {
      console.log("button !!!");
      console.log(buttonType);
    },
    headers: {
      "Content-type": "application/json"
    },
    xhrFields: {
      withCredentials: true
    },
    //crossDomain: true,
  });
}
