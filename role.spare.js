var roleSpare = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy == 0 && creep.memory.doing) {
            creep.memory.doing = false;
        }

        if (creep.carry.energy == creep.carryCapacity && !creep.memory.doing) {
            creep.memory.doing = true;
        }

        if (creep.memory.doing) {
            //find something to do, spare will not have a target
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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
                creep.memory.role = "refill";
            } else {
                //creep.say("Construction?")
                var construction = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (construction != null) {
                    creep.memory.role = "builder";
                    creep.memory.target = construction.id;
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {
                            visualizePathStyle: {
                                stroke: "#ffffff"
                            },
                            reusePath: 10
                        });
                    }
                }
            }
        } else {
            // TODO I am repeating code here!!!
            var target = Game.getObjectById(creep.memory.target);
            //creep.say(target.structureType == STRUCTURE_CONTAINER);
            if (target != null) {
                if (target.structureType == STRUCTURE_CONTAINER) {
                    if (target.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                        //creep.say("container");
                        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            //creep.say("range");
                            creep.moveTo(target, {
                                visualizePathStyle: {
                                    stroke: "#ffaa00"
                                },
                                reusePath: 10
                            });
                            //creep.say("container");
                        }
                    }
                } else {
                    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {
                            visualizePathStyle: {
                                stroke: "#ffaa00"
                            },
                            reusePath: 10
                        });
                        //creep.say("source");
                    }
                }
            } else {
                //creep.say("hi");
                var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] > creep.carryCapacity
                        );
                    }
                });
                if (container) {
                    creep.memory.target = container.id;
                } else {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                        filter: source => {
                            return (
                                source.energy > creep.carryCapacity
                            );
                        }
                    });
                    if (source != null) {
                        creep.memory.target = source.id;
                        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source, {
                                visualizePathStyle: {
                                    stroke: "#ffaa00"
                                },
                                reusePath: 10
                            });
                            //creep.say("source");
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleSpare;