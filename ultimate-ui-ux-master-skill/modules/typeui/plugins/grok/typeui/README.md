# TypeUI Grok Plugin

TypeUI connects Grok to the hosted TypeUI MCP server so it can use project design skills, brand kits, UI prompts, and layout variations while building interfaces.

## Install

Install the plugin from this repository:

```bash
grok plugin install bergside/typeui#plugins/grok/typeui
```

If you are testing from a local checkout, install it from the plugin folder:

```bash
grok plugin install ./plugins/grok/typeui
```

After installation, open Grok's extensions modal with `/plugins`, `/skills`, or `/mcps` and make sure TypeUI is enabled.

## MCP server

This plugin registers the TypeUI remote HTTP MCP server:

```text
https://mcp.typeui.sh
```

If the MCP server does not appear automatically, add it manually:

```bash
grok mcp add --transport http typeui https://mcp.typeui.sh
```

Sign in with TypeUI if Grok asks you to authorize the connection.

## Skill

The plugin also exposes a `/typeui` skill with setup notes and usage guidance for TypeUI projects, brand kits, design skills, prompts, and layout variations.

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- Grok setup guide: https://www.typeui.sh/docs/guides/grok
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms
