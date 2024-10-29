const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", () => {  //why are these async?
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

// TODO: Tests for `fetchSinglePlayer`
describe("fetchSinglePlayer", () => {
  // Make the API call once before all the tests run:
  //call players
  let players;
  let player;
  beforeAll(async () => {
    players = await fetchAllPlayers();
    //run specific id-number as argument for  fetchSinglePlayer
    //run id at index [player.length-1] for specific index
    player = await fetchSinglePlayer(players[players.length - 1].id);
  });
  //expect to return an object
  test("returns an object",  () => {
    expect(typeof player).toBe("object");
    expect(player).not.toBeNull();
    expect(Array.isArray(player)).toBe(false);
  });
  //expect name, id, breed, and team
  test("returns player card with name, id, breed, and status", () => {
    expect(player).toHaveProperty("name");
    expect(player).toHaveProperty("id");
    expect(player).toHaveProperty("breed");
    expect(player).toHaveProperty("status");
  });
});
describe("addNewPlayer", () => {
  let players;
  let player;
  let playerObj;
  let newPlayer;
  let initPlayerCount;
  let newPlayerCount;
  beforeAll(async () => {
    players = await fetchAllPlayers();
    initPlayerCount = players.length;
    player = await fetchSinglePlayer(players[players.length - 1].id);
    playerObj = {
      name: `${player.name}`,
      breed: `${player.breed}`,
      imageUrl: `${player.imageUrl}`,
    }
    newPlayer = await addNewPlayer(playerObj);
    players = await fetchAllPlayers();
    newPlayerCount = players.length;
  });
  test('Expect newPlayer to return the player object',  () => {
    expect(typeof newPlayer).toBe("object");
    expect(newPlayer).not.toBeNull();
    expect(Array.isArray(newPlayer)).toBe(false);
  });
  test('Expect new player count to be higher than initial player count',  () => {
    expect(newPlayerCount - initPlayerCount === 1).toBe(true);
  });
  test('Expect return object to have an id, a createdAt, and cohortId',  () => {
    expect(newPlayer).toHaveProperty('id');
    expect(newPlayer).toHaveProperty('createdAt');
    expect(newPlayer).toHaveProperty('cohortId');
  });
});
describe("removePlayer", () => {
  let players;
  let playerId;
  let initPlayerCount;
  let newPlayerCount;
  beforeAll(async () => {
    players = await fetchAllPlayers();
    initPlayerCount = players.length;
    playerId = await players[players.length - 1].id;
    await removePlayer(playerId);
  });
  test('Expect player count to reduce by one upon successful delete call', async () => {
    players = await fetchAllPlayers();
    newPlayerCount = players.length;
    expect(newPlayerCount - initPlayerCount === -1 ).toBe(true);    
  });
});