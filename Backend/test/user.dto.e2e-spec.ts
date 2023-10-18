import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should create a new user', async () => {
    const userDto = {
      username: 'testuser123',
      email: 'testuser@example.com',
      password: 'Test@123',
      passwordConfirm: 'Test@123',
    };

    const response = await request(app.getHttpServer())
      .post('/users') // Assuming endpoint for creating users is '/users'
      .send(userDto)
      .expect(201); // Assuming return status 201 (Created) upon successful user creation

    expect(response.body).toMatchObject(userDto); // Assuming endpoint returns the created user data
  });

  afterEach(async () => {
    await app.close();
  });
});
