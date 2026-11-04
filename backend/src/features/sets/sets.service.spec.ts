import { SetsService } from "./sets.service";

const createService = () => {
  const findAndCount = jest.fn<Promise<[never[], number]>, [unknown]>();
  findAndCount.mockResolvedValue([[], 0]);
  const findOne = jest.fn<Promise<undefined>, [unknown]>();
  findOne.mockResolvedValue(undefined);
  const setRepository = {
    findAndCount,
    findOne,
  };
  const service = new SetsService(
    {} as never,
    {} as never,
    {} as never,
    setRepository as never,
    {} as never,
    {} as never,
  );
  return { service, setRepository };
};

describe("SetsService MCP ownership boundaries", () => {
  it("scopes every text-search branch to the authenticated owner", async () => {
    const { service, setRepository } = createService();

    await service.searchOwnedSets("user-1", {
      search: "travel",
      englishLevel: "b1",
      topic: "languages",
      page: 1,
      perPage: 20,
    });

    const options = setRepository.findAndCount.mock.calls[0][0] as {
      where: unknown[];
    };
    expect(options.where).toHaveLength(2);
    expect(options.where).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: { id: "user-1" },
          englishLevel: { value: "b1" },
          topics: { value: "languages" },
        }),
      ]),
    );
  });

  it("loads a set only when it belongs to the authenticated owner", async () => {
    const { service, setRepository } = createService();

    await service.getOwnedSet("user-1", "set-1");

    expect(setRepository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "set-1", user: { id: "user-1" } },
      }),
    );
  });
});
