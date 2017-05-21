// ----- Rougelike Game Engine -----------------------------

// dungeon config
let config = {
    sizeX: 40,
    sizeY: 40,
    minRooms: 7,
    maxRooms: 10
};

// directions of travel
let directions = ['N', 'S', 'W', 'E'];

// number of rooms
let numberOfRooms = 0;

let currentRoom = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
};

// the map
let map = [];

// exported object
module.exports = {
  // public functions
  generateMap: function()
  {
      map = _getEmptyDungeonMap(config.sizeX, config.sizeY);

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
    let min = 2,
        max = 4;

    return (Math.floor(Math.random() * (max - min + 1)) + min)  * 2 + 1;
}

// get an empty dungeon map
function _getEmptyDungeonMap(sizeX, sizeY)
{
    return new Array(sizeY).fill(false).map(() => new Array(sizeX).fill(
        {
            openSpace: false
        }
    ));
}

function _generateRooms()
{
    // place the first room
    _placeFirstRoom();

    let targetNumberOfRooms = _randomIntFromInterval(config.minRooms, config.maxRooms);

    // add next level of rooms
    while(_addNextLevelRooms(targetNumberOfRooms)){}
}

function _placeFirstRoom()
{
    // get room size
    let room = _getRandomRoomSize();

    // get random position within bounds
    let positionAttempt = _getRandomPosition(...room);
    
    // place the first room on the grid
    _placeRoom(map, room, positionAttempt);

    // set the last room position
    currentRoom = {
        width: room[0],
        height: room[1],
        x: positionAttempt[0],
        y: positionAttempt[1]
    };
    numberOfRooms = 1;
}

// generate a random room position
function _getRandomPosition(width, height)
{
    let withinX = config.sizeX - width - 1,
        withinY = config.sizeY - height - 1;

    // return top-left position
    return [
        _randomIntFromInterval(1, withinX),
        _randomIntFromInterval(1, withinY)
    ];
}

// get a random integer within a range
function _randomIntFromInterval(min, max)
{
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

function _addNextLevelRooms(targetNumberOfRooms)
{
    console.log(targetNumberOfRooms);

    // object to hold details of the last room to be placed
    let lastRoomPlaced = {};

    // attempt to add room at each 4 compass points (1px from last room)
    let compassPoints = _shuffleArray(directions);

    // loop through the random compass points
    for(let i = 0; i < compassPoints.length; i++)
    {
        // get a random room for attempted placement
        let roomToPlace = _getRandomRoomSize(),
            positionAttempt = [0, 0];

        switch(compassPoints[i])
        {
            case 'N': // north
                // calc y position of room
                positionAttempt[1] = currentRoom.y - 1 - roomToPlace[1];

                // calc random x position of room
                positionAttempt[0] = _randomIntFromInterval(
                    currentRoom.x - roomToPlace[0] + 1,
                    currentRoom.x + currentRoom.width - 1
                );
                break;
            case 'E': // east
                // calc y position of room
                positionAttempt[1] = _randomIntFromInterval(
                    currentRoom.y - roomToPlace[1] + 1,
                    currentRoom.y + currentRoom.height - 1
                );

                // calc random x position of room
                positionAttempt[0] = currentRoom.x + currentRoom.width + 1;
                break;
            case 'S': // south
                // calc y position of room
                positionAttempt[1] = currentRoom.y + currentRoom.height + 1;

                // calc random x position of room
                positionAttempt[0] = _randomIntFromInterval(
                    currentRoom.x - roomToPlace[0] + 1,
                    currentRoom.x + currentRoom.width - 1
                );
                break;
            case 'W': // west
                // calc y position of room
                positionAttempt[1] = _randomIntFromInterval(
                    currentRoom.y - roomToPlace[1] + 1,
                    currentRoom.y + currentRoom.height - 1
                );

                // calc random x position of room
                positionAttempt[0] = currentRoom.x - roomToPlace[0] - 1;
                break;
        }

        let colours = {
            N: 'magenta',
            E: 'cyan',
            S: 'yellow',
            W: 'purple'
        };

        // check for any room / boundary collisions & current number of rooms
        if( !_roomCollision(map, roomToPlace, positionAttempt) &&
            numberOfRooms !== targetNumberOfRooms)
        {
            // place the room if all is well
            _placeRoom(map, roomToPlace, positionAttempt, colours[compassPoints[i]]);

            lastRoomPlaced = {
                width: roomToPlace[0],
                height: roomToPlace[1],
                x: positionAttempt[0],
                y: positionAttempt[1]
            };
            numberOfRooms++;

            // add a corridor between the current & just placed rooms
            _placeCorridor(currentRoom, lastRoomPlaced, compassPoints[i]);
        }
    }

    console.log(lastRoomPlaced);

    return false;
}

// check for a collision of rooms (attempted position already populated)
function _roomCollision(map, room, positionAttempt)
{
    // check for invalid position values
    if( positionAttempt[0] <= 0 || 
        positionAttempt[1] <= 0 ||
        ( positionAttempt[0] + room[0] ) >= (map[0].length - 1) ||
        ( positionAttempt[1] + room[1] ) >= (map.length - 1) )
    {
        return true;
    }

    // check for collisions within the room itself
    for(let x = positionAttempt[0]; x < positionAttempt[0] + room[0]; x++)
    {
        for(let y = positionAttempt[1]; y < positionAttempt[1] + room[1]; y++)
        {
            if(map[y][x].openSpace)
            {
                return true;
            }   
        }
    }

    return false;
}

// place room in the grid (mark squares as populated)
function _placeRoom(map, room, positionAttempt, colour = '')
{
    for(let x = positionAttempt[0]; x < positionAttempt[0] + room[0]; x++)
    {
        for(let y = positionAttempt[1]; y < positionAttempt[1] + room[1]; y++)
        {
            map[y][x] = {
                openSpace: true,
                colour: colour
            };
        }
    }
}

// place a connecting corridor between two rooms
function _placeCorridor(firstRoom, secondRoom, direction)
{
    // variables to hold corridor location
    let x = 0,
        y = 0;

    switch(direction)
        {
            case 'N': // 2nd north of 1st
                y = firstRoom.y - 1;
                x = _randomIntFromInterval(
                    Math.max(firstRoom.x, secondRoom.x),
                    Math.min(firstRoom.x + firstRoom.width, secondRoom.x + secondRoom.width) - 1
                );
                break;
            case 'E': // 2nd east of 1st
                x = firstRoom.x + firstRoom.width;
                y = _randomIntFromInterval(
                    Math.max(firstRoom.y, secondRoom.y),
                    Math.min(firstRoom.y + firstRoom.height, secondRoom.y + secondRoom.height) - 1
                );
                break;
            case 'S': // 2nd south of 1st
                y = firstRoom.y + firstRoom.height;
                x = _randomIntFromInterval(
                    Math.max(firstRoom.x, secondRoom.x),
                    Math.min(firstRoom.x + firstRoom.width, secondRoom.x + secondRoom.width) - 1
                );
                break;
            case 'W': // 2nd west of 1st
                x = firstRoom.x - 1;
                y = _randomIntFromInterval(
                    Math.max(firstRoom.y, secondRoom.y),
                    Math.min(firstRoom.y + firstRoom.height, secondRoom.y + secondRoom.height) - 1
                );
                break;
        }

        // place the corridor
        map[y][x] = {
            openSpace: true
        };
}

// shuffle an array
function _shuffleArray(array)
{
  let currentIndex = array.length, temporaryValue, randomIndex;

  // while still elements to shuffle
  while (0 !== currentIndex)
  {
    // pick remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // swap with current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// take the last placed room & start again