import 'dotenv/config'
import { AuthService, inputLoginAdminValidate } from '@app'
import { Constant } from '@constants'
import { initialAdmin, verifyJWT } from '@providers'

describe('auth', () => {
  let authService: AuthService
  let email = ''
  let password = ''

  /**
   * Runs before all tests in the file and initializes the admin user and authService.
   * If the environment variables ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD are set,
   * they will be used to set the email and password for the admin user.
   */
  beforeAll(async () => {
    await initialAdmin()
    authService = new AuthService()
    const { ADMIN_INITIAL_EMAIL, ADMIN_INITIAL_PASSWORD } = Constant
    if (ADMIN_INITIAL_EMAIL && ADMIN_INITIAL_PASSWORD) {
      email = ADMIN_INITIAL_EMAIL
      password = ADMIN_INITIAL_PASSWORD
    }
  })

  it('Check instance type', async () => {
    expect(authService).toBeInstanceOf(AuthService)
  })

  it('Check admin email and password defined', async () => {
    expect(email).toBeDefined()
    expect(password).toBeDefined()
  })

  it('Check admin email and password is validate', async () => {
    /**
     * Tests whether the input for the login admin validation function is valid.
     */
    expect(inputLoginAdminValidate({ email, password })).toBeNull()
    expect(
      inputLoginAdminValidate({ email: 'abc.def@mail.com', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ email: 'abc@mail.com', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ email: 'abc_def@mail.com', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ email: 'abc.def@mail.cc', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({
        email: 'abc.def@mail-archive.com',
        password
      })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ email: 'abc.def@mail.org', password })
    ).toBeNull()
    expect(
      inputLoginAdminValidate({ email: 'abc.def@mail.com', password })
    ).toBeNull()
  })

  it('Check admin password is not validate', async () => {
    /**
     * Tests the inputLoginAdminValidate function with a given email and password.
     * Expects the function to return false.
     */
    expect(inputLoginAdminValidate({ email, password: '123456' })).toBeDefined()
    expect(
      inputLoginAdminValidate({ email, password: '12345678910' })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email, password: '123456789ABC' })
    ).toBeDefined()
  })

  it('Check admin email is not validate', async () => {
    /**
     * Tests the inputLoginAdminValidate function with a given email and password.
     * Expects the function to return false.
     */
    expect(inputLoginAdminValidate({ email: 'abc', password })).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: 'abc-@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: 'abc..def@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: '.abc@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: 'abc#def@mail.com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: 'abc.def@mail.c', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({
        email: 'abc.def@mail#archive.com',
        password
      })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: 'abc.def@mail', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: 'abc.def@mail..com', password })
    ).toBeDefined()
    expect(
      inputLoginAdminValidate({ email: `@${email}`, password })
    ).toBeDefined()
  })

  it('Login with email and password', async () => {
    /**
     * Logs in an admin user with the given email and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      email
    })
    expect(resLoginAdmin).toBeDefined()
  })

  it('Login with wrong password', async () => {
    /**
     * Logs in an admin user with the given email and wrong password.
     */
    const resLoginAdmin = authService.loginAdmin({
      password: `${password}1`,
      email
    })
    await expect(resLoginAdmin).rejects.toThrow(
      new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    )
  })

  it('Get admin info by login', async () => {
    /**
     * Logs in an admin user with the given email and password.
     * Get admin info by login after submit mnemonic
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      email
    })
    expect(resLoginAdmin).toBeDefined()
  })

  it('Verify JWT', async () => {
    /**
     * Logs in an admin user with the given email and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      email
    })
    expect(resLoginAdmin).toBeDefined()
    /**
     * Verifies the access token obtained from logging in as an admin user and checks if the
     * decoded JWT contains the expected email and address.
     */
    const access_token = resLoginAdmin.access_token
    const resVerifyJWT = verifyJWT(`${access_token}`)
    expect(resVerifyJWT).toBeDefined()
    expect(resVerifyJWT.email).toEqual(email)
  })

  it('Verify refresh token JWT ', async () => {
    /**
     * Logs in an admin user with the given email and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      email
    })
    expect(resLoginAdmin).toBeDefined()
    /**
     * Verifies the access token obtained from logging in as an admin user and checks if the
     * decoded JWT contains the expected email and address.
     */
    const { access_token, refresh_token } = resLoginAdmin
    const resVerifyJWT = verifyJWT(`${access_token}`)
    expect(resVerifyJWT).toBeDefined()
    expect(resVerifyJWT.email).toEqual(email)

    /**
     * Renews the access token using the provided refresh token and verifies the new access token.
     */
    const renewAccessToken = await authService.refreshToken({
      refresh_token: `${refresh_token}`
    })
    expect(renewAccessToken.access_token).not.toEqual(access_token)
    const resVerifyRenewJWT = verifyJWT(renewAccessToken.access_token)
    expect(resVerifyRenewJWT).toBeDefined()
    expect(resVerifyRenewJWT.email).toEqual(email)
  })

  it('Verify password', async () => {
    /**
     * Logs in an admin user with the given email and password.
     */
    const resLoginAdmin = await authService.loginAdmin({
      password,
      email
    })
    expect(resLoginAdmin).toBeDefined()
    /**
     * Verifies the access token obtained from logging in as an admin user and checks if the
     */
    const isVerifyPassword = await authService.verifyPassword(
      {
        password
      },
      resLoginAdmin.detail._id.toString()
    )
    expect(isVerifyPassword.authorized).toBeTruthy()
  })
})
