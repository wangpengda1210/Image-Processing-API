import supertest from 'supertest';
import { existsSync, promises as fs } from 'fs';
import path from 'path';

const app = require('../index');

const request = supertest(app);

describe('Test connectivity for endpoints', () => {
  it('/api should respond 200', (done) => {
    request
      .get('/api')
      .expect(200)
      .end((err) => {
        if (err) {
          return done.fail('/api not responding');
        }
        done();
      });
  });

  it('/api/images should respond 200', (done) => {
    request
      .get('/api/images?filename=fjord&width=200&height=200')
      .expect(200)
      .end((err) => {
        if (err) {
          return done.fail('/api/image not responding');
        }
        done();
      });
  });
});

describe('Test when giving wrong path parameters', () => {
  it('should respond 404 when no path parameter is given', (done) => {
    request
      .get('/api/images?')
      .expect(404)
      .end((err) => {
        if (err) {
          return done.fail('Did not respond 404');
        }
        done();
      });
  });

  it('should respond 404 when width is less than zero', (done) => {
    request
      .get('/api/images?filename=fjord&width=-200&height=200')
      .expect(404)
      .end((err) => {
        if (err) {
          return done.fail('Did not respond 404');
        }
        done();
      });
  });

  it('should respond 404 when height is not a number', (done) => {
    request
      .get('/api/images?filename=fjord&width=200&height=a')
      .expect(404)
      .end((err) => {
        if (err) {
          return done.fail('Did not respond 404');
        }
        done();
      });
  });

  it('should respond 404 when file does not exist', (done) => {
    request
      .get('/api/images?filename=abcde&width=200&height=200')
      .expect(404)
      .end((err) => {
        if (err) {
          return done.fail('Did not respond 404');
        }
        done();
      });
  });
});

describe('Test if correct thumbnail is generated', () => {
  // Remove all thumbs before test
  beforeAll(async () => {
    let files = await fs.readdir('./assets/thumb');
    for (const file of files) {
      await fs.unlink(path.join('./assets/thumb', file));
    }
    await fs.rmdir('./assets/thumb');
  });

  it('should create new thumbnail when /api/images is accessed with correct parameters', (done) => {
    request
      .get('/api/images?filename=fjord&width=200&height=200')
      .end(async (err) => {
        if (err) {
          return done.fail('No response');
        }
        try {
          const files = await fs.readdir('./assets/thumb');
          if (files.length === 1) {
            done();
          } else {
            return done.fail('Thumbnail has not been created');
          }
        } catch (e) {
          return done.fail('./assets/thumb not created');
        }
      });
  });

  it('should not create new thumbnail when /api/images is accessed with wrong parameters', (done) => {
    request
      .get('/api/images?filename=fjord&width=200&height=200')
      .end(async (err) => {
        if (err) {
          return done.fail('No response');
        }
        try {
          const files = await fs.readdir('./assets/thumb');
          if (files.length > 1) {
            return done.fail('New thumbnail created for same parameters');
          } else {
            done();
          }
        } catch (e) {
          return done.fail('./assets/thumb not created');
        }
      });
  });

  it('should create thumbnail with correct name', (done) => {
    request
      .get('/api/images?filename=fjord&width=200&height=300')
      .end(async (err) => {
        if (err) {
          return done.fail('No response');
        }
        if (existsSync('./assets/thumb/fjord_200_300.jpg')) {
          done();
        } else {
          done.fail('Thumbnail name not correct');
        }
      });
  });
});
