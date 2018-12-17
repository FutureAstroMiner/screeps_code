var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.doing && creep.carry.energy == 0) {
            creep.memory.doing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.doing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.doing = true;
            creep.say('🚧 build');
        }
        /*
                if (!creep.memory.building && !creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                    creep.memory.upgrading = true;
                    creep.say('⚡ upgrade');
                }
        */

        if (creep.memory.doing) {
            var target = Game.getObjectById(creep.memory.target);
            if (target == null) {
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target == null) {
                    delete creep.memory.target;
                }
            } else {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }

        } else {
            delete creep.memory.target;
            creep.memory.role = "spare";
        }
    }
};

module.exports = roleBuilder;