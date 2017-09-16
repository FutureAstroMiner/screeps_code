var buildingController = {
    /** @param {Room} room **/

    run: function(room) {
        var x_shaped_construction = [1, 1, 1, 3, 2, 2, 3, 1, 3, 3];
        var possible_extensions = [0, 0, 5, 10, 20, 30, 40, 50, 60];
        var my_spawner_loc = room.find(FIND_MY_SPAWNS);
        if (room.controller.level != Memory.rcl) {
            Memory.rcl = room.controller.level;
            console.log("Controller level changed to ", Memory.rcl);
            var total_extensions = room.find(FIND_STRUCTURES, {
                filter: structure => { return (structure.structureType == STRUCTURE_EXTENSION); }
            });
            if (Memory.rcl > 1 && total_extensions.length < possible_extensions[Memory.rcl]) {
                //spawn extensions
                // console.log("Started spawning");
                var extensions_to_spawn = possible_extensions[Memory.rcl] - total_extensions.length;
                var locx = my_spawner_loc[0].pos.x++;
                var locy = my_spawner_loc[0].pos.y++;
                for (i = 0; i < x_shaped_construction.length; i = i + 2) {
                    console.log("Entered for loop. extensions_to_spawn is " + extensions_to_spawn);
                    console.log(room.find(FIND_MY_SPAWNS));
                    console.log(my_spawner_loc[0].x + ":" + my_spawner_loc[0].y);
                    console.log(locx + ";" + locy);
                    if (extensions_to_spawn > 0 && room.createConstructionSite(locx + x_shaped_construction[i],
                            locy + x_shaped_construction[i + 1],
                            STRUCTURE_EXTENSION) == 0) {
                        console.log("Attempted to spawn");
                        extensions_to_spawn--;
                    }
                }
            }
        }

    }
};

module.exports = buildingController;