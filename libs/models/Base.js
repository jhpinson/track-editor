var database = require('../db');
var _ = require('lodash');

var parseResults = function (results) {
  var data = {
    results : [],
    relationShips : {}
  }
  results.forEach(function (result) {

    Object.keys(result).forEach(function (key) {

    });

  })
}

var hashToSQLSets = function(hash) {

  if (_.isEmpty(hash)) {
    return {
      sqlsets: "",
      remainingHash: {}
    };
  }

  var remainingHash = {};
  var sql = "SET ";
  for (var field in hash) {
    if (field == '@rid') continue;
    var value = hash[field];
    if (_.isBoolean(value) || _.isNumber(value) || _.isString(value) || _.isDate(value)) {
      if (_.isString(value) && /^#[0-9]+:[0-9]+$/.test(value) === true) {

      } else if (_.isString(value)) {
        value = "\"".concat(value.replace(/"/g, "\\\""), "\"");
      } else if (_.isDate(value)) {
        value = "date(\"" + value.toISOString() + "\", \"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'\")";
      }
      sql = sql.concat(field, " = ", value, ", ");
    } else {
      remainingHash[field] = value;
    }
  }
  sql = sql.substring(0, sql.length - 2);

  return {
    sqlsets: sql,
    remainingHash: remainingHash
  };
};

var hashToSQLWhere = function(hash) {
  if (_.isEmpty(hash)) {
    return {
      sqlwhere: "",
      remainingHash: {}
    };
  }

  var remainingHash = {};
  var sql = "";
  for (var field in hash) {
    var value = hash[field];
    if (_.isBoolean(value) || _.isNumber(value) || _.isString(value) || _.isDate(value)) {

      if (_.isString(value) && /^#[0-9]+:[0-9]+$/.test(value) === true) {
      //if (_.isString(value) && field == '@rid' || ) {
        //
      } else if (_.isString(value)) {
        value = "\"".concat(value.replace(/"/g, "\\\""), "\"");
      } else if (_.isDate(value)) {
        value = "date(\"" + value.toISOString() + "\", \"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'\")";
      }
      sql = sql.concat(field, " = ", value, " AND ");
    } else {
      remainingHash[field] = value;
    }
  }
  if (sql.length > 0) {
    sql = "WHERE " + sql.substring(0, sql.length - 4);
  }
  return {
    sqlwhere: sql,
    remainingHash: remainingHash
  };
};

var Base = function(options) {

  var storageClass = options.storageClass;
  var selectOptions = options.selectOptions || {fetchPlan : "*:1"};


  return {
    save: function(data, callback) {
      if (data['@rid'] === null || typeof(data['@rid']) == 'undefined') {
        // create
        delete data['@rid'];
        database.db.createVertex(data, {
          "class": storageClass
        }, function(err, result) {
          if (err === null) {
            callback(null, result)
          } else {
            callback(err)
          }
        });
      } else {
        database.db.command("UPDATE " + data['@rid'] + " " + hashToSQLSets(data).sqlsets, function(err, result) {
          if (err === null) {
            callback(null, result)
          } else {
            callback(err)
          }
        });
      }
    },

    filter: function(options, callback) {

      //database.db.command("SELECT from profile ", {fetchplan}, function(err, results) {

      database.db.command("SELECT from " + storageClass + " " + hashToSQLWhere(options).sqlwhere, selectOptions, function(err, results) {
        if (err === null) {
          callback(null, results)
        } else {
          callback(err)
        }
      });
    },

    get: function(options, callback) {
      database.db.command("SELECT from " + storageClass + " " + hashToSQLWhere(options).sqlwhere, selectOptions, function(err, results) {
        if (err === null) {
          if (results.length  > 1) {
            callback('MultipleObjectReturned')
          } else if (results.length  == 0) {
            callback('ObjectDoesnotExist')
          } else {
            callback(null, results[0])
          }

        } else {
          callback(err)
        }
      });
    },

    remove: function(options, callback) {
      database.db.command("DELETE FROM " + storageClass + " " + hashToSQLWhere(options).sqlwhere, function(err, result) {
        if (err === null) {
          callback(null, result)
        } else {
          callback(err)
        }
      });
    }
  }

};

module.exports = Base;