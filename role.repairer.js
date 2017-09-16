var roleRepairer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
      var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax / 4
      });

      if (targets) {
        if (creep.repair(targets) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets);
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
module.exports = roleRepairer;
