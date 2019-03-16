window.onload = function() {
  document.getElementById('share').innerHTML = `
  <button onclick="genPDF()">Generate PDF</button>

  <button id="create" onclick="genLink()">Creat Link</button>
  <p id="link"></p>

  <button onclick="email()">email pdf</button>
  <input id='email' type="email" placeholder="enter email"></input>
  `
}
var doc = new jsPDF('p', 'pt', 'a4')

function genPDF() {
  var options = {
    pagesplit: true,
    width: document.getElementById('toshare').width,
    height: document.getElementById('toshare').height,
  };

  doc.addHTML($("#toshare"), options, function() {
    doc.save("test.pdf");
  });
}

function genLink() {
  var options = {
    pagesplit: true,
    width: document.getElementById('toshare').width,
    height: document.getElementById('toshare').height,
  };

  doc.addHTML($("#toshare"), options, function() {
    $.ajax({
      type: "post",
      url: "http://localhost:4000/makelink",
      credentials: 'same-origin',
      data: {
        encoded: window.btoa(doc.output())
      },
      success: function(msg) {
        document.getElementById('link').innerHTML = msg;
      }
    });
  });


}

function email() {
  var options = {
    pagesplit: true,
    width: document.getElementById('toshare').width,
    height: document.getElementById('toshare').height,
  };
  let email = document.getElementById('email').value;
  doc.addHTML($("#toshare"), options, function() {
    $.ajax({
      type: "post",
      url: "http://localhost:4000/email",
      credentials: 'same-origin',
      data: {
        email: email,
        pdf: window.btoa(doc.output())
      },
      success: function(msg) {
        document.getElementById('email').value = "email sent!"
        console.log(msg);
      }
    })
  });
}
