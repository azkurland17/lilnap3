var renderStart = new Date().getTime();

window.onload = function() {
  submitRender();

  let buttons = document.getElementsByTagName("button");

  for (let index in buttons) {
    let buttonElement = buttons[index];

    let buttonID = buttonElement.id;

    if (buttonID) {
      let button_path = buttonID.split("-");

      switch (button_path[0]) {
        case "route":
          buttonElement.addEventListener("click", function() {
            window.location = `/${button_path[1]}`;
          });
          break;
        case "event":
          buttonElement.addEventListener("click", function() {
            submitEvent(this.id);
          });
          break;
      }
    }
  }
}

function submitEvent(buttonID) {
  console.log(buttonID.split('-')[1]);
  buttonID = buttonID.split('-')[1];
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/event",
    data: {
      'buttonID': buttonID,
    },
    success: function() {

    },
    xhrFields: {
      withCredentials: true
    },
  });
}

function submitError(buttonID) {
  console.log(buttonID.split('-')[1]);
  buttonID = buttonID.split('-')[1];
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/event",
    data: {
      'buttonID': buttonID,
    },
    success: function() {

    },
    xhrFields: {
      withCredentials: true
    },
  });
}

function submitRender() {
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/performance",
    data: {
      'render_time': new Date().getTime() - renderStart,
    },
    xhrFields: {
      withCredentials: true
    },
  });
}

window.onerror = function(message, source, lineno, colno, error) {
  let path = source.split('/');
  source = path[(path.length) - 1];

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/error",
    data: {
      'page_source': source,
      'error_type': (message.split(":"))[0],
      'lineno': lineno
    },
    success: function(data, textStatus, response) {
      console.log(data);
      // alert("done!"+ response.getResponseHeader('Set-Cookie'));
    },
    xhrFields: {
      withCredentials: true
    },
  });
}
