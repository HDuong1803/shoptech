import {
  UserService,
  OrderService,
  ProductService,
  AdminService,
  AuthService,
} from '@app'

class Singleton {
  private static adminInstance: AdminService
  private static authInstance: AuthService
  private static orderInstance: OrderService
  private static productInstance: ProductService
  private static userInstance: UserService

  public static getAdminInstance(): AdminService {
      if (!Singleton.adminInstance) {
        Singleton.adminInstance = new AdminService()
      }
      return Singleton.adminInstance
    }

  public static getAuthInstance(): AuthService {
    if (!Singleton.authInstance) {
      Singleton.authInstance = new AuthService()
    }
    return Singleton.authInstance
  }

  public static getOrderInstance(): OrderService {
    if (!Singleton.orderInstance) {
      Singleton.orderInstance = new OrderService()
    }
    return Singleton.orderInstance
  }

  public static getProductInstance(): ProductService {
    if (!Singleton.productInstance) {
      Singleton.productInstance = new ProductService()
    }
    return Singleton.productInstance
  }

  public static getUserInstance(): UserService {
    if (!Singleton.userInstance) {
      Singleton.userInstance = new UserService()
    }
    return Singleton.userInstance
  }
}

export { Singleton }
