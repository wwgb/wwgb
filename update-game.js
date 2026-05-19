const fs = require('fs');

// 随机选择今日答案
const items = ['🧻 纸巾', '🥕 胡萝卜'];
const chosenIndex = Math.random() < 0.5 ? 0 : 1; // 0=纸巾, 1=胡萝卜
const chosenItem = items[chosenIndex];
const correctSide = chosenIndex === 0 ? 'left' : 'right'; // 纸巾在左，胡萝卜在右

let readme = fs.readFileSync('README.md', 'utf8');

// 替换题目（可能会残留旧值，所以用正则全局替换）
readme = readme.replace(
  /<!-- GAME_ITEM -->(🧻 纸巾|🥕 胡萝卜)/g,
  `<!-- GAME_ITEM -->${chosenItem}`
);

// 生成两个折叠框里的内容
const winMessage = `
<div style="font-size:2em;">🐱👉 ${chosenItem}</div>
<div style="font-size:1.3em; color:#58a6ff;">🎉 蒸蚌！你猜对啦！</div>
`;
const loseMessage = `
<div style="font-size:2em;">🐱👉 ${chosenItem}</div>
<div style="font-size:1.3em; color:#f85149;">❌ 不对哦，大开门抓了${chosenItem}</div>
`;

// 把赢的消息放到正确侧，输的消息放到错误侧
if (correctSide === 'left') {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', winMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', loseMessage);
} else {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', loseMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', winMessage);
}

fs.writeFileSync('README.md', readme);
console.log('游戏内容已更新！');
