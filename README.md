##Meteor Document Methods

Adds helpful methods to each of your documents to easily update/duplicate/remove them.

This uses ```dburles:collection-helpers``` to get the job done. All of these methods are injected to all of your collections as collection helpers, using ```dburles:mongo-collection-instances```. Thanks __@dburles__ for your packages, without them this would not be possible, or rather, it would've made this super hard to make!

Instead of writing: 

```
MyCollection.update(this._id, { $set: { a: 1 } });
```

Now you can write:

```
this.set({ a: 1 })
```

Where ```this``` is a document that was ```findOne```'d.

There's more stuff you can do, see below.

## Installation

```
meteor add lai:document-methods
```

##Examples

```js
Stuff = new Mongo.Collection('stuff');

var thing = Stuff.findOne();

// Set individual properties
thing.$set({ foo: 'bar' });

// Or multiple properties
thing.$set({ foo: 'bar', bar: 'baz' });
thing.$set({ foo: 'bar', bar: 'baz', testArray: [1, 2, 3] });

// You can also modify them by setting new properties 
// Note: setting properties/modifying them does not trigger reactivity)
thing.newProperty = 'that means absolutely nothing';
thing.anotherOne = 'yea!';
// Then saving it (this will update and trigger reactivity)
thing.$save();

// The following methods mimic the Mongo functions of $push, $pushAll, 
// $addToSet, $pull, $pullAll, and $pop (Note: they will apply the update immediately)
thing.$push({ myArrayProperty: 1 });
thing.$pushAll({ myArrayProperty: [2, 3, 4, 5] });
thing.$addToSet({ myPropertySet: { a: 1, b: 2, c: 3} });
thing.$pull({ myArrayProperty: 2 });
thing.$pullAll({ myArrayProperty: [1, 3, 4] });
thing.$pop({ myArrayProperty: 1 });

// If you think this is too limiting, you can have full control of the modifier, 
// but only on the modifier and not the criteria because remember, 
// these are methods that correspond to one specific document
thing.$update({
  $set: {
    a: '1',
    b: '2'
  },
  $addToSet: {
    myPropertySet: {
      foo: 'bar',
      bar: 'baz'
    }
  },
  ...
});

// If you wanted to create a duplicate of this document
var newThing, newThingId = thing.$duplicate();
if (newThingId) {
  newThing = Stuff.findOne(newThingId);
  // do new things with this newThing
}

// And once you've realized that you created a 
// completely meaningless document, you can remove it
thing.$remove();
newThing.$remove();
```

## API

Where ```document``` is a document that was ```findOne```'d.

For all update-related callbacks, If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.

For the duplicate callback, if present, called with an error object as the first argument and, if no error, the _id as the second.

For the remove callback, if present, called with an error object as its argument.

If no callbacks were provided, they should function exactly as an insert, update, remove as specified in the Meteor documentation (insert will return the _id, update will return 1, remove will remove nothing, etc).

####document.$update(modifier [, callback])

Mimics ```MyCollection.update(this._id, modifier)```.

####document.$save([callback])

Updates the current document with its current properties.

####document.$duplicate([callback])

Does an insert of the document, returns _id if no callback was provided, otherwise, it's returned in the second argument of the callback.

####document.$remove([callback])

Mimics ```MyCollection.remove(this._id)```

####document.$set(propertiesToSet [, callback])

Mimics ```MyCollection.update(this._id, { $set: { prop1: 1, prop2: 2 } })```

####document.$addToSet(setToAdd [, callback])

Mimics ```MyCollection.update(this._id, { $addToSet: { mySetOfThings: { a: 1, b: 2 } } })```

####document.$push(thingsToPush [, callback])

Mimics ```MyCollection.update(this._id, { $push: { myList: 1 } })```

####document.$pushAll(allThingsToPush [, callback])

Mimics ```MyCollection.update(this._id, { $pushAll: { myList: [1, 2, 3, 4] } })```

####document.$pull(thingToPull [, callback])

Mimics ```MyCollection.update(this._id, { $pull: { myList: 1 } })```

####document.$pullAll(allThingsToPull [, callback])

Mimics ```MyCollection.update(this._id, { $pullAll: { myList: [1, 2, 3, 4] } })```

####document.$pop(thingToPop [, callback])

Mimics ```MyCollection.update(this._id, { $pop: { myList: 1 } })```

##Now What?

I need to do tests, and I need your feedback.

Also, when I created this, I had intially named them without the ```$``` prefix, but then I figured that you might run into name conflicts and that's why I decided to add the ```$``` prefix. Let me know your thoughts.
