const fs = require('fs');
const isWin = Math.random() < 0.5;
const items = ['🧻 纸巾', '🥕 胡萝卜'];
const randomItem = items[Math.floor(Math.random() * 2)];
const result = isWin ? '🎉 蒸蚌！' : `😿 没抓到，今天是：${randomItem}`;
let readme = fs.readFileSync('README.md', 'utf8');
readme = readme.replace('<!-- GAME_RESULT -->', result);
fs.writeFileSync('README.md', readme);
