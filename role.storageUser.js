var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {

    run: function(creep) {
        
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (struc) => (struc.structureType == STRUCTURE_SPAWN ||
                                    struc.structureType == STRUCTURE_EXTENSION ||
                                    struc.structureType == STRUCTURE_TOWER
                                    )
                                    && struc.energy < struc.energyCapacity
            });
        
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
            if (structure != undefined) {
               if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move towards the spawn
                creep.moveTo(structure);
               } 
            }
            else {
                roleUpgrader.run(creep);

                //roleBuilder.run(creep);
            }

            
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            
            //if (structure != undefined) {
                var source = creep.room.storage;
                // try to harvest energy, if the source is not in range
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
            //}
            //else {
            //    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            //    // try to harvest energy, if the source is not in range
            //    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //    // move towards the source
            //    creep.moveTo(source);
            //    }
            //}
        }
    }
};