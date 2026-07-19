import { ApiProperty } from "@nestjs/swagger";

export class ProfileStatsResponseDto {
  @ApiProperty()
  peopleCount: number;

  @ApiProperty()
  mySetsCount: number;

  @ApiProperty()
  myTopicsCount: number;

  constructor(data: ProfileStatsResponseDto) {
    this.peopleCount = data.peopleCount;
    this.mySetsCount = data.mySetsCount;
    this.myTopicsCount = data.myTopicsCount;
  }
}
