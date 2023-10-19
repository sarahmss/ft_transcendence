import { validate } from 'class-validator';
import { CreateUserDto } from '../dto/user.dto';

describe('CreateUserDto', () => {
  let createUserDto: CreateUserDto;

  beforeEach(() => {
    createUserDto = new CreateUserDto();
  });

  it('should be valid', async () => {
    createUserDto.userName = 'validusername';
    createUserDto.email = 'valid@example.com';
    createUserDto.password = 'StrongPassword123!';
    createUserDto.passwordConfirm = 'StrongPassword123!';

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(0);
  });

  it('should not allow invalid email', async () => {
    createUserDto.email = 'invalid-email';
    createUserDto.password = 'StrongPassword123!';
    createUserDto.passwordConfirm = 'StrongPassword123!';

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not allow weak password', async () => {
    createUserDto.userName = 'validusername';
    createUserDto.email = 'valid@example.com';
    createUserDto.password = 'weakpassword';
    createUserDto.passwordConfirm = 'weakpassword';

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
