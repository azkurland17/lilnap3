function post(data, logType, buttonType) {
  /* type = event, error, static */

  $.ajax({
    type: "POST",
    url: "http://104.248.219.235:3001/api/log/" + logType,
    data: JSON.stringify({
      'buttonType': buttonType,
      'logType': logType
    }),
    success: function(returnData) {
      console.log("button !!!");
      console.log(buttonType);
      console.log(JSON.stringify({
        'buttonType': buttonType,
        'logType': logType
      }));
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
