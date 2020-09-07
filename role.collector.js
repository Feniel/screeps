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

        // if creep is supposed to transfer energy to the spawn
        if (creep.memory.working == true) {
            var structure = creep.room.storage;
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move towards the spawn
                creep.moveTo(structure);
            }

            
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if (source != undefined) {
                // try to harvest energy, if the source is not in range
                if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
            }
            else {
                //creep.moveTo(9, 27);
            }
        }
    }
};