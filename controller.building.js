var buildingController = {
    /** @param {Room} room **/

    run: function(room) {
        var x_shaped_construction = [1, 1, 1, 3, 2, 2, 3, 1, 3, 3];
        var possible_extensions = [0, 0, 5, 10, 20, 30, 40, 50, 60];
        var possible_starts = [0, 0, 1, -4, -4, -4, -4, 0];
        // console.log("Initilised");
        if (!extension_layer) {
            var extension_layer = 0;
            room.memory.extention_layer = 0;
        } else {
            var extension_layer = room.memory.extention_layer;
        }
        var my_spawner_loc = room.find(FIND_MY_SPAWNS);
        // console.log("Initilised2");
        if (room.controller.level != room.memory.rcl) {
            room.memory.rcl = room.controller.level;
            console.log("Controller level changed to ", room.memory.rcl);
            var total_extensions = room.find(FIND_STRUCTURES, {
                filter: structure => { return (structure.structureType == STRUCTURE_EXTENSION); }
            });
            if (room.memory.rcl > 1 && total_extensions.length < possible_extensions[room.memory.rcl]) {
                //spawn extensions
                // console.log("Started spawning");
                var extensions_to_spawn = possible_extensions[room.memory.rcl] - total_extensions.length;
                for (var j = 0; extensions_to_spawn > 0; j++) {
                    var locx = my_spawner_loc[0].pos.x + possible_starts[extension_layer];
                    var locy = my_spawner_loc[0].pos.y + possible_starts[extension_layer + 1];
                    for (var i = 0; i < x_shaped_construction.length; i = i + 2) {
                        if (extensions_to_spawn > 0) {
                            var result = room.createConstructionSite(locx + x_shaped_construction[i],
                                locy + x_shaped_construction[i + 1],
                                STRUCTURE_EXTENSION);
                            if (result == 0) {
                                extensions_to_spawn--;
                            } else if (i > 3) {
                                extension_layer = extension_layer + 2;
                            }
                        }
                    }
                }
                if (extensions_to_spawn < 1) {
                    room.memory.build_extension = false;
                }
            } else {
                room.memory.build_extension = false;
            }
        }
    }
};

module.exports = buildingController;