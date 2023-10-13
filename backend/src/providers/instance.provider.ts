import {
  UserService,
  OrderService,
  ProductService,
} from '@app'

/**
 * A Singleton class that provides access to various services.
 * This class ensures that only one instance of each service is created and provides
 * a way to access that instance.
 */
class Singleton {
  private static orderInstance: OrderService
  private static productInstance: ProductService
  private static userInstance: UserService

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
   * Returns the singleton instance of the OrderService class. If the instance does not exist,
   * it creates a new one.
   * @returns {OrderService} - The singleton instance of the OrderService class.
   */
  public static getProductInstance(): ProductService {
    if (!Singleton.productInstance) {
      Singleton.productInstance = new ProductService()
    }
    return Singleton.productInstance
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

  

  // /**
  //  * Returns the singleton instance of the AuthService class. If the instance does not exist,
  //  * it creates a new one.
  //  * @returns {AuthService} - The singleton instance of the AuthService class.
  //  */
  // public static getAuthInstance(): AuthService {
  //   if (!Singleton.authInstance) {
  //     Singleton.authInstance = new AuthService()
  //   }
  //   return Singleton.authInstance
  // }
}

export { Singleton }
