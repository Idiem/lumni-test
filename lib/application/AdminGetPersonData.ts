import { singleton } from 'tsyringe';
import PersonsRepository from '../domain/repository/PersonsRepository';
import PersonDtoMapper from './mappers/PersonDtoMapper';
import IAuthorizationDataDto from './models/IAuthorizationDataDto';
import IPersonDto from './models/IPersonDto';
import UserRole from '@domain/models/UserRole';
import { UnauthorizedException } from '@storyofams/next-api-decorators';

@singleton()
export default class AdminGetPersonData {
  constructor(
    private personDtoMapper: PersonDtoMapper,
    private personsRepository: PersonsRepository
  ) {}

  async getPersonById(
    id: string,
    authInfo?: IAuthorizationDataDto
  ): Promise<IPersonDto | null> {
    if (authInfo === undefined || !authInfo.roles.includes(UserRole.Staff)) {
      throw new UnauthorizedException('Allowed for Staff Only');
    }

    const entity = await this.personsRepository.fetchById(id);
    if (!entity) {
      return null;
    }

    return this.personDtoMapper.entityToDto(entity);
  }

  async getPersonsByEmploymentInfoKeyWords(
    searchString: string,
    authInfo?: IAuthorizationDataDto
  ): Promise<IPersonDto[] | null> {
    if (authInfo === undefined || !authInfo.roles.includes(UserRole.Staff)) {
      throw new UnauthorizedException('Allowed for Staff Only');
    }

    const entity = await this.getPersonsByEmploymentInfoKeyWords(searchString);
    if (!entity) return null;
    return entity;
  }

  async getAllPersons(
    keyWords: string,
    authInfo?: IAuthorizationDataDto
  ): Promise<IPersonDto[] | null> {
    if (authInfo === undefined || !authInfo.roles.includes(UserRole.Staff)) {
      throw new UnauthorizedException('Allowed for Staff Only');
    }
    let entities =
      keyWords?.trim().length == 0 || !keyWords
        ? await this.personsRepository.fetchAllWithEmploymentInfo()
        : await this.personsRepository.fetchByEmploymentInfoKeyWords(keyWords);
    return entities && entities.map((x) => this.personDtoMapper.entityToDto(x));
  }
}
