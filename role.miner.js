var roleMiner = {
  /** @param {Creep} creep **/

  run: function(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        );
      }
    });

    //if creep is on a target and next to a sourse
    // mine
    //else move to a different atrget

    if (creep.pos.getRangeTo(targets[0]) == 0) {
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      creep.harvest(source);
    } else {
      creep.moveTo(creep.pos.findClosestByPath(targets));
    }
  }
};

module.exports = roleMiner;
