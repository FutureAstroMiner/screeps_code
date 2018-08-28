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
          //find something to fill
          var target;
            if (creep.memory.target == null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => {
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity
                        );
                    }
                });
                if (target != null){
                  creep.memory.target = target.id;
                }
                
            } else {
              // I already have a target to fill so load that if it is applicable
              target = Game.getObjectById(creep.memory.target);
              // if I didn't find my original target then delete my memory of it
              if (target==null) {delete creep.memory.target}
            }

            if (target != null) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    if (creep.moveTo(target, {
                            visualizePathStyle: { stroke: "#ffffff" },
                            reusePath: 10
                        }) != 0) {
                      // any statys code other than 0 (ok) and my target is not valid so I should delete the old one
                        delete creep.memory.target;
                    };
                }
            } else {
              // Todo Reuse code for having a target to build
                var construction = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (construction) {
                    if (creep.build(construction) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction, {
                            visualizePathStyle: { stroke: "#ffffff" }, reusePath: 10
                        });
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {
                            visualizePathStyle: { stroke: "#ffffff" }, reusePath: 10
                        });
                    }
                }
            }
        } else {
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store[RESOURCE_ENERGY] > creep.carryCapacity
                    );
                }
            });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: "#ffaa00" }, reusePath: 10 });
                    creep.say("container");
                }
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {
                        visualizePathStyle: { stroke: "#ffaa00" }, reusePath: 10
                    });
                    creep.say("source");
                }
            }
        }
    }
};

module.exports = roleWorker;