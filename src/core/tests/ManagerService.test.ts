import { ManagerService } from '../services/ManagerService';
import { ENDPOINTS } from '../constants';

describe('ManagerService', () => {
  let service: ManagerService;
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = {
      get: jest.fn(),
    };
    service = new ManagerService(mockAxios);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByPhone', () => {
    it('should return manager data when found', async () => {
      const phoneNumber = '380501234567';
      const mockResponse = {
        status: 'success',
        manager: {
          id: 1,
          fName: 'Ivan',
          lName: 'Ivanov',
          phone: '380501234567',
        },
        client: {
          id: 100,
          fName: 'Petro',
          lName: 'Petrov',
          mName: 'Petrovich',
          company: 'Company LLC',
        },
      };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await service.findByPhone(phoneNumber);

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.MANAGER.GET_BY_PHONE + phoneNumber);
      expect(result).toEqual(mockResponse);
    });

    it('should return error status when manager not found', async () => {
      const phoneNumber = '380000000000';
      const mockResponse = { status: 'error', message: 'Manager not found' };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await service.findByPhone(phoneNumber);

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.MANAGER.GET_BY_PHONE + phoneNumber);
      expect(result).toEqual(mockResponse);
    });
  });
});
