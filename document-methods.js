if (typeof Object.create !== 'function') {
  Object.create = (function () {
    var Temp = function () {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Second argument not supported');
      }
      if (typeof prototype != 'object') {
        throw TypeError('Argument must be an object');
      }
      Temp.prototype = prototype;
      var result = new Temp();
      Temp.prototype = null;
      return result;
    };
  })();
}

var attachDocumentMethods = function (inst) {
  if ((!_.isFunction(inst._transform) || inst._hasCollectionHelpers) && _.isFunction(inst.helpers)) {
    inst.helpers({
      $save: function () {
        var doc = {};
        _.each(this, function (value, key) {
          doc[key] = value;
        });
        delete doc._id;
        // I would _.clone or _.omit, but for some reason 
        // freaking underscore.js copies the prototypes
        return inst.update.apply(inst, _.flatten([this._id, { $set: doc }, _.toArray(arguments)]));
      },
      $duplicate: function () {
        var doc = {};
        _.each(this, function (value, key) {
          doc[key] = value;
        });
        delete doc._id;
        return inst.insert.apply(inst, _.flatten([doc, _.toArray(arguments)]));
      },
      $update: function (modifier) {
        return inst.update.apply(inst, _.flatten([this._id, modifier, _.rest(_.toArray(arguments))]));
      },
      $remove: function () {
        return inst.remove.apply(inst, _.flatten([this._id, _.toArray(arguments)]));
      },
      $set: function (toSet) {
        return inst.update.apply(inst, _.flatten([this._id, { $set: toSet }, _.rest(_.toArray(arguments))]));
      },
      $unset: function (toSet) {
        return inst.update.apply(inst, _.flatten([this._id, { $unset: toSet }, _.rest(_.toArray(arguments))]));
      },
      $push: function (toPush) {
        return inst.update.apply(inst, _.flatten([this._id, { $push: toPush }, _.rest(_.toArray(arguments))]));
      },
      $pushAll: function (toPush) {
        return inst.update.apply(inst, _.flatten([this._id, { $pushAll: toPush }, _.rest(_.toArray(arguments))]));
      },
      $pull: function (toPull) {
        return inst.update.apply(inst, _.flatten([this._id, { $pull: toPull }, _.rest(_.toArray(arguments))]));
      },
      $pullAll: function (toPull) {
        return inst.update.apply(inst, _.flatten([this._id, { $pullAll: toPull }, _.rest(_.toArray(arguments))]));
      },
      $pop: function (toPop) {
        return inst.update.apply(inst, _.flatten([this._id, { $pop: toPop }, _.rest(_.toArray(arguments))]));
      },
      $addToSet: function (toAdd) {
        return inst.update.apply(inst, _.flatten([this._id, { $addToSet: toAdd }, _.rest(_.toArray(arguments))]));
      }    
    });
  }
};

var wrapConstructor = function () {
  var constructor = Mongo.Collection;

  Mongo.Collection = function() {
    var ret = constructor.apply(this, arguments);
    attachDocumentMethods(this);
    return ret;
  };

  Mongo.Collection.prototype = Object.create(constructor.prototype);
  Mongo.Collection.prototype.constructor = Mongo.Collection;

  _.extend(Mongo.Collection, constructor);

  // Meteor.Collection will lack ownProperties that are added back to Mongo.Collection
  Meteor.Collection = Mongo.Collection;
};

wrapConstructor();

if (typeof Meteor.users !== 'undefined') {
  attachDocumentMethods(Meteor.users);
}