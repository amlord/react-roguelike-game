var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');

// load Foundation
$(document).foundation();

// load App css
require('style!css!sass!applicationStyles');

ReactDOM.render(
  <p>React Rougelike Game</p>,
  document.getElementById('app')
);
