var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        } else {
            // var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            // if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
            //   creep.moveTo(sources, { visualizePathStyle: { stroke: "#ffaa00" } });
            // }
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
                    creep.moveTo(container, {
                        visualizePathStyle: {
                            stroke: "#ffaa00"
                        }
                    });
                }
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {
                        visualizePathStyle: {
                            stroke: "#ffaa00"
                        }
                    });
                }
            }
        }
    }
};

module.exports = roleUpgrader;