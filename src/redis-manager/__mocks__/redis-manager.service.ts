export const CACHE_MANAGER = {
  set: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue('USER_MOCK_OBJECT'),
  del: jest.fn().mockResolvedValue('OK'),
  reset: jest.fn().mockResolvedValue('OK'),
};
