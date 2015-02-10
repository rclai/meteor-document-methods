insert = function (collection) {
  collection.insert({
    title: 'Buy groceries',
    createdAt: new Date('1/1/2014'),
    assignedTo: [{
      user: 'lindsey',
      assignedOn: new Date('1/1/2014')
    }],
    some: {
      weirdly: 'nested object',
      that: 'I uncreatively',
      came: 'up with because',
      iwas: 'running out of creativity'
    },
    tags: ['critical', 'yum'],
    done: false
  });
}

inst = function (collection) {
  return collection.findOne();
};