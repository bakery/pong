var CONTROLLER_WIDTH = 200;

Template.controller.helpers({
    notSynced : function(){
        return !this.sync;
    },

    absolutePosition : function(p){
        return Helpers.relativePositionToAbsolute(p);
    }
});

Template.controller.rendered = function(){
    var draggable = this.$('.controller')[0];
    var player = Template.instance().data.player;

    draggable.addEventListener('touchmove', function(event) {
        var touch = event.targetTouches[0];
        // Place element where the finger is
        //draggable.style.left = touch.pageX + 'px';
        //draggable.style.top = touch.pageY-25 + 'px';
        
        Players.update({ _id : player._id }, {
            $set : {
                position : Helpers.absolutePositionToRelative(touch.pageX)
            }
        });

        event.preventDefault();
    }, false);

    
    var v = player.position || 0;

    $('html').keydown(function(e){
        function move(d){
            v = v + d;
            //PlayerPositions.update({ _id : position._id }, { left : v });
            
            Players.update({ _id : player._id }, {
                $set : {
                    position : Helpers.absolutePositionToRelative(v)
                }
            });

        }

        var LEFT = 37;
        var RIGHT = 39;

        switch(e.which){
            case LEFT:
                move(-10);
                break;
            case RIGHT:
                move(10);
                break;
        }
    });
};