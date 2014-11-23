Meteor.publish('game', function(id){
    return Games.find({ _id: id });
});

Meteor.publish('player', function(id){
    return Players.find({ _id: id });
});

Meteor.publish('syncsForGame', function(gameId){
    return Syncs.find({ gameId : gameId });
});

Meteor.publish('syncForPlayer', function(playerId){
    return Syncs.find({ playerId : playerId });
});

Meteor.publish('current-player', function(playerTag){
    return Players.find({ playerTag : playerTag });
});

Meteor.publish('gameForPlayer', function(playerId){
    return Games.find({
        players : {
            $elemMatch : {
                _id : playerId
            }
        }
    });
});

Meteor.publish('playersForGame', function(gameId){
    return Players.find({ gameId : gameId});
});