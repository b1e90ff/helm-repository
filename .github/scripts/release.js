#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

async function findCharts() {
  try {
    const output = execSync('find . -maxdepth 2 -name "Chart.yaml" -not -path "./.git/*"', { encoding: 'utf8' });
    return output.trim().split('\n')
      .filter(Boolean)
      .map(line => path.dirname(line).replace('./', ''));
  } catch (error) {
    console.error('Error finding charts:', error.message);
    return [];
  }
}

function createPackageJson(chartName) {
  return {
    name: chartName,
    version: "0.0.0",
    private: true,
    description: `Helm chart for ${chartName}`,
    scripts: {
      "semantic-release": "semantic-release"
    }
  };
}

function createReleaseConfig(chartName, repositoryUrl) {
  return `export default {
  "branches": ["main"],
  "repositoryUrl": "${repositoryUrl}",
  "npmPublish": false,
  "tagFormat": "${chartName}-v${version}",
  
  "plugins": [
    ["@semantic-release/commit-analyzer", {
      "preset": "conventionalcommits",
      "releaseRules": [
        { "breaking": true, "release": "major" },
        { "type": "feat", "release": "minor" },
        { "type": "fix", "release": "patch" },
        { "type": "perf", "release": "patch" },
        { "type": "revert", "release": "patch" },
        { "type": "chore", "release": "patch" },
        { "type": "refactor", "release": "patch" }
      ]
    }],
    
    "@semantic-release/release-notes-generator",
    
    ["@semantic-release/exec", {
      "verifyConditionsCmd": "echo Verifying ${process.env.npm_package_name}",
      "prepareCmd": "echo Preparing ${process.env.npm_package_name} ${nextRelease.version} && (sed --version >/dev/null 2>&1 && sed -i 's/^version:.*/version: ${nextRelease.version}/' Chart.yaml || sed -i '' 's/^version:.*/version: ${nextRelease.version}/' Chart.yaml)"
    }],
    
    ["@semantic-release/github", {
      "successComment": "This ${issue.pull_request ? 'PR is included' : 'issue has been resolved'} in version ${nextRelease.version} of ${process.env.npm_package_name}",
      "failTitle": "Failed to release ${process.env.npm_package_name}"
    }],
    
    ["@semantic-release/git", {
      "assets": ["Chart.yaml", "package.json"],
      "message": "chore(release): ${process.env.npm_package_name}@${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}"
    }]
  ]
}`;
}

async function setupChart(chartPath, repositoryUrl) {
  const chartName = path.basename(chartPath);
  console.log(`📦 Setting up ${chartName}...`);
  
  // Create package.json
  const packageJsonPath = path.join(chartPath, 'package.json');
  const packageJson = createPackageJson(chartName);
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Create release.config.js
  const releaseConfigPath = path.join(chartPath, 'release.config.js');
  const releaseConfig = createReleaseConfig(chartName, repositoryUrl);
  fs.writeFileSync(releaseConfigPath, releaseConfig);
  
  console.log(`✅ Setup complete for ${chartName}`);
}

async function releaseChart(chartPath, dryRun = false) {
  const chartName = path.basename(chartPath);
  const originalCwd = process.cwd();
  console.log(`🚀 ${dryRun ? 'DRY RUN: ' : ''}Releasing ${chartName}...`);
  
  try {
    process.chdir(chartPath);
    const command = dryRun ? 'npx semantic-release --dry-run' : 'npx semantic-release';
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${dryRun ? 'DRY RUN: ' : ''}Released ${chartName}`);
  } catch (error) {
    console.error(`❌ Failed to ${dryRun ? 'dry-run' : 'release'} ${chartName}:`, error.message);
  } finally {
    // Always change back to original directory
    process.chdir(originalCwd);
  }
}

async function main() {
  const command = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  const repositoryUrl = process.env.GITHUB_REPOSITORY 
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}.git`
    : 'https://github.com/b1e90ff/helm-repository.git';
  
  console.log('🔍 Finding Helm charts...');
  const charts = await findCharts();
  
  if (charts.length === 0) {
    console.log('No charts found!');
    process.exit(1);
  }
  
  console.log(`Found ${charts.length} chart(s): ${charts.join(', ')}`);
  
  if (command === 'setup') {
    console.log('🛠️  Setting up charts for semantic-release...');
    for (const chart of charts) {
      await setupChart(chart, repositoryUrl);
    }
  } else if (command === 'release') {
    console.log(`🚀 Starting ${dryRun ? 'DRY RUN ' : ''}releases...`);
    for (const chart of charts) {
      await releaseChart(chart, dryRun);
    }
  } else {
    console.log('Usage: node release.js [setup|release] [--dry-run]');
    process.exit(1);
  }
  
  console.log('🎉 All done!');
}

try {
  await main();
} catch (error) {
  console.error('💥 Error:', error);
  process.exit(1);
}