import { resolveClass } from "@container";
import { createHandler, Get, Catch, Query } from "@storyofams/next-api-decorators";
import { AuthInfo, JwtAuthGuard } from "@presentation/nextApiMiddlewares/JwtAuth";
import type IAuthorizationDataDto from "@application/models/IAuthorizationDataDto";
import { logExceptions, LogRequests } from "@presentation/nextApiMiddlewares/AppInsights";
import AdminPersonController from "@application/AdminGetPersonData";

@Catch(logExceptions)
class AdminPersonIndexController {

  private readonly searchServices = resolveClass(AdminPersonController);

  @Get()
  @LogRequests()
  @JwtAuthGuard()
  async search(@Query("keyWords") keywords: string, @AuthInfo() authInfo?: IAuthorizationDataDto) {
    const result = await this.searchServices.getAllPersons(keywords, authInfo);
    return result;
  }
}

export default createHandler(AdminPersonIndexController);