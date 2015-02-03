Tinytest.add("all methods", function (test) {
  Todos = new Mongo.Collection('todos' + test.id);

  var insert = function () {
    Todos.insert({
      title: 'Buy groceries',
      createdAt: new Date('1/1/2014'),
      assignedTo: [{
        user: 'lindsey',
        assignedOn: new Date('1/1/2014')
      }],
      tags: ['critical', 'yum'],
      done: false
    });
  }
  
  insert();

  var inst = function () {
    return Todos.findOne();
  };

  var todo = inst();

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
  
  todo = inst();
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

  todo = inst();
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

  todo = inst();

  test.equal(todo.blah, [1, 2]);

  // Test $pop
  todo.$pop({
    blah: 1
  });

  todo = inst();

  test.equal(todo.blah, [1]);
  
  // Test $unset
  todo.$unset({
    blah: '1'
  });

  todo = inst();

  test.equal(todo.blah, undefined);

  // Test $pushAll
  todo.$pushAll({
    blah: [1, 2, 3, 4]
  });

  todo = inst();

  test.equal(todo.blah, [1, 2, 3, 4]);

  // Test $remove
  todo.$remove();
  test.equal(inst(), undefined);

});