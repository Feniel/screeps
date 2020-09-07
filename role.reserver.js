module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if (creep.room.name == creep.memory.target) {
            target = creep.room.controller;
                if (creep.reserveController(target) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(target);
                }
        }  
        else {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    }
};