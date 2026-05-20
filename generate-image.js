const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const width = 900, height = 200;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// 随机游戏结果
const isWin = Math.random() < 0.5;
const items = ['🧻 纸巾', '🥕 胡萝卜'];
const randomItem = items[Math.floor(Math.random() * 2)];
const gameResult = isWin ? '🎉 蒸蚌！' : `😿 没抓到，今天是：${randomItem}`;

// 更新 README 中的占位符（让后续脚本也能正常工作）
let readme = fs.readFileSync('README.md', 'utf8');
readme = readme.replace('<!-- GAME_RESULT -->', gameResult);
fs.writeFileSync('README.md', readme);

async function main() {
  // 加载猫图（可选，如果仓库里没有就跳过）
  let catImg = null;
  try {
    catImg = await loadImage('cat.png');
  } catch {}

  // 背景
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, width, height);

  // --- 左栏：游戏卡片 (300x190) ---
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(5, 5, 290, 190, 12);
  ctx.fillStyle = '#0d1117';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#c9d1d9';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧻 vs 🥕', 150, 35);

  if (catImg) {
    ctx.drawImage(catImg, 95, 50, 100, 100);
  } else {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#8b949e';
    ctx.fillText('(猫图未上传)', 150, 110);
    ctx.fillStyle = '#c9d1d9';
  }

  ctx.font = '14px sans-serif';
  ctx.fillText(gameResult, 150, 175);
  ctx.fillStyle = '#8b949e';
  ctx.font = '10px sans-serif';
  ctx.fillText('每日更新', 150, 195);

  // --- 右栏：两个项目卡片等宽 (各 290x190，间距 10) ---
  const cardY = 5, cardWidth = 290, cardHeight = 190, gap = 10;
  const startX = 310;

  drawCard(startX, cardY, cardWidth, cardHeight,
    '📝 my-blog', '个人博客 - 记录学习与思考',
    '<!-- MYBLOG_LAST_UPDATED -->更新中...', '<!-- MYBLOG_COMMITS -->--',
    'https://github.com/wwgb/my-blog');

  drawCard(startX + cardWidth + gap, cardY, cardWidth, cardHeight,
    '📚 weread2notion-pro', '微信读书同步到 Notion（Pro版）',
    '<!-- WEREAD_LAST_UPDATED -->更新中...', '<!-- WEREAD_COMMITS -->--',
    'https://github.com/wwgb/weread2notion-pro');

  // 保存图片
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('three-cards.png', buffer);
  console.log('三栏图片已生成');
}

function drawCard(x, y, w, h, title, desc, lastUpdate, commits, link) {
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fillStyle = '#0d1117';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#58a6ff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, x + w/2, y + 35);

  ctx.fillStyle = '#8b949e';
  ctx.font = '14px sans-serif';
  ctx.fillText(desc, x + w/2, y + 60);

  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 75);
  ctx.lineTo(x + w - 20, y + 75);
  ctx.stroke();

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#8b949e';
  ctx.fillText('🕒 最近更新：', x + 50, y + 100);
  ctx.fillStyle = '#c9d1d9';
  ctx.fillText(lastUpdate, x + 160, y + 100);
  
  ctx.fillStyle = '#8b949e';
  ctx.fillText('📊 月提交：', x + 50, y + 125);
  ctx.fillStyle = '#c9d1d9';
  ctx.fillText(commits + ' 次', x + 140, y + 125);
}

main().catch(console.error);
