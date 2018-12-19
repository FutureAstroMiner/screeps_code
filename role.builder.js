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
            if (Game.time % 20 == 0) {
                delete creep.memory.target;
            }
            var target = Game.getObjectById(creep.memory.target);
            if (target == null) {
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target == null) {
                    delete creep.memory.target;
                    creep.memory.role = "spare";
                } else {
                    creep.memory.target = target.id;
                }
            } else {
                var result = creep.build(target);
                //creep.say(result);
                if (result == ERR_NOT_IN_RANGE) {
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