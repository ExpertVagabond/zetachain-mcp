#!/usr/bin/env node

/**
 * ZetaChain MCP Server
 * 
 * A Model Context Protocol server that provides Claude Code integration
 * with ZetaChain development tools and smart contract inspection.
 * 
 * Features:
 * - Contract discovery and inspection
 * - ZetaChain CLI command execution
 * - Project structure analysis
 * - Cross-chain development support
 */

const http = require('http');
const { exec } = require('child_process');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = process.env.MCP_PORT || 7001;
const ZETA_PATH = process.env.ZETA_PROJECT_PATH || path.resolve(process.env.HOME, 'Projects/zetachain');

console.log(`🚀 Starting ZetaChain MCP Server...`);
console.log(`📁 ZetaChain project path: ${ZETA_PATH}`);
console.log(`🔌 Server will run on port: ${PORT}`);

// Auto-start ZetaChain localnet
function startLocalnet() {
  console.log(`🌐 Starting ZetaChain localnet...`);
  
  exec('npx zetachain localnet start', { 
    cwd: ZETA_PATH,
    timeout: 30000 
  }, (err, stdout, stderr) => {
    if (err) {
      console.log(`⚠️ Localnet start failed: ${err.message}`);
      console.log(`💡 You may need to start it manually: zetachain localnet start`);
    } else {
      console.log(`✅ ZetaChain localnet started`);
    }
  });
}

// Check if localnet is already running
exec('npx zetachain localnet status', { cwd: ZETA_PATH, timeout: 10000 }, (err, stdout) => {
  if (err || !stdout.includes('running')) {
    startLocalnet();
  } else {
    console.log(`✅ ZetaChain localnet already running`);
  }
});

/**
 * Recursively walks through a directory to find Solidity contracts
 * @param {string} dir - Directory to walk through
 * @returns {Array<string>} - Array of relative contract paths
 */
function walkContracts(dir) {
  let results = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        // Recursively walk subdirectories, excluding hidden ones
        results = results.concat(walkContracts(fullPath));
      } else if (entry.name.endsWith('.sol')) {
        // Add Solidity files
        results.push(path.relative(path.join(ZETA_PATH, 'contracts'), fullPath));
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  
  return results;
}

/**
 * Validates and sanitizes ZetaChain CLI commands
 * @param {string} cmd - Command to validate
 * @returns {string|null} - Sanitized command or null if invalid
 */
