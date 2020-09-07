module.exports = function() {
    StructureSpawn.prototype.createCustomCreep = 
        function(energy, roleName) {
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
            
            return this.createCreep(body, roleName + Game.time, { role: roleName, working: false });
        };
        
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createLongDistanceHarvester =
        function (energy, numberOfWorkParts, home, target, sourceIndex) {
            // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
            var body = [];
            for (let i = 0; i < numberOfWorkParts; i++) {
                body.push(WORK);
            }

            // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
            energy -= 150 * numberOfWorkParts;

            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body
            return this.createCreep(body,target + 'longDistanceHarvester' + Game.time, {
                role: 'longDistanceHarvester',
                home: home,
                target: target,
                sourceIndex: sourceIndex,
                working: false
            });
        }; 
        
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createMiner =
        function (sourceId) {
            return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'miner' + sourceId,
                                    { role: 'miner', sourceId: sourceId });
        };
        
    StructureSpawn.prototype.createLorry =
        function (energy) {
            // create a body with twice as many CARRY as MOVE parts
            var numberOfParts = Math.floor(energy / 150);
            var body = [];
            for (let i = 0; i < numberOfParts * 2; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body and the role 'lorry'
            return this.createCreep(body, 'lorry', { role: 'lorry', working: false });
        };
        
    StructureSpawn.prototype.createCleaner =
        function (target) {
            return this.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH], target + 'cleaner',
                                    { role: 'cleaner', target: target });
        }; 
        
    StructureSpawn.prototype.createReserver =
        function (target) {
            return this.createCreep([MOVE, MOVE, MOVE, MOVE, CLAIM], target + 'reserver',
                                    { role: 'reserver', target: target });
        };
        
    StructureSpawn.prototype.createClaimer =
        function (target) {
            return this.createCreep([MOVE, MOVE, MOVE, MOVE, CLAIM], target + 'claimer',
                                    { role: 'claimer', target: target });
        };
};