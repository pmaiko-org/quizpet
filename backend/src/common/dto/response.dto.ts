import { IResponse } from "../interface/response.interface";

export class ResponseDto<D, M> implements IResponse<D, M> {
  constructor(
    public data: D,
    public meta: M,
  ) {}
}
