#!/bin/bash

# ZetaChain Prerequisites Installer
# Installs Node.js, Foundry, ZetaChain CLI, and Git

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

# Check and install Node.js
check_node() {
    print_step "Checking Node.js..."
    
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [ "$MAJOR_VERSION" -ge 16 ]; then
            print_status "Node.js $NODE_VERSION ✅"
        else
            print_warning "Node.js $NODE_VERSION too old (need 16+)"
            install_node
        fi
    else
        install_node
    fi
}

install_node() {
    print_step "Installing Node.js..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            brew install node
        else
            print_error "Install Homebrew first: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        print_error "Unsupported OS. Install manually: https://nodejs.org"
        exit 1
    fi
}

# Check and install Foundry
check_foundry() {
    print_step "Checking Foundry..."
    
    if command_exists forge && command_exists cast; then
        print_status "Foundry installed ✅"
    else
        install_foundry
    fi
}

install_foundry() {
    print_step "Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    export PATH="$PATH:$HOME/.foundry/bin"
    foundryup
    print_status "Foundry installed ✅"
}

# Check and install ZetaChain CLI
check_zetachain() {
    print_step "Checking ZetaChain CLI..."
    
    if npm list -g zetachain >/dev/null 2>&1; then
        print_status "ZetaChain CLI installed ✅"
    else
        install_zetachain
    fi
}

install_zetachain() {
    print_step "Installing ZetaChain CLI..."
    npm install -g zetachain
    print_status "ZetaChain CLI installed ✅"
}

# Check Git
check_git() {
    print_step "Checking Git..."
    
    if command_exists git; then
        print_status "Git installed ✅"
    else
        print_error "Install Git manually"
        exit 1
    fi
}

# Main
main() {
    echo "🚀 Installing ZetaChain Prerequisites"
    echo "===================================="
    
    check_git
    check_node
    check_foundry
    check_zetachain
    
    echo ""
    print_status "🎉 Installation complete!"
    echo ""
    echo "Next steps:"
    echo "1. Restart terminal: source ~/.bashrc"
    echo "2. Test: forge --version && npx zetachain --help"
}

main "$@"