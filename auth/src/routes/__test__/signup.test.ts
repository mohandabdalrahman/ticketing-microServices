import request from 'supertest';
import { app } from '../../app';

it('should return 201 on success signUp', async () => {
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'test@example.com',
      password: '1234',
    })
    .expect(201);
});
