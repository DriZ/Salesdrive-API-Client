import { ProductService } from '../services/ProductService';
import { ENDPOINTS } from '../constants';

describe('ProductService', () => {
  let service: ProductService;
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = {
      post: jest.fn(),
    };
    service = new ProductService(mockAxios);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProducts', () => {
    it('should create products successfully', async () => {
      const products = [{ id: '1', name: 'Product 1' }];
      const mockResponse = { status: 'success', message: 'Created' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.createProducts(products);

      expect(mockAxios.post).toHaveBeenCalledWith(ENDPOINTS.PRODUCT.HANDLER, {
        action: 'add',
        product: products,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateProducts', () => {
    it('should update products successfully', async () => {
      const products = [{ id: '1', name: 'Updated Product' }];
      const dontUpdateFields: any[] = ['costPerItem'];
      const mockResponse = { status: 'success', message: 'Updated' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.updateProducts(products, dontUpdateFields);

      expect(mockAxios.post).toHaveBeenCalledWith(ENDPOINTS.PRODUCT.HANDLER, {
        action: 'update',
        product: products,
        dontUpdateFields: dontUpdateFields,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should update products without dontUpdateFields', async () => {
      const products = [{ id: '1', name: 'Updated Product' }];
      const mockResponse = { status: 'success', message: 'Updated' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.updateProducts(products);

      expect(mockAxios.post).toHaveBeenCalledWith(ENDPOINTS.PRODUCT.HANDLER, {
        action: 'update',
        product: products,
        dontUpdateFields: undefined,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteProducts', () => {
    it('should delete products successfully', async () => {
      const productIds = ['1', '2'];
      const mockResponse = { status: 'success', message: 'Deleted' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.deleteProducts(productIds);

      expect(mockAxios.post).toHaveBeenCalledWith(ENDPOINTS.PRODUCT.HANDLER, {
        action: 'delete',
        product: [{ id: '1' }, { id: '2' }],
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createCategories', () => {
    it('should create categories successfully', async () => {
      const categories = [{ name: 'Category 1', parentId: 0 }];
      const mockResponse = { status: 'success', message: 'Created' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.createCategories(categories);

      expect(mockAxios.post).toHaveBeenCalledWith(ENDPOINTS.CATEGORY.HANDLER, {
        action: 'add',
        category: categories,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateCategories', () => {
    it('should update categories successfully', async () => {
      const categories = [{ id: 1, name: 'Updated Category' }];
      const mockResponse = { status: 'success', message: 'Updated' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.updateCategories(categories);

      expect(mockAxios.post).toHaveBeenCalledWith(ENDPOINTS.CATEGORY.HANDLER, {
        action: 'update',
        category: categories,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteCategories', () => {
    it('should delete categories successfully', async () => {
      const categoryIds = [1, 2];
      const mockResponse = { status: 'success', message: 'Deleted' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.deleteCategories(categoryIds);

      expect(mockAxios.post).toHaveBeenCalledWith(ENDPOINTS.CATEGORY.HANDLER, {
        action: 'delete',
        category: [{ id: 1 }, { id: 2 }],
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