function validateZetaCommand(cmd) {
  // Allow only safe ZetaChain commands
  const allowedCommands = [
    'help', 'version', 'account', 'balances', 'fees',
    'verify', 'deploy', 'interact', 'localnet',
    'omnichain-swap', 'messaging'
  ];
  
  const baseCommand = cmd.split(' ')[0];
  
  if (!allowedCommands.includes(baseCommand)) {
    return null;
  }
  
  // Basic sanitization - remove dangerous characters
  return cmd.replace(/[;&|`$()]/g, '');
}

/**
 * HTTP Server Handler
 */
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`📡 ${req.method} ${pathname}`);
  
  try {
    switch (pathname) {
      case '/health':
        // Health check endpoint
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          zetaPath: ZETA_PATH,
          zetaPathExists: fs.existsSync(ZETA_PATH)
        }));
        break;
        
      case '/contracts':
        // Serve contract list
        handleContractsEndpoint(res);
        break;
        
      case '/zetachain':
        // Execute ZetaChain CLI commands
        handleZetaChainEndpoint(parsed.query, res);
        break;
        
      case '/project-info':
        // Get project structure information
        handleProjectInfoEndpoint(res);
        break;
        
      case '/prerequisites':
        // Check development prerequisites
        handlePrerequisitesEndpoint(res);
        break;
        
      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Not Found', 
          availableEndpoints: ['/health', '/contracts', '/zetachain', '/project-info', '/prerequisites']
        }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
});

/**
 * Handle /contracts endpoint
 */
function handleContractsEndpoint(res) {
  const contractsDir = path.join(ZETA_PATH, 'contracts');
  
  if (!fs.existsSync(contractsDir)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Contracts directory not found',
      path: contractsDir,
      suggestion: 'Ensure ZETA_PROJECT_PATH points to a valid ZetaChain project'
    }));
    return;
  }
  
  try {
    const contracts = walkContracts(contractsDir);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      contracts,
      count: contracts.length,
      contractsDir
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Error reading contracts',
      message: err.message
    }));
  }
}

/**
 * Handle /zetachain endpoint
 */
function handleZetaChainEndpoint(query, res) {
  const cmd = query.cmd;
  
  if (!cmd) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Missing cmd parameter',
      example: '/zetachain?cmd=help'
    }));
    return;
  }
  
  const sanitizedCmd = validateZetaCommand(cmd);
  if (!sanitizedCmd) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Invalid or unsafe command',
      provided: cmd
    }));
    return;
  }
  
  console.log(`🔧 Executing: npx zetachain ${sanitizedCmd}`);
  
  exec(`npx zetachain ${sanitizedCmd}`, { 
    cwd: ZETA_PATH,
    timeout: 30000 // 30 second timeout
  }, (err, stdout, stderr) => {
    if (err || stderr) {
      console.error('Command error:', stderr || err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Command execution failed',
        command: sanitizedCmd,
        message: stderr || err.message
      }));
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      command: sanitizedCmd,
      output: stdout,
      timestamp: new Date().toISOString()
    }));
  });
}

/**
 * Handle /project-info endpoint
 */
function handleProjectInfoEndpoint(res) {
  try {
    const info = {
      projectPath: ZETA_PATH,
      exists: fs.existsSync(ZETA_PATH),
      structure: {}
    };
    
    if (info.exists) {
      // Check for common ZetaChain project files/directories
      const commonPaths = ['contracts', 'scripts', 'test', 'hardhat.config.ts', 'package.json'];
      
      commonPaths.forEach(p => {
        const fullPath = path.join(ZETA_PATH, p);
        info.structure[p] = {
          exists: fs.existsSync(fullPath),
          path: fullPath
        };
      });
      
      // Get package.json info if available
      const packageJsonPath = path.join(ZETA_PATH, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          info.packageInfo = {
            name: packageData.name,
            version: packageData.version,
            dependencies: packageData.dependencies
          };
        } catch (e) {
          info.packageInfo = { error: 'Could not parse package.json' };
        }
      }
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info, null, 2));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Failed to get project info',
      message: error.message
    }));
  }
}

/**
 * Handle /prerequisites endpoint
 */
function handlePrerequisitesEndpoint(res) {
  try {
    const prerequisites = {
      timestamp: new Date().toISOString(),
      requirements: {},
      installationScript: '/scripts/install-prerequisites.sh',
      status: 'checking'
    };

    // Check Node.js
    try {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      prerequisites.requirements.nodejs = {
        required: '16.0.0+',
        installed: nodeVersion,
        status: majorVersion >= 16 ? 'ok' : 'outdated',
        description: 'JavaScript runtime required for the MCP server'
      };
    } catch (e) {
      prerequisites.requirements.nodejs = {
        required: '16.0.0+',
        installed: 'not found',
        status: 'missing',
        description: 'JavaScript runtime required for the MCP server'
      };
    }

    // Check Forge (Foundry)
    exec('forge --version', { timeout: 5000 }, (err, stdout) => {
      if (err) {
        prerequisites.requirements.forge = {
          required: 'latest',
          installed: 'not found',
          status: 'missing',
          description: 'Ethereum development framework for smart contracts',
          installCommand: 'curl -L https://foundry.paradigm.xyz | bash && foundryup'
        };
      } else {
        const version = stdout.trim().split('\n')[0];
        prerequisites.requirements.forge = {
          required: 'latest',
          installed: version,
          status: 'ok',
          description: 'Ethereum development framework for smart contracts'
        };
      }

      // Check Cast (part of Foundry)
      exec('cast --version', { timeout: 5000 }, (castErr, castStdout) => {
        if (castErr) {
          prerequisites.requirements.cast = {
            required: 'latest',
            installed: 'not found',
            status: 'missing',
            description: 'Ethereum RPC swiss army knife',
            installCommand: 'Installed with Foundry'
          };
        } else {
          const castVersion = castStdout.trim().split('\n')[0];
          prerequisites.requirements.cast = {
            required: 'latest',
            installed: castVersion,
            status: 'ok',
            description: 'Ethereum RPC swiss army knife'
          };
        }

        // Check ZetaChain CLI
        exec('npx zetachain --version', { timeout: 10000 }, (zetaErr, zetaStdout) => {
          if (zetaErr) {
            prerequisites.requirements.zetachain = {
              required: '6.0.0+',
              installed: 'not found',
              status: 'missing',
              description: 'ZetaChain development toolkit',
              installCommand: 'npm install -g zetachain'
            };
          } else {
            const zetaVersion = zetaStdout.trim();
            prerequisites.requirements.zetachain = {
              required: '6.0.0+',
              installed: zetaVersion,
              status: 'ok',
              description: 'ZetaChain development toolkit'
            };
          }

          // Check Git
          exec('git --version', { timeout: 5000 }, (gitErr, gitStdout) => {
            if (gitErr) {
              prerequisites.requirements.git = {
                required: '2.0.0+',
                installed: 'not found',
                status: 'missing',
                description: 'Version control system'
              };
            } else {
              const gitVersion = gitStdout.trim();
              prerequisites.requirements.git = {
                required: '2.0.0+',
                installed: gitVersion,
                status: 'ok',
                description: 'Version control system'
              };
            }

            // Calculate overall status
            const statuses = Object.values(prerequisites.requirements).map(req => req.status);
            const missingCount = statuses.filter(s => s === 'missing').length;
            const outdatedCount = statuses.filter(s => s === 'outdated').length;

            if (missingCount === 0 && outdatedCount === 0) {
              prerequisites.status = 'ready';
              prerequisites.message = 'All prerequisites are installed and up to date';
            } else if (missingCount > 0) {
              prerequisites.status = 'missing';
              prerequisites.message = `${missingCount} prerequisites are missing, ${outdatedCount} are outdated`;
            } else {
              prerequisites.status = 'outdated';
              prerequisites.message = `${outdatedCount} prerequisites are outdated`;
            }

            prerequisites.summary = {
              total: Object.keys(prerequisites.requirements).length,
              ok: statuses.filter(s => s === 'ok').length,
              missing: missingCount,
              outdated: outdatedCount
            };

            // Send response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(prerequisites, null, 2));
          });
        });
      });
    });

  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Failed to check prerequisites',
      message: error.message
    }));
  }
}

// Start the server
server.listen(PORT, () => {
  console.log(`✅ ZetaChain MCP Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Contracts: http://localhost:${PORT}/contracts`);
  console.log(`⚡ ZetaChain CLI: http://localhost:${PORT}/zetachain?cmd=help`);
  console.log(`📊 Project info: http://localhost:${PORT}/project-info`);
  console.log(`🛠️  Prerequisites: http://localhost:${PORT}/prerequisites`);
  console.log(`🌐 Localnet: Auto-started if needed`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ZetaChain MCP Server...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});