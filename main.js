require('prototype.spawn')();

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleStorageUser = require('role.storageUser');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleLorry = require('role.lorry');
var roleMiner = require('role.miner');
var roleCollector = require('role.collector');
var roleCleaner = require('role.cleaner');
var roleReserver = require('role.reserver');
var roleClaimer = require('role.claimer');

var HOME = 'W2N5';

module.exports.loop = function () {
    //clear memory
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }
    
    
    
    for (let name in Game.creeps) {
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
        else if (creep.memory.role == 'storageUser') {
            roleStorageUser.run(creep);
        }
        else if (creep.memory.role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
        else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'lorry') {
            roleLorry.run(creep);
        }
        else if (creep.memory.role == 'collector') {
            roleCollector.run(creep);
        }
        else if (creep.memory.role == 'cleaner') {
            roleCleaner.run(creep);
        }
        else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if (creep.memory.role == 'reserver') {
            roleReserver.run(creep);
        }
    }
    
    //SPAWN
    var spawn = Game.spawns.Spawn1;
    var creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
    
    var minNumberOfHarvesters = 0;
    var minNumberOfUpgrader = 0;
    var minNumberOfRepairer = 1;
    var minNumberOfBuilder = 2;
    var minNumberOfWallRepairer = 1;
    var minNumberOfLorry = 1;
    var minNumberOfStorageUser = 5;
    var minNumberOfCollector = 1;
    var minNumberOfLongDistanceHarvestersW2N4 = 2;
    var minNumberOfLongDistanceHarvestersW3N5 = 2;
    var minNumberOfLongDistanceHarvestersW2N3 = 0;
    var minNumberOfLongDistanceHarvestersW2N6 = 2;
    
    var numberOfHarvesters = _.sum(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var numberOfUpgrader = _.sum(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var numberOfRepairer = _.sum(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var numberOfBuilder = _.sum(Game.creeps, (creep) => creep.memory.role == 'builder');
    var numberOfWallRepairer = _.sum(Game.creeps, (creep) => creep.memory.role == 'wallRepairer');
    var numberOfLorry = _.sum(Game.creeps, (creep) => creep.memory.role == 'lorry');
    var numberOfStorageUser = _.sum(Game.creeps, (creep) => creep.memory.role == 'storageUser');
    var numberOfCollector = _.sum(Game.creeps, (creep) => creep.memory.role == 'collector');
    var countMiner = _.sum(creepsInRoom, c => c.memory.role == 'miner');
    var countCleaner = _.sum(Game.creeps, creep => creep.memory.role == 'cleaner');
    var numberOfLongDistanceHarvestersW2N4 = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'W2N4');
    var numberOfLongDistanceHarvestersW3N5 = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'W3N5');
    var numberOfLongDistanceHarvestersW2N3 = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'W2N3');
    var numberOfLongDistanceHarvestersW2N6 = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'W2N6');
     
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var numberOfCreeps = _.sum(Game.creeps, (creep) => creep.memory.role != 'reserver');
    var sources = spawn.room.find(FIND_SOURCES);
    
    var roomsUnderReserve = ['W2N4', 'W3N5'];
    for (let i = 0; i < 2; i++) {
        var currentRoom = roomsUnderReserve[i];
        var reserver = _.filter(Game.creeps, (creep) => creep.memory.role == 'reserver' && creep.memory.target == currentRoom);
        if (reserver.length == 0 || reserver.ticksToLive < 150) {
            Game.spawns.Spawn1.createReserver(currentRoom);
        }
    }
    
    if(numberOfCreeps == 0) {
        Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
    }
    else if(numberOfCreeps < 24) {
        
        if (countMiner != 2) {
            for (let source of sources) {
                // if the source has no miner
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                    // check whether or not the source has a container
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    // if there is a container next to the source
                    if (containers.length > 0) {
                        // spawn a miner
                        spawn.createMiner(source.id);
                        break;
                    }
                }
            }
        }
        else if (numberOfHarvesters < minNumberOfHarvesters) {
            //Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], 'harvester'+Game.time, {role: 'harvester', working: false});
            Game.spawns.Spawn1.createCustomCreep(200, 'harvester');
        }
        else if (numberOfLorry < minNumberOfLorry) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            //Game.spawns.Spawn1.createCustomCreep(energy, 'lorry');  
            Game.spawns.Spawn1.createLorry(1000);
        }
        else if (numberOfStorageUser < minNumberOfStorageUser) {
            //fix
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            //Game.spawns.Spawn1.createCustomCreep(1000, 'storageUser');   
            Game.spawns.Spawn1.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK], 'storageUser' + Game.time, { role: 'storageUser', working: false });
        }
        else if (numberOfWallRepairer < minNumberOfWallRepairer) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            Game.spawns.Spawn1.createCustomCreep(1000, 'wallRepairer');    
        }
        else if (numberOfUpgrader < minNumberOfUpgrader) {
            //Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], 'upgrader'+Game.time, {role: 'upgrader', working: false});
            Game.spawns.Spawn1.createCustomCreep(1000, 'upgrader');
        }
        else if (numberOfRepairer < minNumberOfRepairer) {
            //Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], 'repairer'+Game.time, {role: 'repairer', working: false});
            Game.spawns.Spawn1.createCustomCreep(1000, 'repairer');
        }
        else if (numberOfBuilder < minNumberOfBuilder) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            Game.spawns.Spawn1.createCustomCreep(1000, 'builder');    
        }
        else if (numberOfCollector < minNumberOfCollector) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            Game.spawns.Spawn1.createCustomCreep(400, 'collector');    
        }
        else if (_.sum(Game.creeps, (creep) => creep.memory.role == 'cleaner' && creep.memory.target == 'W2N4') == 0) {
            Game.spawns.Spawn1.createCleaner('W2N4');  
        }
        else if (_.sum(Game.creeps, (creep) => creep.memory.role == 'cleaner' && creep.memory.target == 'W3N5') == 0) {
            Game.spawns.Spawn1.createCleaner('W3N5');  
        }
        else if (_.sum(Game.creeps, (creep) => creep.memory.role == 'cleaner' && creep.memory.target == 'W2N6') == 0) {
            Game.spawns.Spawn1.createCleaner('W2N6');  
        }
        else if (numberOfLongDistanceHarvestersW2N4 < minNumberOfLongDistanceHarvestersW2N4) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            Game.spawns.Spawn1.createLongDistanceHarvester(energy, 5, HOME, 'W2N4', 0);    
        }
        else if (numberOfLongDistanceHarvestersW2N3 < minNumberOfLongDistanceHarvestersW2N3) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            Game.spawns.Spawn1.createLongDistanceHarvester(energy, 3, HOME, 'W2N3', 0);    
        }
        else if (numberOfLongDistanceHarvestersW2N6 < minNumberOfLongDistanceHarvestersW2N6) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, HOME, 'W2N6', 0);    
        }
        else if (numberOfLongDistanceHarvestersW3N5 < minNumberOfLongDistanceHarvestersW3N5) {
            //Game.spawns.Spawn1.createCreep([], 'builder'+Game.time, {role: 'builder', working: false});
            Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, HOME, 'W3N5', 0);    
        }
        else {
            //Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
        }
    }
};