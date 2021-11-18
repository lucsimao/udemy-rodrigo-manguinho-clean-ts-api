import app from '../config/app';
import request from 'supertest';

describe('SignUp Routes', () => {
  test('should return 200', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Lucas',
        email: 'lucas@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      })
      .expect(200);
  });
});
