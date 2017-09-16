var roleMiner = require("role.miner");
var roleUpgrader = require("role.upgrader");
var roleWorker = require("role.worker");
var roleRepairer = require("role.repairer");

var my_spawner_name = "Spawn1";
var my_spawner_loc = Game.spawns.Spawn1.pos;

module.exports.loop = function() {
  //clearing memory of dead creeps
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
    //setting room control level
    // if (Game.rooms.sim.controller.level != Memory.rcl) {
    //   Memory.rcl = Game.rooms.sim.controller.level;
    //   console.log("Controller level changed to ", Memory.rcl);
    //   if (Memory.rcl > 1) {
    //     //spawn extensions
    //     var extensions_to_spawn = Memory.extensions;
    //     var locx = my_spawner_loc.x;
    //     var locy = my_spawner_loc.y;
    //     if (extensions_to_spawn > 0) {
    //       if (extensions_to_spawn > 0 &&
    //         Game.rooms.sim.createConstructionSite(
    //           locx+1,
    //           locy,
    //           STRUCTURE_EXTENSION
    //         ) == 0
    //       ) {
    //         Memory.extensions--;
    //       }
    //       if (extensions_to_spawn > 0 &&
    //         Game.rooms.sim.createConstructionSite(
    //           locx-1,
    //           locy,
    //           STRUCTURE_EXTENSION
    //         ) == 0
    //       ) {
    //         Memory.extensions--;
    //       }
    //       if (extensions_to_spawn > 0 &&
    //         Game.rooms.sim.createConstructionSite(
    //           locx,
    //           locy+1,
    //           STRUCTURE_EXTENSION
    //         ) == 0
    //       ) {
    //         Memory.extensions--;
    //       }
    //       if (extensions_to_spawn > 0 &&
    //         Game.rooms.sim.createConstructionSite(
    //           locx,
    //           locy-1,
    //           STRUCTURE_EXTENSION
    //         ) == 0
    //       ) {
    //         Memory.extensions--;
    //       }
    //       locx++;
    //       locy++;
    //     }

    //     // var locx = 24;
    //     // var locy = 23;
    //     // var site_pos = new RoomPosition(
    //     //   my_spawner_loc.x,
    //     //   my_spawner_loc.x,
    //     //   my_spawner_loc.name
    //     // );
    //     var can_spawn_more = true;
    //     // while (can_spawn_more) {
    //     locx++;
    //     var result = Game.rooms.sim.createConstructionSite(
    //       locx,
    //       locy,
    //       STRUCTURE_EXTENSION
    //     );
    //     console.log(result);
    //     if (result == -14) {
    //       can_spawn_more = false;
    //     }
    //     // }
    //   }
    // }
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
      undefined,
      { role: "worker" }
    );
    console.log("Spawning new worker: " + newName);
  } else {
    if (worker.length >= 2 && upgrader.length < 1) {
      var newName = Game.spawns[my_spawner_name].createCreep(
        [WORK, CARRY, MOVE],
        undefined,
        { role: "upgrader" }
      );
      console.log("Spawning new upgrader: " + newName);
    } else {
      if (worker.length < 6) {
        var newName = Game.spawns[my_spawner_name].createCreep(
          [WORK, CARRY, MOVE],
          undefined,
          { role: "worker" }
        );
        console.log("Spawning new worker: " + newName);
      } else if (miner.length <1) {
      var newName = Game.spawns[my_spawner_name].createCreep(
          [WORK, WORK, WORK, WORK, WORK, MOVE],
          undefined,
          { role: "miner" }
        );
        console.log("Spawning new miner: " + newName);
        }
        if (repairer.length<1) {
        var newName = Game.spawns[my_spawner_name].createCreep(
          [WORK, CARRY, MOVE],
          undefined,
          { role: "repairer" }
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
      FIND_STRUCTURES,
      {
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
