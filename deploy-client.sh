#!/bin/bash

# LEAN Website Client Deployment Script
# Automates the setup of new artist websites based on the working template

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLIENT_NAME=""
DOMAIN=""
DEPLOY_TARGET="vercel" # vercel, netlify, or github-pages

show_help() {
    echo -e "${BLUE}LEAN Website Client Deployment${NC}"
    echo ""
    echo "Usage: ./deploy-client.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -n, --name CLIENT_NAME     Artist/client name (required)"
    echo "  -d, --domain DOMAIN        Custom domain (optional)"
    echo "  -t, --target TARGET        Deployment target: vercel, netlify, github-pages (default: vercel)"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Example:"
    echo "  ./deploy-client.sh -n \"Aria Nova\" -d \"arianova.com\" -t vercel"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is required but not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "git is required but not installed"
        exit 1
    fi
    
    case $DEPLOY_TARGET in
        vercel)
            if ! command -v vercel &> /dev/null; then
                log_warning "Vercel CLI not found. Installing..."
                npm install -g vercel
            fi
            ;;
        netlify)
            if ! command -v netlify &> /dev/null; then
                log_warning "Netlify CLI not found. Installing..."
                npm install -g netlify-cli
            fi
            ;;
        github-pages)
            # No additional CLI needed for GitHub Pages
            ;;
    esac
    
    log_success "Dependencies checked"
}

setup_project() {
    log_info "Setting up project for client: $CLIENT_NAME"
    
    # Create client-specific directory
    CLIENT_DIR="../${CLIENT_NAME// /-}-website"
    CLIENT_DIR_LOWER=$(echo "$CLIENT_DIR" | tr '[:upper:]' '[:lower:]')
    
    if [ -d "$CLIENT_DIR_LOWER" ]; then
        log_error "Directory $CLIENT_DIR_LOWER already exists"
        exit 1
    fi
    
    # Copy current project as template
    log_info "Copying project template..."
    cp -r . "$CLIENT_DIR_LOWER"
    cd "$CLIENT_DIR_LOWER"
    
    # Clean up development files
    rm -rf .next node_modules .git
    rm -f deploy-client.sh
    rm -f *.md 2>/dev/null || true # Remove docs but don't fail if not found
    
    # Update package.json with client name
    sed -i.bak "s/\"leanwebsite\"/\"${CLIENT_NAME// /-}-website\"/" package.json
    sed -i.bak "s/\"name\": \"leanwebsite\"/\"name\": \"$(echo "${CLIENT_NAME// /-}" | tr '[:upper:]' '[:lower:]')-website\"/" package.json
    rm package.json.bak
    
    log_success "Project template created at $CLIENT_DIR_LOWER"
}

customize_content() {
    log_info "Customizing content for $CLIENT_NAME..."
    
    # Update demo page with client name
    sed -i.bak "s/ARIA NOVA/$CLIENT_NAME/g" src/app/demo/page.tsx
    sed -i.bak "s/arianova/${CLIENT_NAME// /}/g" src/app/demo/page.tsx
    sed -i.bak "s/Aria Nova/$CLIENT_NAME/g" src/app/demo/page.tsx
    rm src/app/demo/page.tsx.bak
    
    # Update homepage
    sed -i.bak "s/Music Artist Website/$CLIENT_NAME - Official Website/g" src/app/page.tsx
    rm src/app/page.tsx.bak
    
    log_success "Content customized for $CLIENT_NAME"
}

install_dependencies() {
    log_info "Installing dependencies..."
    npm install
    log_success "Dependencies installed"
}

build_project() {
    log_info "Building project..."
    npm run build
    log_success "Project built successfully"
}

setup_git() {
    log_info "Setting up Git repository..."
    git init
    git add .
    git commit -m "Initial commit for $CLIENT_NAME website

🎵 Generated with LEAN Website Framework
✨ Artist: $CLIENT_NAME
🚀 Ready for deployment

🤖 Generated with Claude Code"
    
    log_success "Git repository initialized"
}

deploy_project() {
    log_info "Deploying to $DEPLOY_TARGET..."
    
    case $DEPLOY_TARGET in
        vercel)
            vercel --prod
            if [ ! -z "$DOMAIN" ]; then
                log_info "Setting custom domain: $DOMAIN"
                vercel domains add "$DOMAIN"
            fi
            ;;
        netlify)
            netlify deploy --prod --dir=.next
            if [ ! -z "$DOMAIN" ]; then
                log_info "Setting custom domain: $DOMAIN"
                netlify sites:update --domain="$DOMAIN"
            fi
            ;;
        github-pages)
            log_info "For GitHub Pages deployment:"
            echo "1. Push this repository to GitHub"
            echo "2. Enable GitHub Pages in repository settings"
            echo "3. Set source to GitHub Actions"
            echo "4. The site will be available at: https://$(git config user.name).github.io/$(basename $(pwd))"
            ;;
    esac
    
    log_success "Deployment completed!"
}

show_completion_summary() {
    echo ""
    echo -e "${GREEN}🎉 CLIENT DEPLOYMENT COMPLETE! 🎉${NC}"
    echo ""
    echo -e "${BLUE}Client:${NC} $CLIENT_NAME"
    echo -e "${BLUE}Location:${NC} $(pwd)"
    echo -e "${BLUE}Deploy Target:${NC} $DEPLOY_TARGET"
    if [ ! -z "$DOMAIN" ]; then
        echo -e "${BLUE}Custom Domain:${NC} $DOMAIN"
    fi
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Review and customize content in src/app/demo/page.tsx"
    echo "2. Replace mock data with client's actual information"
    echo "3. Upload client's images to replace Unsplash URLs"
    echo "4. Set up contact form email backend if needed"
    echo "5. Test all functionality before client handoff"
    echo ""
    echo -e "${GREEN}⏱️  Total setup time: ~5 minutes${NC}"
    echo -e "${GREEN}🎯 Ready for client customization!${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--name)
            CLIENT_NAME="$2"
            shift 2
            ;;
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -t|--target)
            DEPLOY_TARGET="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate required arguments
if [ -z "$CLIENT_NAME" ]; then
    log_error "Client name is required. Use -n or --name flag."
    show_help
    exit 1
fi

# Validate deployment target
if [[ ! "$DEPLOY_TARGET" =~ ^(vercel|netlify|github-pages)$ ]]; then
    log_error "Invalid deployment target: $DEPLOY_TARGET"
    log_error "Valid options: vercel, netlify, github-pages"
    exit 1
fi

# Main execution
log_info "Starting LEAN Website deployment for: $CLIENT_NAME"
log_info "Deployment target: $DEPLOY_TARGET"

check_dependencies
setup_project
customize_content
install_dependencies
build_project
setup_git

if [[ "$DEPLOY_TARGET" != "github-pages" ]]; then
    deploy_project
else
    show_completion_summary
    exit 0
fi

show_completion_summary