const gameOutput = document.getElementById("game-output");
const playerInput = document.getElementById("player-input");
const submitButton = document.getElementById("submit-button");

const classes = {
  воин: {
    name: "Воин",
    description: "Сильный боец, полагающийся на грубую силу и броню.",
    hp: 120,
    strength: 15,
    maxHp: 120,
    startingEquipment: ["меч_воина", "железная_броня"]
  },
  маг: {
    name: "Маг",
    description: "Искусный заклинатель, использующий магию для атак и защиты.",
    hp: 80,
    strength: 5,
    maxHp: 80,
    startingEquipment: ["посох_мага", "мантия_мага"]
  },
  лучник: {
    name: "Лучник",
    description: "Меткий стрелок, наносящий урон на расстоянии.",
    hp: 100,
    strength: 10,
    maxHp: 100,
    startingEquipment: ["лук_охотника", "кожаная_броня"]
  }
};

const equipment = {
  меч_воина: {
    name: "Меч воина",
    type: "weapon",
    attack: 8,
    description: "Простой, но прочный меч."
  },
  лук_охотника: {
    name: "Лук охотника",
    type: "weapon",
    attack: 6,
    description: "Надежный лук для дальних атак."
  },
  посох_мага: {
    name: "Посох мага",
    type: "weapon",
    attack: 4,
    magic: 5, // Магический урон
    description: "Посох, усиливающий магические силы."
  },
  кожаная_броня: {
    name: "Кожаная броня",
    type: "armor",
    defense: 3,
    description: "Легкая кожаная броня."
  },
  железная_броня: {
    name: "Железная броня",
    type: "armor",
    defense: 6,
    description: "Прочная железная броня."
  },
  мантия_мага: {
    name: "Мантия мага",
    type: "armor",
    defense: 2,
    magic_resistance: 4, // Сопротивление магии
    description: "Тканая мантия, обеспечивающая некоторую защиту и сопротивление магии."
  }
};

// --- Ассортимент магазина ---
const shopInventory = {
  зелье: {
    name: "Зелье",
    description: "Восстанавливает немного здоровья.",
    price: 20,
    effect: "heal",
    healAmount: 30
  },
  меч_воина: { ...equipment.меч_воина, price: 100 },
  кожаная_броня: { ...equipment.кожаная_броня, price: 80 },
  лук_охотника: { ...equipment.лук_охотника, price: 90}
};

// --- Игровые данные ---
let player = {
  name: "Герой",
  level: 1,
  hp: 100,
  maxHp: 100,
  strength: 10,
  location: "город", // Начальная локация
  inventory: [],
  equipment: {
    weapon: null,
    armor: null
  },
  gold: 100 // Начальное золото
};

let currentEnemy = null; // Текущий враг (если есть)
let classChosen = false; // Флаг, показывающий, выбран ли класс

// --- Локации и NPC ---
const locations = {
  город: {
    description: "Вы находитесь в небольшом городке. Перед вами таверна, лавка торговца и дорога в лес.",
    actions: ["идти в таверну", "идти в лавку", "идти в лес", "статистика"]
  },
  таверна: {
    description: "Вы заходите в таверну. Несколько посетителей сидят за столами.",
    actions: ["поговорить с барменом", "вернуться в город", "статистика"]
  },
  лавка: {
    description: "Вы зашли в магазин. На полках лежат разные товары.",
    actions: ["купить", "вернуться в город", "статистика"]
  },
  лес: {
    description: "Вы входите в темный лес. Ветви деревьев переплетаются, закрывая солнце.",
    actions: ["сразиться с гоблином", "вернуться в город", "статистика"]
  },
  битва: {
    description: "Вы сражаетесь!",
    actions: ["атаковать", "бежать", "статистика"]
  }
};

const enemies = {
  гоблин: {
    name: "Гоблин",
    hp: 30,
    attack: 5,
    reward: 10
  }
};

function displayMessage(message) {
  gameOutput.textContent += message + "\n";
  gameOutput.scrollTop = gameOutput.scrollHeight;
}

function clearInput() {
  playerInput.value = "";
}

function handleInput(command) {
  command = command.toLowerCase().trim();

  if (!classChosen) {
    handleClassChoice(command);
  } else if (currentEnemy) { 
    handleBattleCommand(command);
  } else {
    handleLocationCommand(command);
  }

  clearInput();
}

