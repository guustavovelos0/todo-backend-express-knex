const { post } = require('./util/httpRequests');

// Mock the user-queries module
jest.mock('../database/user-queries', () => ({
    all: jest.fn(),
    get: jest.fn(),
    getByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));


jest.mock('bcrypt', () => ({
    compare: jest.fn((password, hash) => {
        return password === hash;
    }),
    hash: jest.fn((password, saltRounds) => {
        return password;
    })
}));

const mockUser = {
    id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
    email: 'test@test.com',
    organization_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
    role: 'OWNER'
}

// Import the mocked module
const userQueries = require('../database/user-queries');

describe('POST /auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        const mockResponse = {
            user: mockUser,
            token: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5'
        }

        userQueries.getByEmail.mockResolvedValue([{ ...mockUser, password: 'password' }]);

        const response = await post('/auth/sign-in', { email: 'test@test.com', password: 'password' }).expect(200);

        expect(userQueries.getByEmail).toHaveBeenCalledTimes(1);
    });

    it('should return 401 if email is invalid', async () => {
        userQueries.getByEmail.mockResolvedValue([]);

        const response = await post('/auth/sign-in', { email: 'invalid@test.com', password: 'password' }).expect(401);

        expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should return 401 if password is invalid', async () => {
        userQueries.getByEmail.mockResolvedValue([{ ...mockUser, password: 'password' }]);

        const response = await post('/auth/sign-in', { email: 'test@test.com', password: 'phraseword' }).expect(401);

        expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should return 400 if email is invalid', async () => {
        const response = await post('/auth/sign-in', { email: 'invalid', password: 'password' }).expect(400);

        expect(response.body).toEqual({
            error: 'Invalid signin data',
            details: [
                { code: 'invalid_string', message: 'Invalid email', path: ['email'], validation: 'email' }
            ]
        });
    });

    it('should return 400 if password is invalid', async () => {
        const response = await post('/auth/sign-in', { email: 'test@test.com', password: null }).expect(400);

        expect(response.body).toEqual({
            error: 'Invalid signin data',
            details: [
                { code: 'invalid_type', message: 'Expected string, received null', path: ['password'], received: 'null', expected: 'string' }
            ]
        });
    });
});

describe('POST /auth/sign-up', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        userQueries.getByEmail.mockResolvedValue([]);
        userQueries.create.mockResolvedValue({ ...mockUser, password: 'password' });
        await post('/auth/sign-up', { email: 'test@test.com', password: 'password', name: 'test', organization_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5' }).expect(201);

    });

    it('should return 400 if email is invalid', async () => {
        const response = await post('/auth/sign-up', { email: 'invalid', password: 'password', name: 'test', organization_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5' }).expect(400);

        expect(response.body).toEqual({
            error: 'Invalid signup data',
            details: [
                { code: 'invalid_string', message: 'Invalid email', path: ['email'], validation: 'email' }
            ]
        });
    });

    it('should return 400 if password is invalid', async () => {
        const response = await post('/auth/sign-up', { email: 'test@test.com', password: null, name: 'test', organization_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5' }).expect(400);

        expect(response.body).toEqual({
            error: 'Invalid signup data',
            details: [
                { code: 'invalid_type', message: 'Expected string, received null', path: ['password'], received: 'null', expected: 'string' }
            ]
        });
    });

    it('should return 409 if email is already registered', async () => {
        userQueries.getByEmail.mockResolvedValue([{ ...mockUser, password: 'password' }]);

        const response = await post('/auth/sign-up', { email: 'test@test.com', password: 'password', name: 'test', organization_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5' }).expect(409);

        expect(response.body).toEqual({ error: 'Email already registered' });
    });
});