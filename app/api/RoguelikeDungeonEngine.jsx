// ----- Rougelike Game Engine -----------------------------

// dungeon dimensions
var sizeX = 100;
var sizeY = 80;

var map = [];

// exported object
module.exports = {
  // public functions
  randomRoom: function()
  {
    return _getRandomRoomSize();
  },
  generateMap: function()
  {
      map = _getEmptyDungeonMap(sizeX, sizeY);

      _generateRooms();

      return map;
  }
};

// ----- private functions ---------------

// generate random room size
function _getRandomRoomSize()
{
    // min & max room dimensions
    return [
        _getRandomOddInt(),
        _getRandomOddInt()
    ];
}

// return a random roomsize between min & max
function _getRandomOddInt()
{
    var min = 2,
        max = 4;

    return (Math.floor(Math.random() * (max - min + 1)) + min)  * 2 + 1;
}

// get an empty dungeon map
function _getEmptyDungeonMap(sizeX, sizeY)
{
    return new Array(sizeY).fill(false).map(() => new Array(sizeX).fill(false));
}

function _generateRooms()
{
    while(_attemptRoomPlacement());
}

function _attemptRoomPlacement()
{
    // get room size
    var room = _getRandomRoomSize(),
        placed = false;

    // loop through attempts
    for(var i = 1; i < 120; i++)
    {
        // get random position within bounds
        _getRandomPosition(...room);

        // check for no collisions

    }

    return placed;
}

function _getRandomPosition(width, height) {
    console.log(width, height);
}