function handleClassChoice(command) {
  if (classes[command]) {
    const chosenClass = classes[command];
    player.name = "Герой";
    player.level = 1;
    player.hp = chosenClass.hp;
    player.maxHp = chosenClass.maxHp;
    player.strength = chosenClass.strength;
    player.location = "город";
    player.inventory = [];
    player.equipment = { weapon: null, armor: null }; 
    player.gold = 100;

    displayMessage(`Вы выбрали класс ${chosenClass.name}!`);
    classChosen = true;

    chosenClass.startingEquipment.forEach(equipmentId => {
      const item = equipment[equipmentId];
      if (item.type === "weapon") {
        player.equipment.weapon = item;
        displayMessage(`Вы получили ${item.name} в качестве оружия.`);
      } else if (item.type === "armor") {
        player.equipment.armor = item;
        displayMessage(`Вы получили ${item.name} в качестве брони.`);
      }
    });

    displayPlayerStats();
    displayLocation();
  } else {
    displayMessage("Неверный класс. Попробуйте еще раз.");
    chooseClass(); 
  }
}

function handleLocationCommand(command) {
  switch (command) {
    case "идти в таверну":
      if (player.location === "город") {
        changeLocation("таверна");
      } else {
        displayMessage("Нельзя сюда пойти.");
      }
      break;
    case "идти в лавку":
      if (player.location === "город") {
        changeLocation("лавка");
      } else {
        displayMessage("Нельзя сюда пойти.");
      }
      break;
    case "идти в лес":
      if (player.location === "город") {
        changeLocation("лес");
      } else {
        displayMessage("Нельзя сюда пойти.");
      }
      break;
    case "вернуться в город":
      if (player.location !== "город") {
        changeLocation("город");
      } else {
        displayMessage("Вы уже в городе.");
      }
      break;
    case "поговорить с барменом":
      if (player.location === "таверна") {
        displayMessage("Бармен говорит: 'Приветствую, путник. Не желаешь чего выпить?'");
      } else {
        displayMessage("Здесь не с кем говорить.");
      }
      break;
    case "купить":
      if (player.location === "лавка") {
        displayShopInventory();
      } else {
        displayMessage("Здесь нечего покупать.");
      }
      break;
    case "статистика":
      displayPlayerStats();
      break;
    default:
      if (command.startsWith("купить ")) {
          const itemName = command.substring(6).trim();
          buyItem(itemName);
      } else {
        displayMessage("Неизвестная команда.");
      }
  }
}

function handleBattleCommand(command) {
  switch (command) {
    case "атаковать":
      attackEnemy();
      break;
    case "бежать":
      runFromBattle();
      break;
    case "статистика":
      displayPlayerStats();
      break;
    default:
      displayMessage("Неизвестная команда во время боя.");
  }
}

function changeLocation(locationKey) {
  player.location = locationKey;
  displayLocation();
}

function displayLocation() {
  const location = locations[player.location];
  displayMessage(location.description);

  if (location.actions && location.actions.length > 0) {
    displayMessage("Доступные действия: " + location.actions.join(", "));
  }

  if (player.location === 'битва' && currentEnemy) {
    displayEnemyStats();
  }

  if (player.location === 'лес' && !currentEnemy) {
    startBattle('гоблин');
  }
}

function startBattle(enemyName) {
  currentEnemy = { ...enemies[enemyName] };
  changeLocation('битва');
  displayMessage(`Вы встретили ${currentEnemy.name}!`);
  displayMessage("Бой начался! Доступные действия: атаковать, бежать, статистика");
  displayEnemyStats();
}

function attackEnemy() {
  let playerDamage = Math.floor(Math.random() * (player.strength - 5) + 5); 


  if (player.equipment.weapon) {
    playerDamage += player.equipment.weapon.attack;
  }


  let enemyDamage = Math.floor(Math.random() * currentEnemy.attack);

  if(player.equipment.armor){
    enemyDamage = Math.max(0, enemyDamage - player.equipment.armor.defense);
  }

  currentEnemy.hp -= playerDamage;
  displayMessage(`Вы нанесли ${playerDamage} урона!`);
  displayEnemyStats();

  if (currentEnemy.hp <= 0) {
    defeatEnemy();
    return;
  }

  player.hp -= enemyDamage;
  displayMessage(`${currentEnemy.name} нанес вам ${enemyDamage} урона!`);
  displayPlayerStats();

  if (player.hp <= 0) {
    gameOver();
  }
}

