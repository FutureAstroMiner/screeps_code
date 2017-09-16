var roleWorker = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.carry.energy == 0 && creep.memory.doing) {
      creep.memory.doing = false;
    }

    if (creep.carry.energy == creep.carryCapacity && !creep.memory.doing) {
      creep.memory.doing = true;
    }

    if (creep.memory.doing) {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_CONTAINER ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      } else {
        var construction = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (construction.length > 0) {
          if (creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(construction[0], {
              visualizePathStyle: { stroke: "#ffffff" }
            });
          }
        } else {
          if (
            creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
          ) {
            creep.moveTo(creep.room.controller, {
              visualizePathStyle: { stroke: "#ffffff" }
            });
          }
        }
      }
    } else {
      var containers = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > creep.carryCapacity
          );
        }
      });
      if (containers.length > 0) {
        var source = creep.pos.findClosestByPath(containers);
        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
          creep.say("container");
        }
      } else {
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources, {
            visualizePathStyle: { stroke: "#ffaa00" }
          });
          creep.say("source");
        }
      }
    }
  }
};

module.exports = roleWorker;
