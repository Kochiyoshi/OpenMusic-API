const ClientError = require('../../exceptions/ClientError');

class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this.authenticationService = authenticationService;
    this.userService = userService;
    this.tokenManager = tokenManager;
    this.validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this.validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      const id = await this.userService.verifyUserCredential(username, password);

      const accessToken = this.tokenManager.generateAccessToken({ id });
      const refreshToken = this.tokenManager.generateRefreshToken({ id });

      await this.authenticationService.addRefreshToken(refreshToken);

      return h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'error',
        message: error.message,
      }).code(500);
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this.validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this.authenticationService.verifyRefreshToken(refreshToken);
      const { id } = this.tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this.tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'error',
        message: error.message,
      }).code(500);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this.validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this.authenticationService.verifyRefreshToken(refreshToken);
      await this.authenticationService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'error',
        message: error.message,
      }).code(500);
    }
  }
}

module.exports = AuthenticationHandler;
