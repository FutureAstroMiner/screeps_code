var roleMiner = {
    /** @param {Creep} creep **/

    run: function(creep) {


        //if creep is on a target and next to a sourse
        // mine
        //else move to a different atrget

        var target = Game.getObjectById(creep.memory.container.id);

        if (creep.pos.getRangeTo(target) == 0) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            creep.harvest(source);
        } else {
            creep.moveTo(target);
        }
    }
};

module.exports = roleMiner;