inputStream = new Meteor.Stream('inputs');

inputStream.permissions.write(function() {
    return true;
});

inputStream.permissions.read(function() {
    return true;
});