
exports.db = null;

function ensureSchemaIsSetup(callback) {
    if (exports.db.getClassByName("Track") === null) {
        exports.db.createClass("Track", "OGraphVertex", function () {
          console.log(arguments);
        });
    }

    if (exports.db.getClassByName("User") === null) {
        exports.db.createClass("User", "OGraphVertex", function () {
          console.log(arguments);
        });
    }

}

exports.init = function(orient, callback) {
    exports.db = orient;
    ensureSchemaIsSetup(callback);
};