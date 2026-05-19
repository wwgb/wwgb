const fs = require('fs');
const { execSync } = require('child_process');

// ===== 配置你的两个仓库 =====
const repos = [
  {
    name: 'my-blog',
    placeholder: 'MYBLOG',
  },
  {
    name: 'weread2notion-pro',
    placeholder: 'WEREAD',
  },
];

// ===== 核心函数：获取仓库最近活动和提交次数 =====
async function getRepoStats(repoName) {
  const owner = 'wwgb';
  const repoFullName = `${owner}/${repoName}`;

  // 获取最近一次提交时间
  const commitsJson = execSync(
    `gh api repos/${repoFullName}/commits?per_page=1 --jq '.[0].commit.committer.date'`,
    { encoding: 'utf-8' }
  ).trim();
  const lastCommitDate = new Date(commitsJson);
  const now = new Date();
  const diffDays = Math.floor((now - lastCommitDate) / (1000 * 60 * 60 * 24));
  const lastUpdated = diffDays === 0 ? '今天' : `${diffDays}天前`;

  // 获取近30天提交次数
  const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const commitsList = execSync(
    `gh api repos/${repoFullName}/commits?since=${since} --jq 'length'`,
    { encoding: 'utf-8' }
  ).trim();
  const monthlyCommits = parseInt(commitsList) || 0;

  return {
    lastUpdated,
    monthlyCommits,
  };
}

// ===== 主流程：更新 README.md =====
async function main() {
  const readmePath = 'README.md';
  let readme = fs.readFileSync(readmePath, 'utf-8');

  for (const repo of repos) {
    const stats = await getRepoStats(repo.name);

    // 替换占位符
    const lastUpdatedComment = `<!-- ${repo.placeholder}_LAST_UPDATED -->`;
    const commitsComment = `<!-- ${repo.placeholder}_COMMITS -->`;

    // 查找并替换：最近更新
    const lastUpdatedRegex = new RegExp(
      `${lastUpdatedComment}[^<]*`,
      'g'
    );
    readme = readme.replace(lastUpdatedRegex, `${lastUpdatedComment}${stats.lastUpdated}`);

    // 查找并替换：月提交次数
    const commitsRegex = new RegExp(
      `${commitsComment}[^<]*`,
      'g'
    );
    readme = readme.replace(commitsRegex, `${commitsComment}${stats.monthlyCommits}`);
  }

  fs.writeFileSync(readmePath, readme);
  console.log('README.md 已更新');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
