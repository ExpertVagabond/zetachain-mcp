# Contributing to ZetaChain MCP CLI

Thank you for your interest in contributing to ZetaChain MCP CLI! This project aims to be the simplest way to get started with ZetaChain development using Claude Code.

## 🎯 Project Goals

- **Simplicity First**: Keep it simple - this is the beginner-friendly tool
- **Educational Value**: Help newcomers learn ZetaChain concepts
- **Single File Architecture**: Maintain the one-file design for clarity
- **Minimal Dependencies**: Keep dependencies to an absolute minimum

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- ZetaChain CLI installed globally: `npm install -g zetachain`
- Basic understanding of ZetaChain concepts

### Development Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/zetachain-mcp-cli.git
   cd zetachain-mcp-cli
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### 1. Bug Reports

Before submitting a bug report:
- Check if the issue already exists
- Verify it's reproducible with the latest version
- Include system information (Node.js version, OS, ZetaChain CLI version)

**Bug Report Template**:
```markdown
**Environment**:
- Node.js version: 
- OS: 
- ZetaChain CLI version: 

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:

**Actual Behavior**:

**Additional Context**:
```

### 2. Feature Requests

We welcome feature requests, but remember this tool's goal is simplicity:

- ✅ **Good features**: Better error messages, more CLI commands, improved docs
- ❌ **Not suitable**: Complex APIs, multiple files, heavy dependencies

**Feature Request Template**:
```markdown
**Problem Description**:
What problem does this solve for beginners?

**Proposed Solution**:
How would this work?

**Alternatives Considered**:
What other approaches did you consider?

**Additional Context**:
Any other relevant information
```

### 3. Code Contributions

#### Code Style Guidelines

- **Keep it readable**: Add comments explaining ZetaChain concepts
- **Maintain single file**: All code should remain in `server.js`
- **Error handling**: Provide helpful error messages for beginners
- **Educational comments**: Explain what ZetaChain CLI commands do

#### Example Code Style

```javascript
// Good: Educational and clear
function executeZetaCommand(command) {
  // The ZetaChain CLI provides commands for managing local development
  // 'localnet status' checks if the local ZetaChain network is running
  exec(`npx zetachain ${command}`, (error, stdout, stderr) => {
    if (error) {
      // Help beginners understand common issues
      if (error.message.includes('not found')) {
        return res.json({
          error: 'ZetaChain CLI not found. Install with: npm install -g zetachain'
        });
      }
      // ... more helpful error handling
    }
  });
}
```

#### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the code style guidelines
   - Add educational comments
   - Test your changes manually

3. **Test your changes**:
   ```bash
   # Start the server
   npm start
   
   # Test endpoints
   curl http://localhost:7001/health
   curl "http://localhost:7001/zetachain?cmd=version"
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "Add: brief description of your change"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

#### Commit Message Guidelines

- **Add**: New features or functionality
- **Fix**: Bug fixes
- **Update**: Improvements to existing features
- **Docs**: Documentation changes
- **Refactor**: Code improvements without functionality changes

Examples:
- `Add: ZetaChain localnet restart command`
- `Fix: Handle case when ZetaChain project directory doesn't exist`
- `Update: Improve error messages for beginners`
- `Docs: Add troubleshooting section to README`

## 🧪 Testing

Since this is a simple CLI tool, testing is primarily manual:

### Manual Testing Checklist

- [ ] Server starts without errors
- [ ] Health endpoint responds correctly
- [ ] ZetaChain CLI commands execute properly
- [ ] Error handling works for common scenarios
- [ ] Helpful error messages are displayed

### Test with Real Scenarios

Test with actual ZetaChain development scenarios:

1. **New Developer**: Test as if you've never used ZetaChain
2. **Missing Dependencies**: Test without ZetaChain CLI installed
3. **No Project**: Test without a ZetaChain project directory
4. **Network Issues**: Test with network connectivity problems

## 📚 Documentation

### README Updates

When updating the README:
- Keep language beginner-friendly
- Include copy-pasteable code examples
- Add troubleshooting for common issues
- Maintain the learning-focused tone

### Code Comments

Add comments that teach ZetaChain concepts:

```javascript
// Good: Educational comment
// ZetaChain localnet is a local development blockchain
// that allows testing omnichain contracts without testnet

// Bad: Non-educational comment
// Start localnet
```

## 🔍 Review Process

### What We Look For

- **Simplicity**: Does this maintain the tool's beginner-friendly nature?
- **Educational Value**: Does this help newcomers learn ZetaChain?
- **Code Quality**: Is the code readable and well-commented?
- **Testing**: Has this been tested manually with real scenarios?

### Review Timeline

- Initial review: Within 48 hours
- Feedback incorporation: Work with contributor to refine
- Final approval: When changes meet project goals

## 🤝 Community

### Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features  
- **ZetaChain Discord**: Join the broader ZetaChain community

### Recognition

Contributors will be:
- Added to the README acknowledgments
- Mentioned in release notes for significant contributions
- Invited to help review future contributions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make ZetaChain more accessible to developers! 🚀**
