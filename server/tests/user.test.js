process.env.NODE_ENV = 'test';
const request = require('./util/httpRequests.js');
const jwt = require('jsonwebtoken');

// Mock the database queries
jest.mock('../database/user-queries', () => ({
    all: jest.fn(),
    get: jest.fn(),
    getByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

const userQueries = require('../database/user-queries');

// Mock JWT verification
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: 'test@test.com' }); // Mocked payload
    })
}));

describe('Users endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of users', async () => {
        const mockUsers = [
            { id: 1, email: 'user1@test.com', name: 'User 1' },
            { id: 2, email: 'user2@test.com', name: 'User 2' }
        ];
        userQueries.all.mockResolvedValue(mockUsers);

        const response = await request.get('/users');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockUsers);
        expect(userQueries.all).toHaveBeenCalledTimes(1);
    });

    it('should return the user with the given id', async () => {
        const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
        userQueries.get.mockResolvedValue(mockUser);

        const response = await request.get('/users/1');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockUser);
        expect(userQueries.get).toHaveBeenCalledWith('1');
    });

    it('should return a 404 if the user is not found', async () => {
        userQueries.get.mockResolvedValue(null);

        const response = await request.get('/users/-1');
        expect(response.status).toBe(404);
        expect(userQueries.get).toHaveBeenCalledWith('-1');
    });

    it('should create a new user', async () => {
        const newUser = {
            email: 'test@test.com',
            password: 'password',
            name: 'Test'
        };
        const createdUser = { id: 1, ...newUser };
        userQueries.create.mockResolvedValue(createdUser);

        const response = await request.post('/users', newUser);
        expect(response.status).toBe(201);
        expect(response.data).toEqual(createdUser);
        expect(userQueries.create).toHaveBeenCalledWith(newUser);
    });

    it('should return a 400 if required fields are missing', async () => {
        const response = await request.post('/users', {
            email: 'test@test.com',
            name: 'Test'
            // missing password
        });
        expect(response.status).toBe(400);
        expect(userQueries.create).not.toHaveBeenCalled();
    });

    it('should update a user', async () => {
        const updateData = { name: 'Updated Test' };
        const updatedUser = {
            id: 1,
            email: 'test@test.com',
            name: 'Updated Test'
        };
        userQueries.update.mockResolvedValue(updatedUser);

        const response = await request.patch('/users/1', updateData);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(updatedUser);
        expect(userQueries.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should return a 404 when updating non-existent user', async () => {
        userQueries.update.mockResolvedValue(null);

        const response = await request.patch('/users/-1', {
            name: 'Updated Name'
        });
        expect(response.status).toBe(404);
        expect(userQueries.update).toHaveBeenCalledWith('-1', {
            name: 'Updated Name'
        });
    });

    it('should soft delete a user', async () => {
        const deletedUser = {
            id: 1,
            email: 'test@test.com',
            name: 'Test User',
            deleted_at: new Date()
        };
        userQueries.delete.mockResolvedValue(deletedUser);

        const response = await request.delete('/users/1');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(deletedUser);
        expect(userQueries.delete).toHaveBeenCalledWith('1');
    });

    it('should return a 404 when deleting non-existent user', async () => {
        userQueries.delete.mockResolvedValue(null);

        const response = await request.delete('/users/-1');
        expect(response.status).toBe(404);
        expect(userQueries.delete).toHaveBeenCalledWith('-1');
    });

    // New test case: Get user by email
    it('should return the user with the given email', async () => {
        const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
        userQueries.getByEmail.mockResolvedValue([mockUser]);

        const response = await request.get('/users/email/test@test.com');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockUser);
        expect(userQueries.getByEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('should return a 404 if the user email is not found', async () => {
        userQueries.getByEmail.mockResolvedValue([]);

        const response = await request.get('/users/email/notfound@test.com');
        expect(response.status).toBe(404);
        expect(userQueries.getByEmail).toHaveBeenCalledWith('notfound@test.com');
    });
});