// Application entrypoint.

// Load up the application styles
require('../styles/application.scss');

// Render the top-level React component
import React from 'react';
import ReactDOM from 'react-dom';

var GraphFrame  = require('./GraphFrame.jsx');

ReactDOM.render(
  <GraphFrame />,
  document.getElementById('root')
);
