const { get, post, patch, del } = require('./util/httpRequests');
const STATUS = require('../utils/status.enum');
const PRIORITY = require('../utils/priority.enum');

const mockToken = 'Bearer a1ad94e8-3215-4d6f-b0e2-4744a6c33af5';

const mockTasks = [
    {
        id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
        title: 'Test Task',
        description: 'Test Task Description',
        status: STATUS.TODO,
        priority: PRIORITY.LOW,
        due_date: new Date().toISOString(),
        assignee_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
        project_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
        user_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af6',
        title: 'Test Task 2',
        description: 'Test Task 2 Description',
        due_date: new Date().toISOString(),
        status: STATUS.TODO,
        priority: PRIORITY.LOW,
        assignee_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
        project_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
        user_id: 'a1ad94e8-3215-4d6f-b0e2-4744a6c33af5',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

jest.mock('zod', () => ({
    z: {
        object: jest.fn().mockReturnValue({
            parse: jest.fn().mockReturnValue(mockTasks[0])
        })
    }
}));

// Mock the user-queries module
jest.mock('../database/task-queries', () => ({
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
const taskQueries = require('../database/task-queries');

describe('GET /tasks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        taskQueries.all.mockResolvedValue(mockTasks);

        const response = await get('/tasks', { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockTasks);
        expect(taskQueries.all).toHaveBeenCalledTimes(1);
    });

    it('should return 401 if no token is provided', async () => {
        const response = await get('/tasks').expect(401);

        expect(response.body).toEqual({ error: 'No token provided' });
    });
});

describe('GET /tasks/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('should return 200', async () => {
        taskQueries.get.mockResolvedValue(mockTasks[0]);

        const response = await get(`/tasks/${mockTasks[0].id}`, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockTasks[0]);
        expect(taskQueries.get).toHaveBeenCalledTimes(1);
    });
});

describe('POST /tasks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        taskQueries.create.mockResolvedValue(mockTasks[0]);

        const response = await post('/tasks', { ...mockTasks[0] }, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockTasks[0]);
        expect(taskQueries.create).toHaveBeenCalledTimes(1);
    });
});

describe('POST /tasks/:id/subtasks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200', async () => {
        taskQueries.create.mockResolvedValue(mockTasks[0]);

        const response = await post(`/tasks/${mockTasks[0].id}/subtasks`, { ...mockTasks[0] }, { Authorization: mockToken }).expect(200);

        expect(response.body).toEqual(mockTasks[0]);
        expect(taskQueries.create).toHaveBeenCalledTimes(1);
    });
});