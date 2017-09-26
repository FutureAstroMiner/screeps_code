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
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: { stroke: "#ffffff" }
                    });
                }
            } else {
                var construction = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (construction) {
                    if (creep.build(construction) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction, {
                            visualizePathStyle: { stroke: "#ffffff" }
                        });
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {
                            visualizePathStyle: { stroke: "#ffffff" }
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
                    creep.moveTo(container, { visualizePathStyle: { stroke: "#ffaa00" } });
                    creep.say("container");
                }
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {
                        visualizePathStyle: { stroke: "#ffaa00" }
                    });
                    creep.say("source");
                }
            }
        }
    }
};

module.exports = roleWorker;