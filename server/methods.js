Meteor.methods({

    createGame : function(){
        var gameId = Games.insert({
            players : [],
            state : GameState.CREATED
        });

        _.each([1,2], function(player){
            Syncs.insert({
                gameId : gameId,
                playerName : player,
                code : Tools.getRandomInt(1000,10000),
                activated : false
            });
        });

        return gameId;
    },

    createPlayer : function(){
        var playerId = Players.insert({
            playerName : Tools.getRandomInt(1,1000000)
        });
        return playerId;
    },

    sync : function(playerId, code){
        var syncObject = Syncs.findOne({
            code : parseInt(code),
            activated : false
        });

        if(syncObject){

            Syncs.update(syncObject._id, {
                $set : {
                    activated : true,
                    playerId : playerId
                }
            });

            // add player to the game

            Games.update({ _id : syncObject.gameId }, {
                $push: {
                    players: {
                        _id : playerId
                    }
                }
            });

            Players.update({ _id : playerId }, {
                $set : {
                    gameId : syncObject.gameId
                }
            });


            return syncObject._id;
        } else {
            return null;
        }
    }
});