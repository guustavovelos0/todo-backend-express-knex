process.env.NODE_ENV = 'test';
const request = require('./util/httpRequests.js');

// Mock the database queries
jest.mock('../database/organization-queries', () => ({
    all: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

const organizationQueries = require('../database/organization-queries');

describe('Organizations endpoints', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of organizations', async () => {
        const mockOrgs = [
            { id: 1, name: 'Org 1', description: 'Desc 1' },
            { id: 2, name: 'Org 2', description: 'Desc 2' }
        ];
        organizationQueries.all.mockResolvedValue(mockOrgs);

        const response = await request.get('/organizations');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockOrgs);
        expect(organizationQueries.all).toHaveBeenCalledTimes(1);
    });

    it('should return the organization with the given id', async () => {
        const mockOrg = { id: 1, name: 'Test Org', description: 'Test Description' };
        organizationQueries.get.mockResolvedValue(mockOrg);

        const response = await request.get('/organizations/1');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockOrg);
        expect(organizationQueries.get).toHaveBeenCalledWith('1');
    });

    it('should return a 404 if the organization is not found', async () => {
        organizationQueries.get.mockResolvedValue(null);

        const response = await request.get('/organizations/-1');
        expect(response.status).toBe(404);
        expect(organizationQueries.get).toHaveBeenCalledWith('-1');
    });

    it('should create a new organization', async () => {
        const newOrg = { name: 'New Org', description: 'New Description' };
        const createdOrg = { id: 1, ...newOrg };
        organizationQueries.create.mockResolvedValue(createdOrg);

        const response = await request.post('/organizations', newOrg);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(createdOrg);
        expect(organizationQueries.create).toHaveBeenCalledWith(newOrg);
    });

    it('should update an organization', async () => {
        const updateData = { name: 'Updated Org Name' };
        const updatedOrg = {
            id: 1,
            name: 'Updated Org Name',
            description: 'To Be Updated'
        };
        organizationQueries.update.mockResolvedValue(updatedOrg);

        const response = await request.patch('/organizations/1', updateData);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(updatedOrg);
        expect(organizationQueries.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should return a 404 when updating non-existent organization', async () => {
        organizationQueries.update.mockResolvedValue(null);

        const response = await request.patch('/organizations/-1', {
            name: 'Updated Name'
        });
        expect(response.status).toBe(404);
        expect(organizationQueries.update).toHaveBeenCalledWith('-1', {
            name: 'Updated Name'
        });
    });

    it('should delete an organization', async () => {
        const deletedOrg = {
            id: 1,
            name: 'Deleted Org',
            description: 'Deleted',
            deleted_at: new Date()
        };
        organizationQueries.delete.mockResolvedValue(deletedOrg);

        const response = await request.delete('/organizations/1');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(deletedOrg);
        expect(organizationQueries.delete).toHaveBeenCalledWith('1');
    });

    it('should return a 404 when deleting non-existent organization', async () => {
        organizationQueries.delete.mockResolvedValue(null);

        const response = await request.delete('/organizations/-1');
        expect(response.status).toBe(404);
        expect(organizationQueries.delete).toHaveBeenCalledWith('-1');
    });
}); 