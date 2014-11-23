Helpers = {
    absolutePositionToRelative : function(v){
        var screenHeight = $(document.body).height();
        return v/screenHeight;
    },

    relativePositionToAbsolute : function(v){
        var screenHeight = $(document.body).height();
        return Math.floor(v*screenHeight);
    }
};