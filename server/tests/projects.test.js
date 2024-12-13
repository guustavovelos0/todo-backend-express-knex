const { get, post, patch, del } = require('./util/httpRequests');

const mockToken = 'Bearer a1ad94e8-3215-4d6f-b0e2-4744a6c33af5';

const mockProject = {
    id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
    name: 'Test Project',
    organization_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5'
};

// Mock the user-queries module
jest.mock('../database/project-queries', () => ({
    all: jest.fn(),
    get: jest.fn(),
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
            role: 'MANAGER'
        };
    })
}));

// Import the mocked module
const projectQueries = require('../database/project-queries');

describe('GET /projects', () => {
    it('should return 200', async () => {
        projectQueries.all.mockResolvedValue([mockProject]);

        const response = await get('/projects', { Authorization: mockToken }).expect(200);
    });
});

describe('GET /projects/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        projectQueries.get.mockResolvedValue(mockProject);

        const response = await get(`/projects/${mockProject.id}`, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockProject);
        expect(projectQueries.get).toHaveBeenCalledTimes(1);
        expect(projectQueries.get).toHaveBeenCalledWith(mockProject.id);
    });

    it('should return 404 when project does not exist', async () => {
        projectQueries.get.mockResolvedValue(null);

        const response = await get(`/projects/${mockProject.id}`, { Authorization: mockToken }).expect(404);

        expect(response.body).toEqual({ error: "Project not found" });
        expect(projectQueries.get).toHaveBeenCalledTimes(1);
        expect(projectQueries.get).toHaveBeenCalledWith(mockProject.id);
    });
});

describe('POST /projects', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        projectQueries.create.mockResolvedValue(mockProject);

        const response = await post('/projects', mockProject, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockProject);
        expect(projectQueries.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when invalid project name', async () => {
        const invalidProject = { ...mockProject, name: undefined };

        const response = await post('/projects', invalidProject, { Authorization: mockToken }).expect(400);

        expect(response.body).toEqual({
            error: "Invalid project data",
            details: [{ code: "invalid_type", expected: "string", message: "Required", path: ["name"], received: "undefined" }]
        });
        expect(projectQueries.create).not.toHaveBeenCalled();
    });

    it('should return 400 when invalid organization_id', async () => {
        const invalidProject = { ...mockProject, organization_id: undefined };

        const response = await post('/projects', invalidProject, { Authorization: mockToken }).expect(400);

        expect(response.body).toEqual({
            error: "Invalid project data",
            details: [{ code: "invalid_type", expected: "string", message: "Required", path: ["organization_id"], received: "undefined" }]
        });
        expect(projectQueries.create).not.toHaveBeenCalled();
    });
});

describe('PATCH /projects/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        projectQueries.update.mockResolvedValue(mockProject);

        const response = await patch(`/projects/${mockProject.id}`, { name: 'test' }, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockProject);
        expect(projectQueries.update).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when project does not exist', async () => {
        projectQueries.update.mockResolvedValue(null);

        const response = await patch(`/projects/${mockProject.id}`, { name: 'test' }, { Authorization: mockToken }).expect(404);

        expect(response.body).toEqual({ error: "Project not found" });
        expect(projectQueries.update).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when invalid project data', async () => {
        const invalidProject = { name: undefined };

        projectQueries.update.mockResolvedValue(invalidProject);

        const response = await patch(`/projects/${mockProject.id}`, invalidProject, { Authorization: mockToken }).expect(400);

        expect(response.body).toEqual({
            error: "Invalid project data",
            details: [{ code: "invalid_type", expected: "string", message: "Required", path: ["name"], received: "undefined" }]
        });
        expect(projectQueries.update).not.toHaveBeenCalled();
    });
});

describe('DELETE /projects/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        projectQueries.delete.mockResolvedValue(mockProject);

        const response = await del(`/projects/${mockProject.id}`, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockProject);
        expect(projectQueries.delete).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when project does not exist', async () => {
        projectQueries.delete.mockResolvedValue(null);

        const response = await del(`/projects/${mockProject.id}`, { Authorization: mockToken }).expect(404);

        expect(response.body).toEqual({ error: "Project not found" });
        expect(projectQueries.delete).toHaveBeenCalledTimes(1);
    });
});