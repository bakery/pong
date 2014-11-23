var box2d = {
    b2Vec2:             Box2D.Common.Math.b2Vec2,
    b2BodyDef:          Box2D.Dynamics.b2BodyDef,
    b2Body:             Box2D.Dynamics.b2Body,
    b2FixtureDef:       Box2D.Dynamics.b2FixtureDef,
    b2Fixture:          Box2D.Dynamics.b2Fixture,
    b2World:            Box2D.Dynamics.b2World,
    b2MassData:         Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape:     Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape:      Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw:        Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef:    Box2D.Dynamics.Joints.b2MouseJointDef,
    b2PrismaticJointDef:Box2D.Dynamics.Joints.b2PrismaticJointDef
};

Game = {

    init : function(){
        this.stage = new createjs.Stage(document.getElementById("canvas"));
        this.setupPhysics();
        
        window.setInterval(_.bind(this.update,this), 1000 / 60);
    },

    update : function(){
        this.world.Step(1 / 60, 10, 10);
        this.world.DrawDebugData();
        this.world.ClearForces();
    },

    addPlayer : function(player){
        var thePlayer = _.extend({}, player);
        var playerId = player._id;

        //  this player is already added
        if (this._players[playerId]) return;

        var x = 20;
        if (_.keys(this._players).length==1)   x=780;

        var fixDef = new box2d.b2FixtureDef();
        var bodyDef = new box2d.b2BodyDef();
        
        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.density = 50;
        fixDef.friction = 0;
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        fixDef.shape.SetAsBox(10/this.SCALE, 40/this.SCALE);
        bodyDef.position.Set(x/this.SCALE, 120/this.SCALE);
        bodyDef.fixedRotation = true;

        thePlayer.body = this.world.CreateBody(bodyDef);
        thePlayer.body.CreateFixture(fixDef);

        this._players[playerId] = thePlayer;

        // create da joint and smooke it
        var md = new box2d.b2MouseJointDef();
        md.bodyA = this.world.GetGroundBody();
        md.bodyB = thePlayer.body;
        // md.target.Set(mouseX, mouseY);
        md.target.Set(thePlayer.body.GetPosition().x, 800/2);
        md.collideConnected = true;
        md.maxForce = 300.0 * thePlayer.body.GetMass();
        mouseJoint = this.world.CreateJoint(md);
        thePlayer.body.SetAwake(true);

        return playerId;
    },

    /**
     * move player
     * @param  {string} playerId player id
     * @param  {int} position position in pixels
     */
    movePlayer : function(playerId, positionY){
        // if(isMouseDown && (!mouseJoint)) {
        //    var body = getBodyAtMouse();
        //    if(body) {
            
        //    }
        // }

        // if(mouseJoint) {
        //    if(isMouseDown) {
        //       // mouseJoint.SetTarget(new box2d.b2Vec2(mouseX, mouseY));
        //         mouseJoint.SetTarget(new box2d.b2Vec2(_player1.body.GetPosition().x, mouseY));
              
        //    } else {
        //       this.world.DestroyJoint(mouseJoint);
        //       mouseJoint = null;
        //    }
        // }

        var thePlayer = this._players[playerId];

        mouseJoint.SetTarget(
            new box2d.b2Vec2(thePlayer.body.GetPosition().x,positionY)
        );
    },

    setupPhysics : function(){
        this.world = new box2d.b2World( new box2d.b2Vec2(0, 0), true); //   true is body sleep (we won't need that)

    //  create ground
        var fixDef = new box2d.b2FixtureDef();
        var bodyDef = new box2d.b2BodyDef();
        fixDef.shape = new box2d.b2PolygonShape();
        bodyDef.type = box2d.b2Body.b2_staticBody;

        fixDef.density = 0;
        fixDef.friction = 0;
        
        fixDef.shape.SetAsBox(400/this.SCALE, 10/this.SCALE);
        //  bottom
        bodyDef.position.Set(400/this.SCALE, 600/this.SCALE);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        //  top
        bodyDef.position.Set(400/this.SCALE, 0/this.SCALE);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        fixDef.shape.SetAsBox(10/this.SCALE, 600/this.SCALE);
        //  left
        bodyDef.position.Set(0/this.SCALE, 600/this.SCALE);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //  right
        bodyDef.position.Set(800/this.SCALE, 600/this.SCALE);   
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        
        // create the ball
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.fixedRotation = false;
        fixDef.shape = new box2d.b2CircleShape(10/this.SCALE);
        bodyDef.position.Set (800/2/this.SCALE, 600/2/this.SCALE);
        fixDef.restitution = 1.01;  //  speed up bounciness
        this._ball = {};
        this._ball.body = this.world.CreateBody(bodyDef);
        this._ball.body.CreateFixture(fixDef);

        this._ball.body.ApplyForce( new box2d.b2Vec2((Math.random()*5+1)*100,(Math.random()*5+1)*100),  new box2d.b2Vec2(100, 100));

        //  setup debug draw
        var debugDraw = new box2d.b2DebugDraw();
        debugDraw.SetSprite(this.stage.canvas.getContext('2d'));
        debugDraw.SetDrawScale(this.SCALE);
        debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    },

    SCALE : 30,
    stage: null,
    world: null,
    _players: {},
    _ball: null
};

Template.gameCanvas.rendered = function(){

    var inputStream = new Meteor.Stream('inputs');
    inputStream.on('move', function(move) {
        console.log('got move', move);
    });


    Game.init();

    this.autorun(_.bind(function(){
        // console.log(this.data.players.fetch());
        _.each(this.data.players.fetch(), function(p){
            Game.addPlayer(p);
        });
    },this));

};


        //mouse         
         // var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
         // var canvasPosition = getElementPosition(document.getElementById("canvas"));
         
         // document.addEventListener("mousedown", function(e) {
         //    isMouseDown = true;
         //    handleMouseMove(e);
         //    document.addEventListener("mousemove", handleMouseMove, true);
         // }, true);
         
         // document.addEventListener("mouseup", function() {
         //    document.removeEventListener("mousemove", handleMouseMove, true);
         //    isMouseDown = false;
         //    mouseX = undefined;
         //    mouseY = undefined;
         // }, true);
         
         // function handleMouseMove(e) {
         //    mouseX = (e.clientX - canvasPosition.x) / 30;
         //    mouseY = (e.clientY - canvasPosition.y) / 30;
         // };
         
         // function getBodyAtMouse() {
         //    return _player1.body;
         // }