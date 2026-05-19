const fs = require('fs');

// 随机选择今日答案
const items = ['🧻 纸巾', '🥕 胡萝卜'];
const chosenIndex = Math.random() < 0.5 ? 0 : 1; // 0=纸巾, 1=胡萝卜
const chosenItem = items[chosenIndex];
const correctSide = chosenIndex === 0 ? 'left' : 'right'; // 纸巾在左，胡萝卜在右

let readme = fs.readFileSync('README.md', 'utf8');

// 替换题目
readme = readme.replace('<!-- GAME_ITEM -->🧻 纸巾', `<!-- GAME_ITEM -->${chosenItem}`);
readme = readme.replace('<!-- GAME_ITEM -->🥕 胡萝卜', `<!-- GAME_ITEM -->${chosenItem}`);

// 设置按钮链接（赢的按钮指向 #result-left，输的指向 #result-right）
const leftLink = correctSide === 'left' ? '#result-left' : '#result-right';
const rightLink = correctSide === 'right' ? '#result-left' : '#result-right';

readme = readme.replace('<!-- GAME_LEFT_LINK -->#result-left', `<!-- GAME_LEFT_LINK -->${leftLink}`);
readme = readme.replace('<!-- GAME_LEFT_LINK -->#result-right', `<!-- GAME_LEFT_LINK -->${leftLink}`);
readme = readme.replace('<!-- GAME_RIGHT_LINK -->#result-left', `<!-- GAME_RIGHT_LINK -->${rightLink}`);
readme = readme.replace('<!-- GAME_RIGHT_LINK -->#result-right', `<!-- GAME_RIGHT_LINK -->${rightLink}`);

// 生成赢和输的消息
const winMessage = `
<div style="font-size:2em;">🐱👉 ${chosenItem}</div>
<div style="font-size:1.5em; color:#58a6ff;">🎉 蒸蚌！你猜对啦！</div>
`;
const loseMessage = `
<div style="font-size:2em;">🐱👉 ${chosenItem}</div>
<div style="font-size:1.5em; color:#f85149;">❌ 不对哦，大开门抓了${chosenItem}</div>
`;

// 将赢消息放到正确的锚点下，输消息放到另一个
if (correctSide === 'left') {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', winMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', loseMessage);
} else {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', loseMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', winMessage);
}

fs.writeFileSync('README.md', readme);
console.log('游戏内容已更新！');
