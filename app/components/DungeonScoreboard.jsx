var React = require('react');

// Dungeon Board
var DungeonScoreboard = React.createClass({
    render: function()
    {
        let {user} = this.props;
        return (
            <div className="dungeonScoreboard">
                <div>Health: {user.health} XP: {user.xp} Weapon: {user.weapon.name + ' (' + user.weapon.damage + ')'}</div>
                <ul className="dungeonMessages">
                    <li className="dungeonMessages__message">{user.messages[user.messages.length - 2]}</li>
                    <li className="dungeonMessages__message">{user.messages[user.messages.length - 1]}</li>
                </ul>
            </div>
        );
    }
});

module.exports = DungeonScoreboard;