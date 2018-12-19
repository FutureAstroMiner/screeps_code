require('prototype.spawn')();
var roleMiner = require("role.miner");
var roleUpgrader = require("role.upgrader");
var roleWorker = require("role.worker");
var roleRepairer = require("role.repairer");
var buildingController = require("controller.building");
var roleTower = require("role.tower");
var roleSpare = require("role.spare");
var roleRefill = require("role.refill");
var roleBuilder = require("role.builder");

var my_spawner_name = "Spawn1";
var my_spawner_loc = Game.spawns.Spawn1.pos;

var possible_extensions = [0, 0, 5, 10, 20, 30, 40, 50, 60];



module.exports.loop = function() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log("Clearing non-existing creep memory:", name);
        }
    }
    // Maintain a list of construction sites???  

    //setting room control level
    for (var roomName in Game.rooms) { //Loop through all rooms your creeps/structures are in
        var room = Game.rooms[roomName];
        if (Game.time % 20 == 0) {

            if (room.controller.level != room.memory.rcl) {
                room.memory.build_extension = true;

            }
            buildingController.run(room);
        }
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            });

        for (var id in towers) {
            var tower = towers[id];
            roleTower.run(tower);
        }
    }

    var upgrader = _.filter(Game.creeps, creep => creep.memory.role == "upgrader");
    var worker = _.filter(Game.creeps, creep => creep.memory.role == "worker");
    // console.log("Workers/Upgraders: " + worker.length + "/" + upgrader.length);
    var miner = _.filter(Game.creeps, creep => creep.memory.role == "miner");
    var repairer = _.filter(Game.creeps, creep => creep.memory.role == "repairer");

    var creeps = _.filter(Game.creeps);

    var containers = Game.spawns[my_spawner_name].room.find(FIND_STRUCTURES, {
        filter: structure => {
            return (structure.structureType == STRUCTURE_CONTAINER);
        }
    });

    var energy = Game.spawns[my_spawner_name].energyCapacity;


    if (creeps.length < 2 && energy > 200) {
        var newName = Game.spawns[my_spawner_name].createCustomCreep(energy, 'spare');
        console.log("Spawning new spare: " + newName);
    } else if (creeps.length >= 2 && upgrader.length < 1) {
        var newName = Game.spawns[my_spawner_name].createCustomCreep(energy, 'upgrader');
        console.log("Spawning new upgrader: " + newName);
    } else if (repairer.length < 1) {
        var newName = Game.spawns[my_spawner_name].createCustomCreep(energy, 'repairer');
        console.log("Spawning new repairer: " + newName);
    } else if (creeps.length >= 2 && miner.length < containers.length) {
        for (let c of containers) {
            if (!_.some(miner, m => m.memory.role == 'miner' && m.memory.container.id == c.id)) {
                var newName = Game.spawns[my_spawner_name].createCreep(
                    [WORK, WORK, WORK, WORK, WORK, MOVE],
                    undefined, {
                        role: "miner",
                        container: c
                    }
                );
                console.log("Spawning new miner: " + newName);
            }
        }
    } else if (creeps.length < 10) {
        var newName = Game.spawns[my_spawner_name].createCustomCreep(energy, 'spare');
        console.log("Spawning new spare: " + newName);
    } else {
        var newName = Game.spawns[my_spawner_name].createCreep([WORK, CARRY, MOVE], undefined, {
            role: 'spare'
        });
        console.log("Spawning new cheep spare: " + newName);
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
        if (creep.memory.role == "spare") {
            roleSpare.run(creep);
        }
        if (creep.memory.role == "refill") {
            roleRefill.run(creep);
        }
        if (creep.memory.role == "builder") {
            roleBuilder.run(creep);
        }
    }
}