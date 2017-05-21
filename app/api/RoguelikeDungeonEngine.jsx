// ----- Rougelike Game Engine -----------------------------

// dungeon config
let config = {
    sizeX: 40,
    sizeY: 40,
    rooms: [
        7, // min
        10 // max
    ],
    potions: {
        max: 4,
        min: 7,
        value: 10
    },
    enemies: {
        max: 4,
        min: 7,
        damage: 10,
        health: {
            min: 10,
            max: 20
        }
    },
    weapons: {
        max: 2,
        min: 4,
        types: [{
            levels: [1],
            name: 'Fists',
            damage: 1
        },
        {
            levels: [1],
            name: 'Dagger',
            damage: 2
        },
        {
            levels: [1, 2],
            name: 'Nunchucks',
            damage: 3
        },
        {
            levels: [2],
            name: 'Sword',
            damage: 4
        },
        {
            levels: [2, 3],
            name: 'Pistol',
            damage: 5
        },
        {
            levels: [3],
            name: 'Shotgun',
            damage: 6
        },
        {
            levels: [3, 4],
            name: 'M-16',
            damage: 7
        },
        {
            levels: [4],
            name: 'Grenade',
            damage: 8
        },
        {
            levels: [4],
            name: 'Rocket Launcher',
            damage: 9
        }]
    },
    boss: {
        damage: 50,
        health: 200
    },
    start: {
        health: 100,
        xp: 0
    }
};

// directions of travel
let directions = ['N', 'S', 'W', 'E'];

// number of rooms
let numberOfRooms = 0;

// rooms in the game
let rooms = [];

// the current room to spawn other rooms off of
let currentRoom = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
};

// the map
let map = [];

// starting postion
let user = {
    health: config.start.health,
    weapon: config.weapons.types[0],
    xp: config.start.xp,
    position: [],
    messages: [
        'The game begins',
        'Kill the boss on level 4'
    ]
};

// exported object
module.exports = {
  // public functions
  generateMap: function(level)
  {
      map = _getEmptyDungeonMap(config.sizeX, config.sizeY);

      // generate the dungeon rooms
      _generateRooms();

      // add heath potions to map
      _addHealthPotionsToMap(level);

      // add enemies to the map
      _addEnemiesToMap(level);

      // add weapons to the map
      _addWeaponsToMap(level);

      // check for final level
      if(level === 4)
      {
          // add weapons to the map
          _addBossToMap();
      }
      else
      {
          // add portal to next level to the map
          _addPortalToMap();
      }

      // add character starting position to map
      _addStartingPositionToMap();

      // return the current game state
      return _getCurrentState();
  },
  moveLeft: function()
  {
      // attempt moving to another square
      _moveToSquare( (user.position[0] - 1), (user.position[1]) );

      // return the current game state
      return _getCurrentState();
  },
  moveRight: function()
  {
      // attempt moving to another square
      _moveToSquare( (user.position[0] + 1), (user.position[1]) );

      // return the current game state
      return _getCurrentState();
  },
  moveUp: function()
  {
      // attempt moving to another square
      _moveToSquare( (user.position[0]), (user.position[1] - 1) );

      // return the current game state
      return _getCurrentState();
  },
  moveDown: function()
  {
      // attempt moving to another square
      _moveToSquare( (user.position[0]), (user.position[1] + 1) );

      // return the current game state
      return _getCurrentState();
  }
};

// ----- private functions ---------------

function _getCurrentState()
{
    return {
        squares: map,
        user: user
    };
}

// generate random room size
function _getRandomRoomSize()
{
    // min & max room dimensions
    return [
        _getRandomOddInt(),
        _getRandomOddInt()
    ];
}

// return a random odd vlaue room size
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

// generate all of the rooms in for the level
function _generateRooms()
{
    // place the first room
    _placeFirstRoom();

    let targetNumberOfRooms = _randomIntFromInterval(config.rooms[0], config.rooms[0]);
    let attempts = 0;

    // add next level of rooms
    while(_addNextLevelRooms(targetNumberOfRooms) || attempts >= 10)
    {
        // make sure we don't get stuck in an infinite loop
        attempts++
    };
}

// place the first room in a random position on the grid
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

// generate a random room / element position
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

