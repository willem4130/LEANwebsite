# Payload CMS MCP Server Setup Instructions

## Overview
This guide will help you configure the Payload CMS MCP server with project-level scope for enhanced development workflow with Claude Code.

## Prerequisites
- Railway account (free tier available)
- Railway CLI installed
- Node.js 18+ (you already have this)

## Step 1: Railway Account Setup

1. **Create Railway Account**
   ```bash
   # Visit https://railway.app and sign up
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   ```

2. **Get Railway API Token**
   ```bash
   # Generate API token in Railway dashboard
   # Go to https://railway.app/account/tokens
   # Create new token and copy it
   ```

## Step 2: Claude Code MCP Configuration

Add this configuration to your Claude Code settings. The exact location depends on your setup:

### For Claude Code Desktop App:
Add to your MCP settings or `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "payloadcms": {
      "command": "npx",
      "args": [
        "-y",
        "@matmax/payload-mcp-server",
        "-s", "/Users/willemvandenberg/Development/Websites/LEANwebsite"
      ],
      "env": {
        "RAILWAY_TOKEN": "YOUR_RAILWAY_TOKEN_HERE"
      }
    }
  }
}
```

### For Cursor IDE:
Add to your Cursor settings (`.cursor/settings.json`):

```json
{
  "mcp.servers": {
    "payloadcms": {
      "command": "npx",
      "args": [
        "-y", 
        "@matmax/payload-mcp-server",
        "-s", "/Users/willemvandenberg/Development/Websites/LEANwebsite"
      ],
      "env": {
        "RAILWAY_TOKEN": "YOUR_RAILWAY_TOKEN_HERE"
      }
    }
  }
}
```

## Step 3: Project-Level Configuration

The `-s` flag specifies the project scope. This ensures the MCP server:
- Only operates within this LEAN website project
- Has access to your Payload collections and configuration
- Can generate code specific to your project structure

## Step 4: Available MCP Commands

Once configured, you'll have access to these enhanced capabilities:

### Code Generation
```
"Generate a new Payload collection for album reviews"
"Create a hook for handling image uploads"
"Generate an API endpoint for tour date management"
```

### Code Validation
```
"Validate my Payload configuration"
"Check my collection schema for best practices"
"Review my custom field implementation"
```

### Project Scaffolding
```
"Add a new content type for band merchandise"
"Create a migration for adding social links"
"Generate a custom plugin for music streaming integration"
```

## Step 5: Testing Your Setup

1. **Restart Claude Code** after adding the MCP configuration
2. **Test with a simple command**: "List my current Payload collections"
3. **Verify project scope**: The MCP should only see files in your LEAN website directory

## Troubleshooting

### Common Issues:
1. **Railway token not working**: Regenerate token in Railway dashboard
2. **MCP server not starting**: Check Node.js version (18+ required)
3. **Project scope issues**: Verify the path in `-s` flag is correct

### Verification Commands:
```bash
# Check if Railway CLI is working
railway whoami

# Verify MCP server can be installed
npx @matmax/payload-mcp-server --help
```

## Next Steps

Once configured, you can:
1. Ask Claude to analyze your current Payload setup
2. Generate new collections or modify existing ones
3. Create custom hooks and endpoints
4. Validate your code against Payload best practices

## Project-Specific Benefits

With this setup, the MCP server will understand:
- Your existing collections (Users, Media, Artists, Releases, etc.)
- Your PostgreSQL database configuration
- Your Next.js 15 + Payload 3.x setup
- Your custom admin styling and branding

This creates a powerful development environment where Claude can provide context-aware assistance specifically for your music artist website project.