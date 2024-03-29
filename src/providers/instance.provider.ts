import {
  UserService,
  OrderService,
  ProductService,
  AdminService,
  AuthService,
  CartService
} from '@app'

/**
 * A Singleton class that provides access to various services.
 * This class ensures that only one instance of each service is created and provides
 * a way to access that instance.
 */
class Singleton {
  private static adminInstance: AdminService
  private static authInstance: AuthService
  private static orderInstance: OrderService
  private static productInstance: ProductService
  private static cartInstance: CartService
  private static userInstance: UserService

  /**
   * Returns the singleton instance of the AdminService class. If the instance does not exist,
   * it creates a new one.
   * @returns {AdminService} - The singleton instance of the AdminService class.
   */
  public static getAdminInstance(): AdminService {
    if (!Singleton.adminInstance) {
      Singleton.adminInstance = new AdminService()
    }
    return Singleton.adminInstance
  }

  /**
   * Returns the singleton instance of the AuthService class. If the instance does not exist,
   * it creates a new one.
   * @returns {AuthService} - The singleton instance of the AuthService class.
   */
  public static getAuthInstance(): AuthService {
    if (!Singleton.authInstance) {
      Singleton.authInstance = new AuthService()
    }
    return Singleton.authInstance
  }

  /**
   * Returns the singleton instance of the CartService class. If the instance does not exist,
   * it creates a new one.
   * @returns {CartService} - The singleton instance of the CartService class.
   */
  public static getCartInstance(): CartService {
    if (!Singleton.cartInstance) {
      Singleton.cartInstance = new CartService()
    }
    return Singleton.cartInstance
  }

  /**
   * Returns the singleton instance of the ProductService class. If the instance does not exist,
   * it creates a new one.
   * @returns {ProductService} - The singleton instance of the ProductService class.
   */
  public static getProductInstance(): ProductService {
    if (!Singleton.productInstance) {
      Singleton.productInstance = new ProductService()
    }
    return Singleton.productInstance
  }

  /**
   * Returns the singleton instance of the OrderService class. If the instance does not exist,
   * it creates a new one.
   * @returns {OrderService} - The singleton instance of the OrderService class.
   */
  public static getOrderInstance(): OrderService {
    if (!Singleton.orderInstance) {
      Singleton.orderInstance = new OrderService()
    }
    return Singleton.orderInstance
  }

  /**
   * Returns the singleton instance of the UserService class. If the instance does not exist,
   * it creates a new one.
   * @returns {UserService} - The singleton instance of the UserService class.
   */
  public static getUserInstance(): UserService {
    if (!Singleton.userInstance) {
      Singleton.userInstance = new UserService()
    }
    return Singleton.userInstance
  }
}

export { Singleton }