// attempt to spawn rooms from the 'current room' to the North, East, South & West
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

        // check for any room / boundary collisions & current number of rooms
        if( !_roomCollision(map, roomToPlace, positionAttempt) &&
            numberOfRooms !== targetNumberOfRooms)
        {
            // place the room if all is well
            _placeRoom(map, roomToPlace, positionAttempt);

            lastRoomPlaced = {
                width: roomToPlace[0],
                height: roomToPlace[1],
                x: positionAttempt[0],
                y: positionAttempt[1]
            };
            rooms.push({
                width: lastRoomPlaced.width,
                height: lastRoomPlaced.height,
                x: lastRoomPlaced.x,
                y: lastRoomPlaced.y
            });
            numberOfRooms++;

            // add a corridor between the current & just placed rooms
            _placeCorridor(currentRoom, lastRoomPlaced, compassPoints[i]);
        }
    }

    // set the current room to spawn off of
    if(lastRoomPlaced.height !== undefined)
    {
        currentRoom = {
            width: lastRoomPlaced.width,
            height: lastRoomPlaced.height,
            x: lastRoomPlaced.x,
            y: lastRoomPlaced.y
        };
    }
    else
    {
        let randomRoom = _randomIntFromInterval( 0, (rooms.length - 1) );

        // set current room to spawn from randomly
        currentRoom = {
            width: rooms[randomRoom].width,
            height: rooms[randomRoom].height,
            x: rooms[randomRoom].x,
            y: rooms[randomRoom].y
        };
    }
    
    if( numberOfRooms === targetNumberOfRooms )
    {
        return false;
    }

    return true;
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
function _placeRoom(map, room, positionAttempt)
{
    for(let x = positionAttempt[0]; x < positionAttempt[0] + room[0]; x++)
    {
        for(let y = positionAttempt[1]; y < positionAttempt[1] + room[1]; y++)
        {
            map[y][x] = {
                openSpace: true
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
            openSpace: true,
            element: {
                type: 'corridor',
                value: direction
            }
        };
}

// add heath potions to map
function _addHealthPotionsToMap(level)
{
    let potions = _randomIntFromInterval(config.potions.min, config.potions.max);
    let value = config.potions.value;

    // place each of the potions
    for(let i = 0; i < potions; i++)
    {
        // attempt placing a potion until we're successful
        while(!_addElementToMap('potion', value));
    }
}

// add enemies to the map
function _addEnemiesToMap(level)
{
    let enemies = _randomIntFromInterval(config.enemies.min, config.enemies.max);

    // place each of the enemies
    for(let i = 0; i < enemies; i++)
    {
        let value = {
            damage: config.enemies.damage,
            health: _randomIntFromInterval(config.enemies.health.min * level, config.enemies.health.max * level)
        };

        // attempt placing a enemy until we're successful
        while(!_addElementToMap('enemy', value));
    }
}

// add weapons to the map
function _addWeaponsToMap(level)
{
    let weapons = _randomIntFromInterval(config.weapons.min, config.weapons.max);
    let levelWeapons = config.weapons.types.filter(weapon => {
        if(weapon.levels.includes(level))
        {
            return weapon;
        }
    });

    // place each of the weapons
    for(let i = 0; i < weapons; i++)
    {
        // get a random weapon
        let weapon = _randomIntFromInterval(0, levelWeapons.length - 1);

        // attempt placing a potion until we're successful
        while(!_addElementToMap('weapon', {
            name: levelWeapons[weapon].name,
            damage: levelWeapons[weapon].damage
        }));
    }
}

// add weapons to the map
function _addBossToMap(level)
{
    let value = {
        damage: config.boss.damage,
        health: config.boss.health
    };

    // attempt placing a potion until we're successful
    while(!_addElementToMap('boss', value));
}

// add portal to the next level to the map
function _addPortalToMap(level)
{
    // attempt placing a potion until we're successful
    while(!_addElementToMap('portal', level));
}

// add character starting position to map
function _addStartingPositionToMap()
{
    // attempt placing a potion until we're successful
    while(!_addElementToMap('user', user));
}

// add an interactive game element to the map
function _addElementToMap(type, value)
{
    let [x, y] = _getRandomPosition(1, 1);

    if( map[y][x].openSpace &&              // not in a wall
        map[y][x].element === undefined &&  // no element currently present
        !_elementsSurrounding(x, y)         // not other elements next to this one
    )
    {
        map[y][x].element = {
            type: type,
            value: value
        };

        if( type === 'user' )
        {
            user.position = [x, y];
        }

        return true;
    }

    return false;
}

function _moveUserInMap(from, to)
{
    let [x1, y1] = from,
        [x2, y2] = to,
        userValue = map[y1][x1].element;

    // if square moving to has a game element set
    if( map[y2][x2].element )
    {
        console.log(map[y2][x2].element);
        switch(map[y2][x2].element.type)
        {
            case 'weapon':
                userValue.value.weapon = map[y2][x2].element.value;
                user.messages.push('[' + userValue.value.weapon.name + ' (' + userValue.value.weapon.damage + ')]: You picked up a new weapon');
                break;
            case 'potion':
                userValue.value.health = userValue.value.health + map[y2][x2].element.value;
                user.messages.push('[+10 health]: You picked up a potion');
                break;
            case 'enemy':
                //return;
                let userAttack = user.weapon.damage + user.xp;
                let enemyValue = map[y2][x2].element.value;

                // attack the enemy
                enemyValue.health -= userAttack;
                user.messages.push('[' + userAttack + ' attack, ' + ( enemyValue.health >= 0 ? enemyValue.health : 0 ) + ' remaining]: You attack the enemy');

                // check if enemy still alive
                if( enemyValue.health > 0 )
                {
                    // enemy retaliates
                    userValue.value.health -= enemyValue.damage;
                    user.health = userValue.value.health;
                    map[y1][x1].element.value.health = user.health;
                    user.messages.push('[-' + enemyValue.damage + ' health]: The enemy retaliates');
                    return;
                }

                // user gains experience
                userValue.value.xp += 2;
                user.messages.push('[+2 XP]: The enemy is defeated');
                break;
            case 'boss':
                //userValue.value.health = userValue.value.health + map[y2][x2].element.value;
                break;
            case 'portal':
                // reset the map
                return;
        }
    }

    // move to the new square
    map[y2][x2] = {
        openSpace: true,
        element: userValue
    };

    // clear the previous square
    map[y1][x1] = {
        openSpace: true
    };

    // update the user details
    user.position = to;
    user.weapon = userValue.value.weapon;
    user.xp = userValue.value.xp;
}

// attempt moving user to the specified square
function _moveToSquare(x, y)
{
    let newSquare = map[y][x];

    if(newSquare.openSpace)
    {
        _moveUserInMap(user.position, [x, y]);
    }
}

// check for any elements surrounding the specified square
function _elementsSurrounding(xEle, yEle)
{
    for(let x = (xEle - 1); x <= (xEle + 1); x++)
    {
        for(let y = (yEle - 1); y <= (yEle + 1); y++)
        {
            if( map[y][x].element )
            {
                return true;
            }
        }
    }

    return false;
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