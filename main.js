var roleMiner = require("role.miner");
var roleUpgrader = require("role.upgrader");
var roleWorker = require("role.worker");
var roleRepairer = require("role.repairer");

//Should this go in the main Loop???

// Source.prototype.memory = undefined;

// for (var roomName in Game.rooms) { //Loop through all rooms your creeps/structures are in
//     var room = Game.rooms[roomName];
//     if (!room.memory.spawns) {
//         room.memory.spawns = room.find(FIND_MY_SPAWNS); // array of all my spawns in their rooms
//         var sources = room.find(FIND_SOURCES);
//         for (var sourse in sources){
//           //Create a container
//           var pos_x = sourse.x;
//           var pos_y = sourse.y;
//           var sites = sourse.room.lookAtArea(pos_y--, pos_x--, pos_y++, pos_x++)

//           for (s in sites) {
//             if (s["terrain"] != "wall"){
//               room.createConstructionSite(s.pos, STRUCTURE_CONTAINER);
//               break;
//             }
//           }
//         }
//     }
// }



var my_spawner_name = "Spawn1";
var my_spawner_loc = Game.spawns.Spawn1.pos;

var x_shaped_construction = [1, 1, 1, 3, 2, 2, 3, 1, 3, 3];
var possible_extensions = [0, 0, 5, 10, 20, 30, 40, 50, 60];


module.exports.loop = function() {
    //clearing memory of dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory:", name);
        }
    }
    //setting room control level
    for (var roomName in Game.rooms) { //Loop through all rooms your creeps/structures are in
        var room = Game.rooms[roomName];
        if (room.controller.level != Memory.rcl) {
            Memory.rcl = room.controller.level;
            console.log("Controller level changed to ", Memory.rcl);
            var total_extensions = room.find(FIND_STRUCTURES, {
                filter: structure => { return (structure.structureType == STRUCTURE_EXTENSION); }
            });
            if (Memory.rcl > 1 && total_extensions.length < possible_extensions[Memory.rcl]) {
                //spawn extensions
                var extensions_to_spawn = possible_extensions[Memory.rcl] - total_extensions.length;
                var locx = my_spawner_loc.x++;
                var locy = my_spawner_loc.y++;
                for (i = 0; i < x_shaped_construction.length; i = i + 2) {
                    if (extensions_to_spawn > 0 &&
                        room.createConstructionSite(
                            locx + x_shaped_construction[i],
                            locy + x_shaped_construction[i + 1],
                            STRUCTURE_EXTENSION) == 0) {
                        extensions_to_spawn--;
                    }
                }
            }
        }
    }

    var upgrader = _.filter(
        Game.creeps,
        creep => creep.memory.role == "upgrader"
    );
    var worker = _.filter(Game.creeps, creep => creep.memory.role == "worker");
    // console.log("Workers/Upgraders: " + worker.length + "/" + upgrader.length);
    var miner = _.filter(Game.creeps, creep => creep.memory.role == "miner");
    var repairer = _.filter(Game.creeps, creep => creep.memory.role == "repairer");

    if (worker.length < 2) {
        var newName = Game.spawns[my_spawner_name].createCreep(
            [WORK, CARRY, MOVE],
            undefined, { role: "worker" }
        );
        console.log("Spawning new worker: " + newName);
    } else {
        if (worker.length >= 2 && upgrader.length < 1) {
            var newName = Game.spawns[my_spawner_name].createCreep(
                [WORK, CARRY, MOVE],
                undefined, { role: "upgrader" }
            );
            console.log("Spawning new upgrader: " + newName);
        } else {
            if (worker.length < 6) {
                var newName = Game.spawns[my_spawner_name].createCreep(
                    [WORK, CARRY, MOVE],
                    undefined, { role: "worker" }
                );
                console.log("Spawning new worker: " + newName);
            } else if (miner.length < 1) {
                var newName = Game.spawns[my_spawner_name].createCreep(
                    [WORK, WORK, WORK, WORK, WORK, MOVE],
                    undefined, { role: "miner" }
                );
                console.log("Spawning new miner: " + newName);
            }
            if (repairer.length < 1) {
                var newName = Game.spawns[my_spawner_name].createCreep(
                    [WORK, CARRY, MOVE],
                    undefined, { role: "repairer" }
                );
                console.log("Spawning new repairer: " + newName);
            }
        }
    }
    //   var miner = _.filter(Game.creeps, creep => creep.memory.role == "miner");
    //   if (miner < 2) {
    //     var newName = Game.spawns[my_spawner_name].createCreep(
    //       [WORK, WORK, WORK, WORK, WORK, MOVE],
    //       undefined,
    //       { role: "miner" }
    //     );
    //     console.log("Spawning new miner: " + newName);
    //   }

    var tower = Game.getObjectById("8d99f1cfa54380282eb718b6");
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(
            FIND_STRUCTURES, {
                filter: structure => structure.hits < structure.hitsMax
            }
        );
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == "worker") {
            roleWorker.run(creep);
        }
        if (creep.memory.role == "upgrader") {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == "miner") {
            roleMiner.run(creep);
        }
        if (creep.memory.role == "repairer") {
            roleRepairer.run(creep);
        }
    }
};