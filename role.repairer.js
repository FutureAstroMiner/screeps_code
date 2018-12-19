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
            var repair = Game.getObjectById(creep.memory.repair);;
            if (repair == null || rapair.hits == repair.hitsMax) {
                repair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax / 4
                });
                if (repair != null) {
                    creep.memory.repair = repair.id;
                }
            }
            if (repair) {
                if (creep.repair(repair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repair);
                    creep.say("repairing");
                }
            } else {
                // TODO find closest construction site.
                var construction = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (construction) {
                    if (creep.build(construction) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction, {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                } else {
                    var emptie = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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
                    if (emptie) {
                        if (creep.transfer(emptie, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(emptie, {
                                visualizePathStyle: {
                                    stroke: "#ffffff"
                                }
                            });
                        }
                    } else {
                        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller, {
                                visualizePathStyle: {
                                    stroke: '#ffffff'
                                }
                            });
                        }
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
                    creep.moveTo(container, {
                        visualizePathStyle: {
                            stroke: "#ffaa00"
                        }
                    });
                    creep.say("container");
                }
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {
                        visualizePathStyle: {
                            stroke: "#ffaa00"
                        }
                    });
                    creep.say("source");
                }
            }
        }
    }
};
module.exports = roleRepairer;