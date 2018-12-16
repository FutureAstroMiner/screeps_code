var roleTower = {
    /** @param {Tower} tower **/

    run: function(tower) {

        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => {
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                            structure.hits < structure.hitsMax
                        );
                    }
        });

        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
};

module.exports = roleTower;