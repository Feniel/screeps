var roleBuilder = require('role.builder');

module.exports = {

    run: function(creep) {
        // if creep is bringing energy to the spawn but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
                //filter: (s) => s.hits < s.hitsMax || s.structureType == STRUCTURE_WALL && s.hits < 10000
            });

            // if we find one
            if (structure != undefined) {
                // try to repair it
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            // if we can't fine one
            else {
                roleBuilder.run(creep);
            }
            
        }
        // if creep is supposed to harvest energy from source
        else {
            var source = creep.room.storage;
                // try to harvest energy, if the source is not in range
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
        }
    }
};