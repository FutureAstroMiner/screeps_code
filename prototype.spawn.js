module.exports = function() {
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
        var numberOfParts = Math.floor(energy / 200);
        var parts = [];
        for (var i = 0; i < numberOfParts; i++) {
            parts.push(WORK);
        }
        for (var i = 0; i < numberOfParts; i++) {
            parts.push(CARRY);
        }
        for (var i = 0; i < numberOfParts; i++) {
            parts.push(MOVE);
        }

        return this.createCreep(parts, undefined, {
            role: roleName,
            working: false
        });
    }
}