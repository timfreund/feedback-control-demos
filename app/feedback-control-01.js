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

    function create () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        domain.clients = createClients();
        domain.processors = createProcessors();
        domain.requests = createRequests();
        
        game.time.events.loop(Phaser.Timer.SECOND * 5, determineProcessorHealth, this);
    }

    function update() {
        sendRequests();
        game.physics.arcade.overlap(d.requests, d.processors, requestProcArrivalHandler, null, this);
        game.physics.arcade.overlap(d.requests, d.clients, requestClientArrivalHandler, null, this);
    }

    function requestProcArrivalHandler(request, processor) {
        request.tint = processor.tint;
        request.success = processor.health;
        game.physics.arcade.moveToObject(request, request.client, 500);
        // request.kill();
        // console.log(request.client.body.x + " " + request.client.body.y);
    }

    function requestClientArrivalHandler(request, client){
        request.kill();
    }

    function sendRequests(){
        d.clients.forEach(function(client) {
            // console.log(client.lastRequest + client.requestPeriod - game.time.now);
            if(client.lastRequest + client.requestPeriod <= game.time.now){
                client.lastRequest = game.time.now;
                request = d.requests.getFirstExists(false);
                request.reset(client.body.x, client.body.y + client.body.height + 2);
                request.client = client;
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
            c.requestPeriod = (Math.floor(Math.random() * (5 - 2)) + 2) * 1000;
            c.lastRequest = game.time.now;
        }
        return clients;
    } 

    function createProcessors() {
        var processors = game.add.group();
        processors.enableBody = true;
        processors.physicsBodyType = Phaser.Physics.ARCADE;
        for(var i = 0; i < 2; i++){
            var x = 25;
            if(i == 1){
                x = game.world.width - 200;
            }
            var p = processors.create(x,
                                      game.world.height - 300, 'processor');
            p.healthy = true;
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

    function determineProcessorHealth() {
        // At least one processor should be healthy at all times.
        // Both processors *can* be healthy at the same time.
        // This method will be called every 20 seconds
        var universalHealth = true;

        console.log("determineProcessorHealth");
        d.processors.forEach(function(processor) {
            if (universalHealth) {
                if (Math.random() > 0.50){
                    universalHealth = false;
                    processor.health = false;
                    processor.tint = 0xff0000;
                } else {
                    processor.health = true;
                    processor.tint = 0x00ff00;
                }
            } else {
                processor.health = true;
                processor.tint = 0x00ff00;
            }
        });
    }

    return game;
};
