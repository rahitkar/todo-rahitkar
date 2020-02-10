const fs = require('fs');
const request = require('supertest');
const app = require('../lib/handlers');
const { DATA_STORE } = require('../lib/config');

describe('GET method', () => {
  it('should direct to index.html for / path', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(200, done);
  });
  it('should fetch all todo cards for /allTodo path', done => {
    request(app.serve.bind(app))
      .get('/allTodo')
      .set('Accept', '*/*')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });
  it('should respond with style.css for css/style.css path', done => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('content-type', /css/)
      .expect(200, done);
  });
  it('should respond with logo.png for img/logo.png path', function(done) {
    request(app.serve.bind(app))
      .get('/img/logo.png')
      .set('Accept', '*/*')
      .expect('content-type', /image/)
      .expect(200, done);
  });
  it('should respond with status code 404 for non existing file', done => {
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST method', () => {
  const testData = fs.readFileSync(DATA_STORE);

  after(() => {
    fs.writeFileSync(DATA_STORE, testData);
  });

  it('should add new todoCard for /newTodoCard path', done => {
    request(app.serve.bind(app))
      .post('/newTodoCard')
      .set('Accept', '*/*')
      .send('{"title":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should  remove todo on /removeTodo req', done => {
    request(app.serve.bind(app))
      .post('/removeTodo')
      .set('Accept', '*/*')
      .send('2')
      .expect(200, done);
  });

  it('should toggle the status of task on /toggleHasDoneStatus req', done => {
    request(app.serve.bind(app))
      .post('/toggleHasDoneStatus')
      .set('Accept', '*/*')
      .send('{"cardId":"1","taskId":"11"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should add one task for /addItem req', done => {
    request(app.serve.bind(app))
      .post('/addItem')
      .set('Accept', '*/*')
      .send('{"id":"1","content":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should remove one task for /removeTodoItem req', done => {
    request(app.serve.bind(app))
      .post('/removeTodoItem')
      .set('Accept', '*/*')
      .send('{"cardId":"3","taskId":"31"}')
      .expect(200, done);
  });

  it('should edit title of todo for /editTitle req', done => {
    request(app.serve.bind(app))
      .post('/editTitle')
      .set('Accept', '*/*')
      .send('{"cardId":"3","content":"sampleTitle"}')
      .expect(200, done);
  });

  it('should edit task of a todo for /editTaskContent req', done => {
    request(app.serve.bind(app))
      .post('/editTaskContent')
      .set('Accept', '*/*')
      .send('{"cardId":"4","content":"sampleTitle", "taskId":"41"}')
      .expect(200, done);
  });

  it('should give Not Found /badUrl req', done => {
    request(app.serve.bind(app))
      .post('/badUrl')
      .set('Accept', '*/*')
      .expect(404, done)
      .expect(/Not Found/);
  });
});

describe('PUT', () => {
  it('should give method not allowed', done => {
    request(app.serve.bind(app))
      .put('/badUrl')
      .expect(400, done)
      .expect(/method not allowed/);
  });
});
