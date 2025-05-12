# Architecture Diagrams

This directory contains Mermaid diagram definition files for the frontend architecture documentation.

## Converting Mermaid to Images

To convert these Mermaid diagram files to PNG images for the documentation:

### Option 1: Mermaid CLI

1. Install Mermaid CLI:
   ```
   npm install -g @mermaid-js/mermaid-cli
   ```

2. Convert each diagram to PNG:
   ```
   mmdc -i repository-pattern.mmd -o ../images/repository-pattern-diagram.png -t neutral
   mmdc -i authentication-flow.mmd -o ../images/authentication-flow-diagram.png -t neutral
   mmdc -i error-handling.mmd -o ../images/error-handling-diagram.png -t neutral
   mmdc -i component-organization.mmd -o ../images/component-organization-diagram.png -t neutral
   ```

### Option 2: Mermaid Live Editor

1. Visit the [Mermaid Live Editor](https://mermaid.live/)
2. Copy the content of each .mmd file and paste it into the editor
3. Customize the theme if needed
4. Download the PNG image
5. Save the image in the `../images/` directory with the appropriate name:
   - `repository-pattern-diagram.png`
   - `authentication-flow-diagram.png`
   - `error-handling-diagram.png`
   - `component-organization-diagram.png`

### Option 3: VS Code Extension

1. Install the "Mermaid Preview" or "Markdown Preview Mermaid Support" extension in VS Code
2. Open the .mmd file in VS Code
3. Use the extension to preview and export the diagram as an image
4. Save the image in the `../images/` directory with the appropriate name

## Styling Guidelines

When exporting the diagrams:
- Use a light, neutral theme for better visibility
- Export at 1200x800 resolution for consistency
- Use PNG format with transparent background
- Ensure text is readable at standard zoom levels

## After Generating Images

Once you've generated all four PNG images and placed them in the `../images/` directory, the architecture documentation should automatically display them correctly, as the markdown files already reference these image paths.