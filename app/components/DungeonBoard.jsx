var React = require('react');

var DungeonBoardRow = require('DungeonBoardRow');

// Dungeon Board
var DungeonBoard = React.createClass({
    renderRows: function()
    {
      var {squares} = this.props;
      
      return squares.map((row, i) => {
        return (
            <DungeonBoardRow
                key={i}
                cells={row} />
        );
      });
    },
    render: function()
    {
        return (
            <div className="dungeonBoard">
                {this.renderRows()}
            </div>
        );
    }
});

module.exports = DungeonBoard;