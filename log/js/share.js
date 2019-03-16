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

function shrink() {
  return new Promise((resolve, reject) => {
    document.getElementsByTagName("body")[0].style.height = `400%`;
    document.getElementsByTagName("body")[0].style.width = `25%`;
    get().then(test => {
      setTimeout(function() {
        resolve();
      }, 500);

    });
  });
}

function enlarge() {
  document.getElementsByTagName("body")[0].style.height = `100%`;
  document.getElementsByTagName("body")[0].style.width = `100%`;
  get()
}

function genPDF() {
  shrink().then(test => {

    var options = {
      pagesplit: true,
      width: document.getElementById('toshare').width,
      height: document.getElementById('toshare').height,
    };

    doc.addHTML($("#toshare"), options, function() {
      doc.save("test.pdf");
      setTimeout(function() {
        enlarge();
      }, 500);

    });

  })


}

function genLink() {
  shrink().then(test => {
    var options = {
      pagesplit: true,
      width: document.getElementById('toshare').width,
      height: document.getElementById('toshare').height,
    };

    doc.addHTML($("#toshare"), options, function() {
      enlarge();
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
  })
}

function email() {
  shrink().then(test => {
    var options = {
      pagesplit: true,
      width: document.getElementById('toshare').width,
      height: document.getElementById('toshare').height,
    };
    let email = document.getElementById('email').value;
    doc.addHTML($("#toshare"), options, function() {
      enlarge();
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
  })

}
