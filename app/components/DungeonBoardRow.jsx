var React = require('react');

// Dungeon Board Row
var DungeonBoardRow = React.createClass({
    renderCells: function()
    {
      var {cells} = this.props;
      
      return cells.map((cell, i) => {
        return (
            <div
                className={"dungeonBoard__cell" + (cell ? " dungeonBoard__cell--room" : " dungeonBoard__cell--wall") }
                key={i}></div>
        );
      });
    },
    render: function()
    {
        return (
            <div className="dungeonBoard__row">
                {this.renderCells()}
            </div>
        );
    }
});

module.exports = DungeonBoardRow;