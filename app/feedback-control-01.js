function createFeedbackControlDemo() {
    var width = window.innerWidth - 25;
    var height = window.innerHeight - 25;
    var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    
    function preload () {
        game.load.image('logo', 'phaser.png');
        game.load.image('processor', 'assets/sprites/processor.png');
        game.load.image('client', 'assets/sprites/client.png');
        game.load.image('payload', 'assets/sprites/payload.png');

    }

    var domain = Object();
    var d = domain;
    domain.clients = [];
    domain.processors = [];
    domain.requests = null;

    var fired = false;

    function create () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        domain.clients = createClients();
        domain.processors = createProcessors();
        domain.requests = createRequests();
    }

    function update() {
        if(!fired){
            console.log(d.clients[0].x);
            console.log(d.clients[0].y);
            var payload = game.add.sprite(d.clients[0].x, d.clients[0].y, 'payload')
            game.physics.enable(payload, Phaser.Physics.ARCADE);
            game.physics.arcade.moveToObject(payload, d.processors[0], null, 250);
            console.log("fired");
            fired = true;
        }
    }

    function createClients(){
        var clients = [];
        for(var x = 0; x < 10; x++){
            var c = game.add.sprite(game.world.width / 10 * x, 50, 'client');
            game.physics.enable(c, Phaser.Physics.ARCADE);
            clients.push(c);
        }
        return clients;
    } 

    function createProcessors() {
        var processors = [];
        for(var x = 0; x < 2; x++){
            var p = game.add.sprite(game.world.centerX - (x * 200), 
                                    game.world.height - 300, 'processor');
            game.physics.enable(p, Phaser.Physics.ARCADE);
            processors.push(p);
        }
        return processors;
    }

    function createRequests() {
        var requests = game.add.group();
        requests.enableBody = true;
        requests.physicsBodyType = Phaser.Physics.ARCADE;
        requests.createMultiple(domain.clients.length * 2, 'payload');
        return requests;
    }

    return game;
};
