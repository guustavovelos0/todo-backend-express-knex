const { get, patch, del } = require('./util/httpRequests');

const mockToken = 'Bearer a1ad94e8-3215-4d6f-b0e2-4744a6c33af5';

const mockOrganization = {
    id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
    name: 'Test Organization'
};

// Mock the user-queries module
jest.mock('../database/organization-queries', () => ({
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
const organizationQueries = require('../database/organization-queries');

describe('GET /organizations/current', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path
    it('should return current organization', async () => {
        organizationQueries.get.mockResolvedValue(mockOrganization);

        const response = await get(`/organizations/current`, { Authorization: `Bearer ${mockToken}` })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(mockOrganization);
        expect(organizationQueries.get).toHaveBeenCalledTimes(1);
    });
});

describe('PATCH /organizations/current', () => {
    const mockToken = 'Bearer a1ad94e8-3215-4d6f-b0e2-4744a6c33af5';
    const validUpdate = {
        name: 'Updated Name',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path
    it('should update current organization successfully with valid data', async () => {
        const expectedOrganization = {
            ...mockOrganization,
            name: validUpdate.name
        };
        organizationQueries.update.mockResolvedValue(expectedOrganization);

        const response = await patch(
            `/organizations/current`,
            validUpdate,
            { Authorization: mockToken }
        )
            .expect(200);

        expect(response.body).toEqual(expectedOrganization);
        expect(organizationQueries.update).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when invalid data is provided', async () => {
        const invalidUpdate = {
            name: ''
        };

        const response = await patch(
            `/organizations/current`,
            invalidUpdate,
            { Authorization: mockToken }
        )
            .expect(400);
    });
});

describe('DELETE /organizations/current', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete current organization successfully', async () => {
        organizationQueries.delete.mockResolvedValue(mockOrganization);

        const response = await del(`/organizations/current`, { Authorization: mockToken })
            .expect(200);
    });
});

