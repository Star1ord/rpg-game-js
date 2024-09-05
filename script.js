// defining default variables
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
// game has 4 weapons
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

// games has 2 mobs and 1 boss
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]

// 3 locations, 2 actions, 2 effects and easter egg
// objects properties are: name of the location, text of button in array, function of the each button in array
// text below the buttons
const locations = [
  {
    //initial location. 
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    // fighting options against 'monsters' array
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    // actions after slaying beast.
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg], //if 3rd button was pressed, player plays mini game 
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    //if health <= 0 
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;" //skull emoji
  },
  { 
    // end game/after slaying dragon.
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" //salute emoji 
  },
  {
    // easter egg mini game
    //gives 20 gold if won, else takes 10 health.
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;


// changes text of buttons and it's functions from 'location' array of objects
// + changes text below buttons
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

// sends to location 1: town
function goTown() {
  update(locations[0]);
}

// sends to location 2: store
function goStore() {
  update(locations[1]);
}

// sends to location 3: cave
function goCave() {
  update(locations[2]);
}

// button 1, in location 2: store
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

// button 2, in location 2: store
function buyWeapon() {
    // assures that, we have at least 1 weapon
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

// works, if we already have the most powerful weapon in game
function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// button 1, in location 3: cave
function fightSlime() {
  fighting = 0;  //index of monster in 'monsters' array.
  goFight();
}

// button 2, in location 3: cave
function fightBeast() {
  fighting = 1; //index of monster in 'monsters' array.
  goFight();
}

// button 3, in location 1: town
function fightDragon() {
  fighting = 2;  //index of monster in 'monsters' array.
  goFight();
}

// fighting options against 'monsters' array
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health; //takes initial health from 'monsters'
  monsterStats.style.display = "block"; // to show health bar of monster
  monsterName.innerText = monsters[fighting].name; // displays name of monster
  monsterHealthText.innerText = monsterHealth; // displays health of monster
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name /* takes last item 
  from inventory*/ + ".";
  health -= getMonsterAttackValue(monsters[fighting].level); /*randomly damages player 
  using formula in another function */
  
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;  // random(0, 1.0) * 
// xp of player + 1  
  
} else {
    text.innerText += " You miss."; // monster dodged
  }
  healthText.innerText = health; 
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) { // you lost game
    lose();
  } else if (monsterHealth <= 0) {  
    if (fighting === 2) {       // if dragon defeated           
      winGame();                // game is won!
    } else {
      defeatMonster(); // if it was not dragon 
    }
  }
// weapon break system.
// if random number is 0.1 and it's not only weapon
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0; // if hit is more than 0 it makes hit
//   it's done, to avoid exploit, where 2nd part of equation is more than monster's attack power
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20; // 20% miss chance or our health is < 20
}

// function is like exploit. 100% of dodging a hit is wrong.
// further should be fixed
function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name; 
}

// monster's xp is now our xp.
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7); // 6.7 is just random number.
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}
// if lost. you're dropped to default values
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

//easter eggs' function
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}