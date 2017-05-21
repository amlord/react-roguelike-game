var React = require('react');

// Dungeon Board Row
var DungeonBoardRow = React.createClass({
    renderCells: function()
    {
      var {cells} = this.props;

      var getClassName = function(cell)
      {
        if( cell.element )
        {
            return 'dungeonBoard__cell--' + cell.element.type;
        }
        else if( cell.openSpace )
        {
            return 'dungeonBoard__cell--room';
        }

        return 'dungeonBoard__cell--wall';
      };

      var getAttributes = function(cell)
      {
        var attributes = {};

        if(cell.element)
        {
            switch(cell.element.type)
            {
                case 'weapon':
                    attributes['data-name'] = cell.element.value.name;
                    attributes['data-value'] = cell.element.value.damage;
                    break;
                case 'potion':
                case 'enemy':
                    attributes['data-value'] = cell.element.value;
            }
        }

        return attributes;
      };
      
      return cells.map((cell, i) =>
      {
        return (
            <div
                className={"dungeonBoard__cell " + getClassName(cell) }
                {...getAttributes(cell)}
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