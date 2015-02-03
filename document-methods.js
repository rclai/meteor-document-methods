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

var wrapCollection = function (ns, as) {
  if (!as._CollectionConstructor) as._CollectionConstructor = as.Collection;
  if (!as._CollectionPrototype) as._CollectionPrototype = new as.Collection(null);

  var constructor = as._CollectionConstructor;
  var proto = as._CollectionPrototype;

  ns.Collection = function () {
    var ret = constructor.apply(this, arguments);
    attachDocumentMethods(this);
    return ret;
  };

  ns.Collection.prototype = proto;

  for (var prop in constructor) {
    if (constructor.hasOwnProperty(prop)) {
      ns.Collection[prop] = constructor[prop];
    }
  }
};

if (typeof Mongo !== "undefined") {
  wrapCollection(Meteor, Mongo);
  wrapCollection(Mongo, Mongo);
} else {
  wrapCollection(Meteor, Meteor);
}