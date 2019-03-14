window.onload = function() {
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

function submitData(element) {
  let logType = element.id.split("-")[0];
  let buttonType = element.id.split("-")[1];
  console.log("HEYYY BUTTON IS THIS");
  console.log(buttonType);
  post({
    "alex": "is pretty"
  }, logType, buttonType);
}

window.onerror = function(message, source, lineno, colno, error) {
  console.log("hey")
  console.log("error", error)
}
