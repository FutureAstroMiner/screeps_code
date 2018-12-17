var roleRefill = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy == 0 && creep.memory.doing) {
            creep.memory.doing = false;
            delete creep.memory.target;
        }

        if (creep.carry.energy == creep.carryCapacity && !creep.memory.doing) {
            creep.memory.doing = true;
            delete creep.memory.source;
        }

        if (creep.memory.doing) {
            var target = Game.getObjectById(creep.memory.target);
            if (target == null || target.energy == target.energyCapacity) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => {
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity
                        );
                    }
                });
                if (target != null) {
                    creep.memory.target = target.id;
                } else {
                    creep.memory.roll = "spare";
                }
            } else {
                var result = creep.transfer(target, RESOURCE_ENERGY);
                //creep.say(result);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        },
                        reusePath: 10
                    });

                } else if (result == OK || result == ERR_FULL || result == ERR_NOT_ENOUGH_RESOURCES) {
                    delete creep.memory.target;
                }
            }
        } else {
            var source = Game.getObjectById(creep.memory.source);
            if (source != null) {
                if (source.structureType == STRUCTURE_CONTAINER) {
                    if (source[RESOURCE_ENERGY] > creep.carryCapacity) {
                        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source, {
                                visualizePathStyle: {
                                    stroke: "#ffaa00"
                                },
                                reusePath: 10
                            });
                            //creep.say("container");
                        }
                    }
                } else {
                    result = creep.harvest(source);
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {
                            visualizePathStyle: {
                                stroke: "#ffaa00"
                            },
                            reusePath: 10
                        });
                        //creep.say("source");
                    } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                        delete creep.memory.source;
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
                    creep.memory.source = container.id;
                } else {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                        filter: source => {
                            return (
                                source.energy > creep.carryCapacity
                            );
                        }
                    });
                    creep.memory.source = source.id;
                }
            }
        }
    }
};

module.exports = roleRefill;