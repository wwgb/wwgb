const fs = require('fs');

// 随机选择今日答案
const items = ['🧻 纸巾', '🥕 胡萝卜'];
const chosenIndex = Math.random() < 0.5 ? 0 : 1;
const chosenItem = items[chosenIndex];
const correctSide = chosenIndex === 0 ? 'left' : 'right';

let readme = fs.readFileSync('README.md', 'utf8');

// 替换题目
readme = readme.replace(
  /<!-- GAME_ITEM -->(🧻 纸巾|🥕 胡萝卜)/g,
  `<!-- GAME_ITEM -->${chosenItem}`
);

// 生成结果内容（纯 Markdown + Emoji，无需 div）
const winMessage = `🐱👉 ${chosenItem}\n\n🎉 **蒸蚌！你猜对啦！**`;
const loseMessage = `🐱👉 ${chosenItem}\n\n❌ **不对哦，大开门抓了${chosenItem}**`;

// 将结果插入到对应的 <details> 块中
if (correctSide === 'left') {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', winMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', loseMessage);
} else {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', loseMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', winMessage);
}

fs.writeFileSync('README.md', readme);
console.log('游戏内容已更新！');
