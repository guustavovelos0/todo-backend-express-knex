const { get, patch, del } = require('./util/httpRequests');
const ROLES = require('../utils/roles.enum');

// Define mock data
const mockUsers = [
    { id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5', email: 'user1@test.com', name: 'User 1' },
    { id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af6', email: 'user2@test.com', name: 'User 2' }
];

const mockToken = 'Bearer a1ad94e8-3215-4d6f-b0e2-4744a6c33af5';

// Mock the user-queries module
jest.mock('../database/user-queries', () => ({
    all: jest.fn(),
    get: jest.fn(),
    getByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn((token, secret) => {
        return {
            id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
            email: 'test@test.com',
            organization_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
            role: 'OWNER'
        };
    })
}));

// Import the mocked module
const userQueries = require('../database/user-queries');

describe('GET /users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path
    it('should return all users successfully', async () => {
        userQueries.all.mockResolvedValue(mockUsers);

        const response = await get('/users', { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(mockUsers);
        expect(userQueries.all).toHaveBeenCalledTimes(1);
    });

    // Edge Cases
    it('should return empty array when no users exist', async () => {
        userQueries.all.mockResolvedValue([]);

        const response = await get('/users', { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual([]);
        expect(userQueries.all).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
        userQueries.all.mockRejectedValue(new Error('Database error'));

        const response = await get('/users', { Authorization: `Bearer ${mockToken}` })
            .expect(500);

        expect(userQueries.all).toHaveBeenCalledTimes(1);
    });

    // Optional: Test with large dataset
    it('should handle large number of users', async () => {
        const largeUserList = Array(1000).fill().map((_, index) => ({
            id: `id-${index}`,
            email: `user${index}@test.com`,
            name: `User ${index}`
        }));

        userQueries.all.mockResolvedValue(largeUserList);

        const response = await get('/users', { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.length).toBe(1000);
        expect(userQueries.all).toHaveBeenCalledTimes(1);
    });
});

describe('GET /users/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path
    it('should return a specific user successfully', async () => {
        const userId = mockUsers[0].id;
        userQueries.get.mockResolvedValue(mockUsers[0]);

        const response = await get(`/users/${userId}`, { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(mockUsers[0]);
        expect(userQueries.get).toHaveBeenCalledTimes(1);
        expect(userQueries.get).toHaveBeenCalledWith(userId);
    });

    // Edge Cases
    it('should return 404 when user does not exist', async () => {
        const nonExistentId = 'non-existent-id';
        userQueries.get.mockResolvedValue(null);

        const response = await get(`/users/${nonExistentId}`, { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body).toEqual({ error: 'User not found' });
        expect(userQueries.get).toHaveBeenCalledTimes(1);
        expect(userQueries.get).toHaveBeenCalledWith(nonExistentId);
    });

    it('should handle database errors', async () => {
        const userId = mockUsers[0].id;
        userQueries.get.mockRejectedValue(new Error('Database error'));

        const response = await get(`/users/${userId}`, { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /text/)
            .expect(500);

        expect(response.text).toBe('Opps! Could not fetch user.');
        expect(userQueries.get).toHaveBeenCalledTimes(1);
        expect(userQueries.get).toHaveBeenCalledWith(userId);
    });

    it('should handle invalid ID format', async () => {
        const invalidId = 'invalid-uuid-format';
        userQueries.get.mockRejectedValue(new Error('Invalid ID format'));

        const response = await get(`/users/${invalidId}`, { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /text/)
            .expect(500);

        expect(response.text).toBe('Opps! Could not fetch user.');
        expect(userQueries.get).toHaveBeenCalledTimes(1);
        expect(userQueries.get).toHaveBeenCalledWith(invalidId);
    });
});

describe('PATCH /users/:id', () => {
    const userId = mockUsers[0].id;
    const mockToken = 'Bearer a1ad94e8-3215-4d6f-b0e2-4744a6c33af5';
    const validUpdate = {
        name: 'Updated Name',
        password: 'newpassword123'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path
    it('should update user successfully with valid data', async () => {
        const expectedUser = {
            ...mockUsers[0],
            name: validUpdate.name
        };
        userQueries.update.mockResolvedValue(expectedUser);

        const response = await patch(
            `/users/${userId}`,
            validUpdate,
            { Authorization: mockToken }
        )
            .expect(200);

        expect(response.body).toEqual(expectedUser);
        expect(userQueries.update).toHaveBeenCalledTimes(1);
        expect(userQueries.update).toHaveBeenCalledWith(userId, expect.objectContaining({
            name: validUpdate.name
        }));
    });

    it('should update only name', async () => {
        const nameUpdate = { name: 'Updated Name' };
        const expectedUser = {
            ...mockUsers[0],
            name: nameUpdate.name
        };
        userQueries.update.mockResolvedValue(expectedUser);

        const response = await patch(
            `/users/${userId}`,
            nameUpdate,
            { Authorization: mockToken }
        )
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expectedUser);
        expect(userQueries.update).toHaveBeenCalledTimes(1);
        expect(userQueries.update).toHaveBeenCalledWith(userId, nameUpdate);
    });

    it('should update only password', async () => {
        const passwordUpdate = { password: 'newpassword123' };
        userQueries.update.mockResolvedValue({ ...mockUsers[0] });

        const response = await patch(
            `/users/${userId}`,
            passwordUpdate,
            { Authorization: mockToken }
        ).expect(200);

        expect(userQueries.update).toHaveBeenCalledTimes(1);
        expect(userQueries.update).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({
                password: expect.any(String)
            })
        );
    });

    // Validation Cases
    it('should validate name length', async () => {
        const invalidUpdate = { name: 'Jo' }; // Too short

        const response = await patch(
            `/users/${userId}`,
            invalidUpdate,
            { Authorization: mockToken }
        )
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            error: 'Invalid user data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: ['name']
                })
            ])
        });
        expect(userQueries.update).not.toHaveBeenCalled();
    });

    it('should validate password length', async () => {
        const invalidUpdate = { password: '12345' }; // Too short

        const response = await patch(
            `/users/${userId}`,
            invalidUpdate,
            { Authorization: mockToken }
        )
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            error: 'Invalid user data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: ['password']
                })
            ])
        });
        expect(userQueries.update).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not the owner', async () => {
        const response = await patch(
            `/users/${mockUsers[1].id}`,
            validUpdate,
            { Authorization: mockToken }
        )
            .expect(403);
    });

    it('should reject invalid fields', async () => {
        const invalidUpdate = {
            name: 'Valid Name',
            invalidField: 'some value'
        };

        const response = await patch(
            `/users/${userId}`,
            invalidUpdate,
            { Authorization: mockToken }
        )
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            error: 'Invalid user data',
            details: expect.anything()
        });
        expect(userQueries.update).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
        userQueries.update.mockRejectedValue(new Error('Database error'));

        const response = await patch(
            `/users/${userId}`,
            validUpdate,
            { Authorization: mockToken }
        )
            .expect('Content-Type', /text/)
            .expect(500);

        expect(response.text).toBe('Opps! Could not update user.');
        expect(userQueries.update).toHaveBeenCalledTimes(1);
    });

    it('should handle empty update object', async () => {
        const response = await patch(
            `/users/${userId}`,
            {},
            { Authorization: mockToken }
        ).expect(400);

        expect(response.body).toEqual({
            error: 'Invalid user data',
            details: expect.anything()
        });
        expect(userQueries.update).not.toHaveBeenCalled();
    });
});

describe('DELETE /users/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete user successfully', async () => {
        userQueries.delete.mockResolvedValue(mockUsers[0]);
        const userId = mockUsers[0].id;

        const response = await del(`/users/${userId}`, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockUsers[0]);
        expect(userQueries.delete).toHaveBeenCalledTimes(1);
        expect(userQueries.delete).toHaveBeenCalledWith(userId);
    });

    it('should return 404 when user does not exist', async () => {
        userQueries.delete.mockResolvedValue(null);
        const userId = mockUsers[0].id;

        const response = await del(`/users/${userId}`, { Authorization: mockToken }).expect(404);

        expect(response.body).toEqual({ error: 'User not found' });
        expect(userQueries.delete).toHaveBeenCalledTimes(1);
    });
});

