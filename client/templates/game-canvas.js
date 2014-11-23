Template.gameCanvas.helpers({
    screenWidth : function(){
        return $(document.body).width();
    },
    screenHeight : function(){
        return $(document.body).height();
    }
});

Template.gameCanvas.rendered = function(){

    var inputStream = new Meteor.Stream('inputs');
    inputStream.on('move', function(move) {
        console.log('got move', move);
        Game.movePlayer(move.playerId,
            Helpers.relativePositionToAbsolute(move.position)
        );
    });


    Game.init();

    this.autorun(_.bind(function(){
        // console.log(this.data.players.fetch());
        _.each(this.data.players.fetch(), function(p){
            Game.addPlayer(p);
        });
    },this));

};