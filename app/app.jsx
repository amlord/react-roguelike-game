var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');

var RoguelikeDungeonCrawlerApp = require('RoguelikeDungeonCrawlerApp');

// load Foundation
$(document).foundation();

// load App css
require('style!css!sass!applicationStyles');

// render the react 'Rougelike Dungeon Crawler' app
ReactDOM.render(
  <RoguelikeDungeonCrawlerApp />,
  document.getElementById('app')
);