Template.game.helpers({
    absolutePosition : function(p){
        return Helpers.relativePositionToAbsolute(p);
    }
});

Template.game.rendered = function(){
    var theGame = Template.instance.data.game();
    this.autorun(function(){
        Meteor.subscribe('playersForGame',theGame._id);
    });
};