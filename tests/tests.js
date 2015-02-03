Tinytest.add("does not override your collection helpers", function (test) {
  Todos = new Mongo.Collection('todos' + test.id);
  
  Todos.helpers({
    sayHello: function () {
      return 'hello';
    }
  });

  insert(Todos);

  var todo = inst(Todos);
  todo.$update({
    $set: {
      title: 'Pick up more stuff'
    }
  });

  todo = inst(Todos);
  test.equal(todo.title, 'Pick up more stuff');
  test.equal(todo.sayHello(), 'hello');
});

Tinytest.add("works alongside collection2@2.3.1", function (test) {
  Todos = new Mongo.Collection('todos' + test.id);

  Todos.attachSchema(new SimpleSchema({
    title: {
      type: String
    }
  }));
  
  insert(Todos);

  var todo = inst(Todos);
  todo.$update({
    $set: {
      title: 'Pick up more stuff'
    }
  });

  todo = inst(Todos);
  test.equal(todo.title, 'Pick up more stuff');
});

Tinytest.add("works alongside collection-hooks@0.7.9", function (test) {
  Todos = new Mongo.Collection('todos' + test.id);
  
  Todos.after.update(function () {
    test.equal(true, true);
  });

  insert(Todos);

  var todo = inst(Todos);
  todo.$update({
    $set: {
      title: 'Pick up more stuff'
    }
  });

  todo = inst(Todos);
  test.equal(todo.title, 'Pick up more stuff');
});

Tinytest.add("works alongside cfs:standard-packages@0.5.3 with gridfs", function (test) {
  Todos = new Mongo.Collection('todos' + test.id);
  
  Images = new FS.Collection("images", {
    stores: [new FS.Store.GridFS("images")]
  });

  insert(Todos);

  var todo = inst(Todos);
  todo.$update({
    $set: {
      title: 'Pick up more stuff'
    }
  });

  todo = inst(Todos);
  test.equal(todo.title, 'Pick up more stuff');
});

Tinytest.add("all methods", function (test) {
  Todos = new Mongo.Collection('todos' + test.id);
  
  insert(Todos);

  var todo = inst(Todos);

  // Test $save
  todo.done = true;
  todo.title = 'Buy cereal';
  todo.createdAt = new Date('1/2/2014');
  todo.assignedTo = [{
    user: 'bob',
    assignedOn: new Date('1/2/2014')
  }, {
    user: 'lindsey',
    assignedOn: new Date('1/1/2014')
  }];
  todo.tags = ['critical', 'yum', 'awesome'];
  todo.$save();
  
  todo = inst(Todos);
  test.equal(todo.done, true);
  test.equal(todo.title, 'Buy cereal');
  test.equal(todo.createdAt, new Date('1/2/2014'));
  test.equal(todo.assignedTo, [{
    user: 'bob',
    assignedOn: new Date('1/2/2014')
  }, {
    user: 'lindsey',
    assignedOn: new Date('1/1/2014')
  }]);
  test.equal(todo.tags, ['critical', 'yum', 'awesome']);

  // Test $update
  todo.$update({
    $set: {
      done: false,
      title: 'Buy groceries',
      createdAt: new Date('1/1/2014'),
      assignedTo: [{
        user: 'lindsey',
        assignedOn: new Date('1/1/2014')
      }],
      tags: ['critical', 'yum']
    },
    $push: {
      blah: 1
    }
  });

  todo = inst(Todos);
  test.equal(todo.done, false);
  test.equal(todo.title, 'Buy groceries');
  test.equal(todo.createdAt, new Date('1/1/2014'));
  test.equal(todo.assignedTo, [{
    user: 'lindsey',
    assignedOn: new Date('1/1/2014')
  }]);
  test.equal(todo.tags, ['critical', 'yum']);
  test.equal(todo.blah, [1]);

  // Test $update with $addToSet
  todo.$update({
    $addToSet: {
      blah: 2
    }
  });

  todo = inst(Todos);

  test.equal(todo.blah, [1, 2]);

  // Test $pop
  todo.$pop({
    blah: 1
  });

  todo = inst(Todos);

  test.equal(todo.blah, [1]);
  
  // Test $unset
  todo.$unset({
    blah: '1'
  });

  todo = inst(Todos);

  test.equal(todo.blah, undefined);

  // Test $pushAll
  todo.$pushAll({
    blah: [1, 2, 3, 4]
  });

  todo = inst(Todos);

  test.equal(todo.blah, [1, 2, 3, 4]);

  // Test $remove
  todo.$remove();
  test.equal(inst(Todos), undefined);

});