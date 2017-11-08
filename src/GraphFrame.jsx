// TODO: add events
// TODO: get(*NAME*) remove(name:puppet) expand(name:webnode) group(nagios,prometheus,monitoring)

import React from 'react';
import Graph from 'react-graph-vis';
import axios from 'axios';

const graph = {
  nodes: [
    { id: 1, label: "Node 1", color: "#e04141", x: 100, y:100 },
    { id: 2, label: "Node 2", color: "#e09c41" },
    { id: 3, label: "Node 3", color: "#e0df41" },
    { id: 4, label: "Node 4", color: "#7be041" },
    { id: 5, label: "Node 5", color: "#41e0c9" }
  ],
  edges: [{ from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 2, to: 5 }]
};

class MyGraph extends Graph {
  componentDidUpdate() {
    this.updateGraph();
    console.log('ceva');
  }
}

class GraphFrame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      network: null,
      graph: {
        nodes: [],
        edges: []
      },
      options : {
        interaction: {
          navigationButtons: true,
          zoomView: false
        },
        layout: {
          hierarchical: false
        },
        edges: {
          color: '#000000'
        },
        physics: {
          enabled: false
        }
      },
      events  : {
        select: function(event) {
          var { nodes, edges } = event;
          console.log("Selected nodes:");
          console.log(nodes);
          console.log("Selected edges:");
          console.log(edges);
        },
        ceva: function(event) {
          console.log(event);
        }
      }
    }
  }

  componentDidMount() {
    axios.get('http://localhost:2000/graph')
      .then(response => {
        var newGraph = { nodes: [], edges: []};

        // Go to us-east-1 region
        response.data = response.data.nodes[1];

        axios.get('http://localhost:2000/view')
          .then(res => {
            var nodes = JSON.parse(res.data.body);

            Object.keys(nodes).forEach(function(node, i) {
              newGraph.nodes.push({
                id: node,
                label: node,
                x: nodes[node].x,
                y: nodes[node].y
              });
            });

            response.data.connections.forEach(function(conn) {
              newGraph.edges.push({
                from: conn.source,
                to: conn.target
              });
              newGraph.edges.push({
                to: conn.source,
                from: conn.target
              });
            });

            // Generate Network
            var network = new vis.Network(this.refs.myRef, newGraph, this.state.options);
            // Save new state
            this.setState({graph: newGraph, network: network});
          });


        // response.data.connections.forEach(function(conn) {
        //   newGraph.edges.push({
        //     from: conn.source,
        //     to: conn.target
        //   });
        //   newGraph.edges.push({
        //     to: conn.source,
        //     from: conn.target
        //   });
        // });

        // var nodes = [];
        // response.data.nodes.forEach(function(node) {
        //   newGraph.nodes.push({
        //     id: node.name,
        //     label: node.name
        //   });
        // });

        // console.log(newGraph);
        // // Generate Network
        // var network = new vis.Network(this.refs.myRef, newGraph, this.state.options);
        // // Save new state
        // this.setState({graph: newGraph, network: network});

      });
  }

  exportGraph() {
    var nodes = this.state.network.getPositions();

    axios.post('http://localhost:2000/view', JSON.stringify(nodes))
      .then(response => {
        console.log(response);
      });
  }

  render() {
    return (<div>
      <input onClick={this.exportGraph.bind(this)} type="button" value="Save"></input>
      <div style={{height: '640px'}} ref="myRef"></div>
    </div>);
  }
}

module.exports = GraphFrame;
