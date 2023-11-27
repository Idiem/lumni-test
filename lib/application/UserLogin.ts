import { ConflictException, UnauthorizedException } from "@storyofams/next-api-decorators";
import { singleton } from "tsyringe";

import UserEntity from "@domain/models/UserEntity";
import UsersRepository from "@domain/repository/UsersRepository";
import IdsGenerationServices from "@domain/IdsGenerationServices";
import LoginIntentEntity from "@domain/models/LoginIntentEntity";
import LoginIntentsRepository from "@domain/repository/LoginIntentsRepository";

import IUserLoginWithEmailAndPasswordDto from "@application/requestsModels/IUserLoginWithEmailAndPasswordDto";
import IAuthorizationDataDto from "@application/models/IAuthorizationDataDto";


@singleton()
class UserLogin {

  static JWT_TOKEN_EXPIRATION_HOURS = 7 * 24;

  constructor(
    private usersRepository: UsersRepository,
    private idsGenerationService: IdsGenerationServices,
    private loginIntentsRepository: LoginIntentsRepository,
  ) { }

  public async loginWithEmailAndPassword(request: IUserLoginWithEmailAndPasswordDto): Promise<IAuthorizationDataDto> {
    const user = await this.usersRepository.fetchByEmail(request.email);
    if (user === null) {
      throw new UnauthorizedException("Invalid Credentials");
    }
    const date = new Date();
    const fiveMinutesAgo = new Date(date.getTime() - (5 * 60000));
    const trys = (await this.loginIntentsRepository.fetchByUserIdAndCreatedAt(user.id, fiveMinutesAgo));
    const failedLogin = trys.filter(x => !x.wasSuccess);

    if (failedLogin.length >= 4) {
      throw new ConflictException("Too many login attempts");
    }

    const loginIntent = LoginIntentEntity.factory(
      this.idsGenerationService.nextId(), {
      user,
      wasSuccess: false,
    });

    const isPasswordValid = await user.validatePassword(request.password);
    if (!isPasswordValid) {
      

      await this.loginIntentsRepository.saveNew(loginIntent);
      throw new UnauthorizedException("Invalid Credentials");
    }

    loginIntent.setAsSuccess();
    await this.loginIntentsRepository.saveNew(loginIntent);
    return this.factoryAuthorizationData(user);
  }

  // Private Methods
  
  private calculateTokenExpiration(user: UserEntity): Date {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + UserLogin.JWT_TOKEN_EXPIRATION_HOURS);
    return expiration;
  }

  private factoryAuthorizationData(user: UserEntity): IAuthorizationDataDto {
    const expiration = this.calculateTokenExpiration(user).toISOString();
    return {
      userId: user.id,
      roles: user.roles,
      expiration,
      personId: user.personId,
    };
  }

}

export default UserLogin;