function defeatEnemy() {
  displayMessage(`Вы победили ${currentEnemy.name}!`);
  const experience = currentEnemy.reward;
  displayMessage(`Вы получили ${experience} опыта.`);
  player.hp = Math.min(player.hp + 20, player.maxHp);
  displayMessage(`Вы восстановили здоровье до ${player.hp} HP`);


  player.level += Math.floor(experience / 10);
  displayMessage(`Ваш уровень повышен до ${player.level}!`);
  currentEnemy = null;
  changeLocation(player.location);
  displayPlayerStats();
}

function runFromBattle() {
  displayMessage("Вы попытались сбежать...");
  if (Math.random() > 0.5) {
    displayMessage("Вам удалось сбежать!");
    currentEnemy = null;
    changeLocation(player.location);
  } else {
    displayMessage("Не удалось сбежать!");
    const enemyDamage = Math.floor(Math.random() * currentEnemy.attack);
    player.hp -= enemyDamage;
    displayMessage(`${currentEnemy.name} нанес вам ${enemyDamage} урона!`);
    displayPlayerStats();
    if (player.hp <= 0) {
      gameOver();
    }
  }
}

function displayPlayerStats() {
  let weaponStats = player.equipment.weapon ? `Атака: ${player.equipment.weapon.attack}` : "Нет";
  let armorStats  = player.equipment.armor ? `Защита: ${player.equipment.armor.defense}` : "Нет";

  displayMessage(`
    --- Статистика ---
    Имя: ${player.name}
    Класс: ${classes[player.name] ? classes[player.name].name : 'Нет'}
    Уровень: ${player.level}
    Здоровье: ${player.hp}/${player.maxHp}
    Золото: ${player.gold}
    Оружие: ${player.equipment.weapon ? player.equipment.weapon.name : 'Нет'} (${weaponStats})
    Броня: ${player.equipment.armor ? player.equipment.armor.name : 'Нет'} (${armorStats})
  `);
}

function displayEnemyStats() {
  if (currentEnemy) {
    displayMessage(`
      --- Враг ---
      Имя: ${currentEnemy.name}
      Здоровье: ${currentEnemy.hp}
    `);
  }
}

function gameOver() {
  displayMessage("Вы погибли...");
  player = {
    name: "Герой",
    level: 1,
    hp: 100,
    maxHp: 100,
    strength: 10,
    location: "город",
    inventory: [],
    equipment: {
      weapon: null,
      armor: null
    },
    gold: 100
  };
  currentEnemy = null;
  classChosen = false; 
  chooseClass();
}

function chooseClass() {
  displayMessage("Выберите свой класс:");
  for (const className in classes) {
    const classInfo = classes[className];
    displayMessage(`- ${classInfo.name}: ${classInfo.description}`);
  }
  displayMessage("Введите название класса (воин, маг, лучник):");
}

function displayShopInventory() {
  displayMessage("--- Ассортимент магазина ---");
  for (const itemName in shopInventory) {
    const item = shopInventory[itemName];
    displayMessage(`- ${item.name} (${item.price} золота): ${item.description}`);
  }
  displayMessage("Чтобы купить предмет, введите 'купить [название предмета]'.");
}

function buyItem(itemName) {
  if (player.location !== "лавка") {
    displayMessage("Вы не в магазине.");
    return;
  }

  if (!shopInventory[itemName]) {
    displayMessage("Такого товара нет в магазине.");
    return;
  }

  const item = shopInventory[itemName];

  if (!player.gold || player.gold < item.price) {
    displayMessage("Недостаточно золота.");
    return;
  }

  if (item.type === "armor" || item.type === "weapon") {
      if (player.equipment[item.type]) {
          displayMessage(`У вас уже есть ${item.type}! Чтобы купить это, надо сначала продать текущее.`);
          return;
      }
  }

  player.gold -= item.price;

  if (item.type === "weapon") {
    player.equipment.weapon = item;
    displayMessage(`Вы купили ${item.name} и надели его.`);
  } else if (item.type === "armor") {
    player.equipment.armor = item;
    displayMessage(`Вы купили ${item.name} и надели ее.`);
  } else if (item.effect === "heal") {
      player.hp = Math.min(player.maxHp, player.hp + item.healAmount);
      displayMessage(`Вы использовали ${item.name} и восстановили ${item.healAmount} здоровья. Текущее здоровье: ${player.hp}`);
  } else {
    player.inventory.push(item.name);
    displayMessage(`Вы купили ${item.name}.`);
  }

  displayPlayerStats();
}

submitButton.addEventListener("click", () => {
  const command = playerInput.value;
  handleInput(command);
});

playerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const command = playerInput.value;
    handleInput(command);
  }
});

chooseClass();