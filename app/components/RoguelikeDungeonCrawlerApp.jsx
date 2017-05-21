var React = require('react');

var RoguelikeDungeonEngine = require('RoguelikeDungeonEngine');

var DungeonBoard = require('DungeonBoard');

// Roguelike Dungeon Crawler App
var RoguelikeDungeonCrawlerApp = React.createClass({
    getInitialState: function()
    {
        let mapState = RoguelikeDungeonEngine.generateMap(1);

        return {
          squares: mapState.squares,
          user: mapState.user
        };
    },
    handleKeyPress: function(event)
    {
        console.log(event.key);
    },
    componentDidMount: function()
    {
        // bind keypress event listner to document
        document.addEventListener('keydown', (event) =>
        {
            let mapState = {};

            switch(event.code)
            {
                case 'ArrowLeft':
                    mapState = RoguelikeDungeonEngine.moveLeft();
                    break;
                case 'ArrowRight':
                    mapState = RoguelikeDungeonEngine.moveRight();
                    break;
                case 'ArrowUp':
                    mapState = RoguelikeDungeonEngine.moveUp();
                    break;
                case 'ArrowDown':
                    mapState = RoguelikeDungeonEngine.moveDown();
                    break;
                default:
                    return;
            }

            // update the map state
            this.setState({
                squares: mapState.squares,
                user: mapState.user
            });
        });
    },
    render: function()
    {
        return (
            <div>
              <div>Scoreboard: </div>
              <div className="dungeon">
                <DungeonBoard squares={this.state.squares} />
                <div className="dungeonViewer"></div>
              </div>
            </div>
        );
    }
});

module.exports = RoguelikeDungeonCrawlerApp;