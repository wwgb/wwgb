const fs = require('fs');

// 随机选择今天的题目和正确方向
const items = ['🧻 纸巾', '🥕 胡萝卜'];
const chosenIndex = Math.random() < 0.5 ? 0 : 1; // 0=纸巾, 1=胡萝卜
const chosenItem = items[chosenIndex];
const correctSide = chosenIndex === 0 ? 'left' : 'right'; // 纸巾在左，胡萝卜在右

// 读取 README
let readme = fs.readFileSync('README.md', 'utf8');

// 替换题目
readme = readme.replace('<!-- GAME_ITEM -->' + /.*/.source, `<!-- GAME_ITEM -->${chosenItem}`);

// 设置按钮链接：正确方向指向 #result-left 或 #result-right
const leftLink = correctSide === 'left' ? '#result-left' : '#result-right';
const rightLink = correctSide === 'right' ? '#result-left' : '#result-right';

readme = readme.replace('<!-- GAME_LEFT_LINK -->' + /.*/.source, `<!-- GAME_LEFT_LINK -->${leftLink}`);
readme = readme.replace('<!-- GAME_RIGHT_LINK -->' + /.*/.source, `<!-- GAME_RIGHT_LINK -->${rightLink}`);

// 生成结果区域内容
const winMessage = `
<div style="font-size:2em;">🐱👉 ${chosenItem}</div>
<div style="font-size:1.5em; color:#58a6ff;">🎉 蒸蚌！你猜对啦！</div>
`;
const loseMessage = `
<div style="font-size:2em;">🐱👉 ${chosenItem}</div>
<div style="font-size:1.5em; color:#f85149; animation: shake 0.3s;">❌ 不对哦，大开门抓了${chosenItem}</div>
<style>
  @keyframes shake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
</style>
`;

// 把赢的消息放到正确锚点下，输的放到另一个
if (correctSide === 'left') {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', winMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', loseMessage);
} else {
  readme = readme.replace('<!-- GAME_LEFT_RESULT -->', loseMessage);
  readme = readme.replace('<!-- GAME_RIGHT_RESULT -->', winMessage);
}

fs.writeFileSync('README.md', readme);
console.log('游戏内容已更新');
