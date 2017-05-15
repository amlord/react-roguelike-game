var React = require('react');

var RoguelikeDungeonEngine = require('RoguelikeDungeonEngine');

var DungeonBoard = require('DungeonBoard');

// Roguelike Dungeon Crawler App
var RoguelikeDungeonCrawlerApp = React.createClass({
    getInitialState: function()
    {
        return {
          squares: RoguelikeDungeonEngine.generateMap()
        };
    },
    render: function()
    {
        var room = RoguelikeDungeonEngine.randomRoom();

        return (
            <div>
              <div>Scoreboard: {room[0] + ", " + room[1]}</div>
              <div className="dungeon">
                <DungeonBoard squares={this.state.squares} />
                <div className="dungeonViewer"></div>
              </div>
            </div>
        );
    }
});

module.exports = RoguelikeDungeonCrawlerApp;