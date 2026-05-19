const fs = require('fs');

// 随机决定今天是赢还是输
const isWin = Math.random() < 0.5;
const items = ['🧻 纸巾', '🥕 胡萝卜'];
const randomItem = items[Math.floor(Math.random() * 2)];

let result;
if (isWin) {
  result = '🎉 蒸蚌！';
} else {
  result = `😿 没抓到，今天出现的是：${randomItem}`;
}

let readme = fs.readFileSync('README.md', 'utf8');

// 替换 GAME_RESULT 占位符
readme = readme.replace('<!-- GAME_RESULT -->', result);

fs.writeFileSync('README.md', readme);
console.log('今日结果已更新：' + result);
