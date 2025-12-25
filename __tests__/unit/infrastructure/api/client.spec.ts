import { ApiClient } from '../../../../src/infrastructure/api/client';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('http://localhost:3000');
    jest.clearAllMocks();
  });

  describe('parseResponse helper', () => {
    it('should handle 204 No Content responses', async () => {
      const mockResponse = {
        status: 204,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            if (header === 'content-type') return null;
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      const result = await (client as any).parseResponse(mockResponse);
      expect(result).toBeUndefined();
    });

    it('should handle empty content-length', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            if (header === 'content-type') return 'application/json';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      const result = await (client as any).parseResponse(mockResponse);
      expect(result).toBeUndefined();
    });

    it('should handle non-JSON content-type', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-type') return 'text/plain';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue('some text'),
      } as unknown as Response;

      const result = await (client as any).parseResponse(mockResponse);
      expect(result).toBeUndefined();
    });

    it('should handle empty text content', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-type') return 'application/json';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue('   '),
      } as unknown as Response;

      const result = await (client as any).parseResponse(mockResponse);
      expect(result).toBeUndefined();
    });

    it('should parse valid JSON content', async () => {
      const jsonData = { id: '123', name: 'Test' };
      const mockResponse = {
        status: 200,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-type') return 'application/json';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(JSON.stringify(jsonData)),
      } as unknown as Response;

      const result = await (client as any).parseResponse(mockResponse);
      expect(result).toEqual(jsonData);
    });
  });

  describe('POST method', () => {
    it('should handle 201 Created with empty body', async () => {
      const mockResponse = {
        status: 201,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            if (header === 'content-type') return null;
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.post('/test', { data: 'test' });
      expect(result).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: 'test' }),
      });
    });

    it('should handle 201 Created with JSON body', async () => {
      const jsonData = { id: '123', created: true };
      const mockResponse = {
        status: 201,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-type') return 'application/json';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(JSON.stringify(jsonData)),
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.post<typeof jsonData>('/test', { data: 'test' });
      expect(result).toEqual(jsonData);
    });
  });

  describe('PUT method', () => {
    it('should handle 200 OK with empty body', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            if (header === 'content-type') return null;
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.put('/test/123', { data: 'test' });
      expect(result).toBeUndefined();
    });

    it('should handle 204 No Content', async () => {
      const mockResponse = {
        status: 204,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.put('/test/123', { data: 'test' });
      expect(result).toBeUndefined();
    });
  });

  describe('PATCH method', () => {
    it('should handle 200 OK with empty body', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            if (header === 'content-type') return null;
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.patch('/test/123', { data: 'test' });
      expect(result).toBeUndefined();
    });

    it('should handle 204 No Content', async () => {
      const mockResponse = {
        status: 204,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.patch('/test/123', { data: 'test' });
      expect(result).toBeUndefined();
    });
  });

  describe('DELETE method', () => {
    it('should handle 204 No Content', async () => {
      const mockResponse = {
        status: 204,
        ok: true,
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'content-length') return '0';
            return null;
          }),
        },
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.delete('/test/123');
      expect(result).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('should throw error for non-ok responses', async () => {
      const mockResponse = {
        status: 404,
        ok: false,
        headers: {
          get: jest.fn(),
        },
      } as unknown as Response;

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(client.post('/test', { data: 'test' })).rejects.toThrow(
        'HTTP error! status: 404',
      );
    });
  });
});
