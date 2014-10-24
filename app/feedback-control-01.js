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
    game.domain = domain;
    domain.clients = null;
    domain.processors = null;
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
            var payload = game.add.sprite(d.clients.children[0].x, d.clients.children[0].y, 'payload')
            game.physics.enable(payload, Phaser.Physics.ARCADE);
            game.physics.arcade.moveToObject(payload, d.processors.children[0], null, 250);
            fired = true;
        }


        sendRequests();

        game.physics.arcade.overlap(d.requests, d.processors, requestArrivalHandler, null, this);
    }

    function requestArrivalHandler(request, processor) {
        request.kill();

    }

    function sendRequests(){
        d.clients.forEach(function(client) {
            // console.log(client.lastRequest + client.requestPeriod - game.time.now);
            if(client.lastRequest + client.requestPeriod <= game.time.now){
                client.lastRequest = game.time.now;
                request = d.requests.getFirstExists(false);
                request.reset(client.body.x, client.body.y);
                game.physics.arcade.moveToObject(request, d.processors.children[0], 500);
            }
        });
    }

    function createClients(){
        var clients = game.add.group();
        clients.enableBody = true;
        clients.physicsBodyType = Phaser.Physics.ARCADE;

        for(var x = 0; x < 10; x++){
            var c = clients.create(game.world.width / 10 * x, 50, 'client');
            c.requestPeriod = (Math.floor(Math.random() * (10 - 5)) + 5) * 1000;
            console.log(c.requestPeriod);
            c.lastRequest = game.time.now;
        }
        return clients;
    } 

    function createProcessors() {
        var processors = game.add.group();
        processors.enableBody = true;
        processors.physicsBodyType = Phaser.Physics.ARCADE;
        for(var x = 0; x < 2; x++){
            processors.create(game.world.centerX - (x * 200), 
                              game.world.height - 300, 'processor');
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
