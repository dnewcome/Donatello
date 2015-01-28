module.exports = {
    'test arc': function (test) {
      test
        .open('../arc.html')
        .assert.title().is('Arc')
        .query('#test1')
        .screenshot('arc.png')
        .done();
    }
};
