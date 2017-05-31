var assert = require('assert');
var Entity = require('../source/js/Entity.js');
var Tile = require('../source/js/Tile.js');

describe('Entity', function() {
    describe('#direction', function() {
        it('should return 3 when speed is 10', function() {
            let entity = new Entity({}, {mode: "testing"});

            entity.speedX = 10;
            entity.speedY = 10;

            entity._setDirection();

            assert.equal(3, entity.direction);
        });

        it('should return 1 when speed is negative 10', function() {
            let entity = new Entity({}, {mode: "testing"});

            entity.speedX = -10;
            entity.speedY = -10;

            entity._setDirection();

            assert.equal(1, entity.direction);
        });
    });

    describe('#state', function() {
        it('should return water when state is water', function() {
            let entity = new Entity({}, {mode: 'testing'});

            entity.setState('water');

            assert.equal('water', entity.state);
        });
    });
});

describe('Tile', function() {
    describe('#animationCounter', function() {
        it('should return 1 when frame is set to 1', function() {
            let tile = new Tile({}, {mode: 'testing'});

            tile.setFrame(1);

            assert.equal(1, tile.animationCounter);
        });
    });
});
