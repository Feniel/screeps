module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if (creep.room.name == creep.memory.target) {
            var target = creep.room.find(FIND_HOSTILE_CREEPS);
            if (target == undefined) {
                target = creep.room.find(FIND_HOSTILE_STRUCTURES);
            }
            if (target.length != 0) {
                if (creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(target[0]);
                } 
            }
            else {
                target = creep.room.controller;
                creep.moveTo(target);
            }
        }  
        else {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    }
};