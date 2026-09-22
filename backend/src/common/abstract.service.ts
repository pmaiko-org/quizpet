import { Repository, FindManyOptions, ObjectLiteral } from "typeorm";
import {
  PaginationMetaDto,
  PaginationResponseDto,
} from "./dto/pagination.response.dto";
import { IPaginationQuery } from "./interface/pagination.query.interface";
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE,
} from "./constants/pagination.constants";

export class AbstractService<Entity extends ObjectLiteral, Dto> {
  constructor(
    protected readonly repository: Repository<Entity>,
    private readonly dtoClass: new (entity: Entity) => Dto,
  ) {}

  async paginate(
    query: IPaginationQuery,
    options?: FindManyOptions<Entity>,
  ): Promise<PaginationResponseDto<Dto>> {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const perPage = query.perPage ?? PAGINATION_DEFAULT_PER_PAGE;

    const [entities, total] = await this.repository.findAndCount({
      ...options,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const data = entities.map(entity => new this.dtoClass(entity));

    return new PaginationResponseDto(
      data,
      new PaginationMetaDto(page, perPage, total, Math.ceil(total / perPage)),
    );
  }
}
