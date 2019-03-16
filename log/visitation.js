var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  database: 'logs',
  user: 'root',
  password: 'rootroot',
});

connection.connect(function(err) {
  console.log('Visitation is connected as id ' + connection.threadId);
});

let data = {
  nodes: [{
      data: {
        name: 'home',
        count: 0,
        id: 'home',
        width: 10,
        height: 10,
        color: 'red'
      }
    },
    {
      data: {
        name: 'learn',
        count: 0,
        id: 'learn',
        width: 10,
        height: 10,
        color: 'blue'
      }
    },
    {
      data: {
        name: 'donate',
        count: 0,
        id: 'donate',
        width: 10,
        height: 10,
        color: 'red'
      }
    },
    {
      data: {
        name: 'error',
        count: 0,
        id: 'error',
        width: 10,
        height: 10,
        color: 'red'
      }
    }
  ],
  edges: [{
      data: {
        name: 'homeerror',
        source: 'home',
        target: 'error',
      }
    },
    {
      data: {
        name: 'homedonate',
        source: 'home',
        target: 'donate',
      }
    },
    {
      data: {
        name: 'homelearn',
        source: 'home',
        target: 'learn',
      }
    },
    {
      data: {
        name: 'donatehome',
        source: 'donate',
        target: 'home',
      }
    },
    {
      data: {
        name: 'learnhome',
        source: 'learn',
        target: 'home',
      }
    }, {
      data: {
        name: 'errorhome',
        source: 'error',
        target: 'home',
      }
    },
    {
      data: {
        name: 'donatelearn',
        source: 'donate',
        target: 'learn',
      }
    },
    {
      data: {
        name: 'learndonate',
        source: 'learn',
        target: 'donate',
      }
    }
  ]
};

function getData() {
  return new Promise((resolve, reject) => {
    connection.query(`select * from navigation;`, function(err, rows, fields) {
      resetData();
      initializeEdges(rows).then(test => {
        resolve(data);
      })
      // console.log(rows);
    });
  });
}

function initializeEdges(edges) {
  return new Promise((resolve, reject) => {
    let edgewidths = {
      homeerror: 0,
      homedonate: 0,
      homedonate: 0,
      donatehome: 0,
      homelearn: 0,
      learnhome: 0,
      donatelearn: 0,
      learndonate: 0,
      errorhome: 0,
    }
    for (var i in edges) {
      let edge = edges[i];
      if (edge.pt_A == 'outside') {
        incrementNodes(edge.pt_B);
      } else {
        edgewidths[(edge.pt_A + edge.pt_B.getPath())] += 0.01;
        if((edge.pt_A + edge.pt_B.getPath()) == 'homedonate'){
        }
      }
    }
    let edgesingraph = data.edges;
    console.log(edgesingraph.length)
    for (var i in edgesingraph) {
      let edge = edgesingraph[i];
      edge.data.width = edgewidths[edge.data.name];
      edge.data.id = Math.floor(edgewidths[edge.data.name]*100);
    }
    console.log(edgewidths)
    resolve();
  });

}

function incrementNodes(nodeName) {
  let nodes = data.nodes;
  for (var i in nodes) {
    let node = nodes[i].data;
    if (node.name == nodeName.getPath()) {
      node.width += .1;
      node.height += .1;
    }
  }
}

function resetData() {
  let nodes = data.nodes;
  for (var i in nodes) {
    let node = nodes[i].data;
    node.width = 10;
    node.height = 10;
  }
}

String.prototype.getPath = function() {
  return this.split('/')[1];
}

module.exports = {
  getData: getData
}
