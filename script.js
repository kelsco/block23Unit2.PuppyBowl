// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2408-FTB-MT-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const players = await response.json();
    const pList = players.data;
    return pList["players"];
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};
const fetchTeams = async () => {
  try {
    const response = await fetch(`${API_URL}/teams`);
    const teams = await response.json();
    const tList = teams.data;
    return tList.teams;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const sPlayer = await response.json();
    const singlePlayer = sPlayer.data;
    return singlePlayer.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    const addPlayerReturn = await response.json();
    return addPlayerReturn.data.newPlayer;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
    return ErrorEvent;
    ;
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList, bodyMain) => {
  if (!playerList) {
    const noPlayerMessage = document.createElement("h1");
    noPlayerMessage.innerText = "No puppies here...";
    bodyMain.replaceChildren(noPlayerMessage);
  } else {
    const playerDeckPage = document.createElement("ul");
    const playerDeck = playerList.map((p) => {
      const playerCard = document.createElement("li");
      playerCard.id = p.id;
      playerCard.className = "player-card";
      playerCard.innerHTML = `
        <h2 id="${p.id}" class="player-card">${p.name}</h2>
        <div id="${p.id}" class="player-card">id#:${p.id}</div>
        <img id="${p.id}" class="player-card" src="${p.imageUrl}" alt="${p.name}">
      `;
      return playerCard;
    });
    playerDeckPage.replaceChildren(...playerDeck);
    bodyMain.replaceChildren(playerDeckPage);

    bodyMain.addEventListener("click", async (e) => {
      e.preventDefault();
      if (e.target.className === "player-card") {
        renderSinglePlayer(await fetchSinglePlayer(e.target.id), bodyMain);
      }
    });
  }
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player, bodyMain) => {
  const teamName = !player.team ? "Unassigned" : player.team.name;
  const playerCard = document.createElement("ul");
  playerCard.innerHTML = `
  <li>
  <button id="return">Back to all players</button>
  <h2>${player.name}</h2>
  <p><strong>ID: </strong>${player.id}</p>
  <p><strong>Breed: </strong>${player.breed}</p>
  <img src="${player.imageUrl}" alt="${player.name}">
  <h3>Team: ${teamName}</h3>
  <button id="delete-${player.id}" class="remove-button">Remove Player</button>
  </li>
  `;
  bodyMain.replaceChildren(playerCard);

  const returnButton = document.querySelector("#return");
  returnButton.addEventListener("click", (e) => {
    //return to main page
    e.preventDefault();
    location.reload();
  });
  const removeBtn = document.querySelector(".remove-button");
  removeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await removePlayer(player.id);
    location.reload();
  });
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = async (newPlayerForm) => {
  try {
    //fills in <form id="new-player-form"> with the approproate inputs and a submit button.
    const teamList = await fetchTeams();
    //create a string constant that takes the team names and populates the select element
    let selectElement =
      "<option default>Team Name</option><option>unassigned</option>";
    teamList.forEach((team) => {
      selectElement += `<option>${team.name}</option>`;
    });
    newPlayerForm.innerHTML = `
    <input type="text" id="name" placeholder="name">
    <input type="text" id="breed" placeholder="breed">
    <input type="text" id="image-url" placeholder="image url">
    <select id="team-selector">
    ${selectElement}
    </select>
    <button type="submit">Submit</button>     
    `;
    newPlayerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      //derive team id from select element
      const selectedName = newPlayerForm["team-selector"].value; //grab value from selector.
      let teamNum = 0;
      teamList.forEach((team) => {
        const result = team.name == selectedName ? team.id : 0;
        teamNum += result;
        // team.name === selectedName ? team.id : null ;
      });

      //create player object
      const newPlayer = {
        name: `${newPlayerForm.name.value}`,
        breed: `${newPlayerForm.breed.value}`,
        //status: bench (may not be required)
        imageUrl: `${newPlayerForm["image-url"].value}`,
      };
      teamNum !== 0 ? (newPlayer.teamId = teamNum) : null;
      await addNewPlayer(newPlayer); //playerObj argument
      location.reload();
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const bodyMain = document.querySelector("main");
  const newPlayerForm = document.querySelector("#new-player-form");

  const players = await fetchAllPlayers();
  renderAllPlayers(players, bodyMain);

  renderNewPlayerForm(newPlayerForm);
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
