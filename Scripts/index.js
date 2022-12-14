import { styling, gameStart } from "./unit.js";
import unitJson from "./unitInfo.js";

const root = document.getElementById("root");
styling(root, {
  width: "100vw",
  height: "100vh",
});

const canvas = document.getElementById("canvas");
styling(canvas, {
  width: "600px",
  height: "800px",
  overflow: "hidden",
});

let move_switch = false;
function moving(unit, speed, direction, clear) {
  if (!move_switch) {
    move_switch = true;
    unit.moveUnit(speed, direction, clear).then(() => {
      move_switch = false;
    });
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") {
    moving(user, -1, "left", 10);
  } else if (e.key === "ArrowRight" || e.key === "d") {
    moving(user, 1, "left", 10);
  } else if (e.key === "ArrowDown" || e.key === "s") {
    moving(user, 1, "top", 10);
  } else if (e.key === "ArrowUp" || e.key === "w") {
    moving(user, -1, "top", 10);
  }
});
// 캐릭터 이동

const stageInfo = {
  number: 1,
  score: 0,
  skill: 3,
  info: [
    {},
    { 1: 3 },
    { 1: 4 },
    { 1: 4, 2: 1 },
    { 1: 4, 2: 2, 3: 1 },
    { 1: 5, 2: 3, 3: 1 },
    { 1: 5, 2: 4, 3: 1 },
    { 1: 5, 2: 5, 3: 1 },
  ],
};
//스테이지 정보
export class Unit {
  constructor(
    name,
    hp,
    att,
    attSpeed,
    speed,
    top,
    left,
    width,
    height,
    img,
    skill,
    score
  ) {
    this.name = name;
    this.hp = hp;
    this.att = att;
    this.attSpeed = attSpeed;
    this.speed = speed;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.img = img;
    this.skill = skill;
    this.score = score;
  }
  makeUnit() {
    const div = document.createElement("div");
    div.className = this.name;
    styling(div, {
      width: this.width + "px",
      height: this.height + "px",
      position: "absolute",
      top: this.top + "px",
      left: this.left + "px",
    });
    canvas.appendChild(div);
    const img = document.createElement("img");
    img.src = this.img;
    styling(img, {
      width: this.width + "px",
      height: this.height + "px",
    });
    div.appendChild(img);
    const hpBar = document.createElement("div");
    styling(hpBar, {
      width: "80%",
      height: "5px",
      backgroundColor: "white",
      border: "1px black solid",
      position: "absolute",
      left: "10%",
      top: "100%",
    });
    div.appendChild(hpBar);
    const nowHp = document.createElement("div");
    styling(nowHp, {
      width: "100%",
      height: "100%",
      backgroundColor: "red",
    });
    hpBar.appendChild(nowHp);
    let maxHp = this.hp;
    let hpInterval = setInterval(() => {
      nowHp.style.width = (this.hp / maxHp) * 100 + "%";
      if (this.hp <= 0) {
        clearInterval(hpInterval);
      }
    }, 1000 / 60);
  }
  moveUnit(speed, direction, clear) {
    return new Promise((resolve, reject) => {
      if (speed > 0 && this.left >= 600 - this.width && direction === "left") {
        resolve();
      } else if (speed < 0 && this.left <= 0 && direction === "left") {
        resolve();
      } else if (
        speed > 0 &&
        this.top >= 790 - this.height &&
        direction === "top"
      ) {
        resolve();
      } else if (speed < 0 && this.top <= 0 && direction === "top") {
        resolve();
      } else {
        let unitClass = document.getElementsByClassName(this.name);
        let unitClass0 = unitClass[0];
        let now = this[direction];
        let obj = {};
        obj[direction] = setInterval(() => {
          this[direction] += (this.speed * speed) / 100;
          unitClass0.style[direction] = this[direction] + "px";
          if (this[direction] <= 0) {
            clearInterval(obj[direction]);
            resolve();
          }
          if (speed > 0 && this[direction] >= now + clear) {
            clearInterval(obj[direction]);
            resolve();
          }
          if (speed < 0 && this[direction] <= now - clear) {
            clearInterval(obj[direction]);
            resolve();
          }
        }, 1000 / 100);
      }
    });
  }
  rowmoveUnit() {
    let unitClass = document.getElementsByClassName(this.name);
    let unitClass0 = unitClass[0];
    let leftMove = true;
    let row = setInterval(() => {
      if (leftMove) {
        this.left += 0.5;
      } else {
        this.left -= 0.5;
      }
      unitClass0.style.left = this.left + "px";
      if (this.left > 500 - this.width) {
        leftMove = false;
      } else if (this.left < 50) {
        leftMove = true;
      }
    }, 1000 / 60);
  }
  UnitSkill(index) {
    let item = new Unit(
      "monster_skill" + index,
      1, //hp
      5, //att
      0, //attspeed
      125, //speed
      0, //top
      50 + Math.random() * 500, //left
      40, //width
      40, //height
      "./img/coin.jpg", //img
      false,
      0
    );
    item.makeUnit();
    item.moveUnit(1, "top", 800);
    return item;
  }
}
// 유닛 클래스
function unitSet(unit) {
  return new Unit(
    unit.name,
    unit.hp,
    unit.att,
    unit.attSpeed,
    unit.speed,
    unit.axios.top,
    unit.axios.left,
    unit.axios.width,
    unit.axios.height,
    unit.img,
    unit.skill,
    unit.score
  );
}
// 유닛 설정
// function makeMonster_easy(array, many) {
//   for (let i = 0; i < many; i++) {
//     let monster = new Unit(
//       "monster_e" + i,
//       75, //hp
//       15, //att
//       0, //attspeed
//       30, //speed
//       10, //top
//       i * 100 + 50 + Math.random() * 50, //left
//       50, //width
//       50, //height
//       "./img/b.png", //img
//       false,
//       100
//     );
//     array.push(monster);
//   }
// }
// function makeMonster_normal(array, many) {
//   for (let i = 0; i < many; i++) {
//     let monster = new Unit(
//       "monster_n" + i,
//       120, //hp
//       20, //att
//       0, //attspeed
//       40, //speed
//       1, //top
//       i * 150 + 20 + Math.random() * 80, //left
//       80, //width
//       80, //height
//       "./img/c.png", //img
//       false,
//       300
//     );
//     array.push(monster);
//   }
// }
// function makeMonster_prog(array, many) {
//   for (let i = 0; i < many; i++) {
//     let monster = new Unit(
//       "monster_p" + i,
//       400, //hp
//       80, //att
//       0, //attspeed
//       5, //speed
//       0, //top
//       200, //left
//       200, //width
//       200, //height
//       "./img/prog.png", //img
//       "coin",
//       1000
//     );
//     array.push(monster);
//   }
// }
export function makeMonsters(stage) {
  let monsterArray = [];
  let monsterObj = stageInfo.info[stage];
  for (let i in monsterObj) {
    for (let j = 0; j < monsterObj[i]; j++) {
      let monster = unitSet(unitJson[i]);
      monster.name += j;
      monster.left += j * 100;
      monsterArray.push(monster);
    }
  }
  monsterArray.map((item) => {
    item.makeUnit();
    item.moveUnit(1, "top", 800);
    item.rowmoveUnit(100);
  });
  return monsterArray;
}

const user = unitSet(unitJson[0]);

user.makeUnit();
gameStart(user, makeMonsters(1), stageInfo);
