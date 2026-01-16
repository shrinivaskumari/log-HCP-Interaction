# 📸 Screenshots Guide

## Required Screenshots

To complete the README, please add the following screenshots to the `docs/screenshots/` directory:

### 1. dashboard.png
- **What to capture**: Full view of the application with both form and table visible
- **Resolution**: 1920x1080 or higher
- **Format**: PNG
- **Tips**: 
  - Use a clean browser window (hide bookmarks bar)
  - Show some sample data in the table
  - Ensure good lighting/contrast

### 2. form.png
- **What to capture**: Close-up of the interaction logging form
- **Resolution**: 1200x800 minimum
- **Format**: PNG
- **Tips**:
  - Show the form with some data filled in
  - Capture the dropdown menu open
  - Include the "Save Interaction" button

### 3. list.png
- **What to capture**: The interaction list table with multiple entries
- **Resolution**: 1200x800 minimum
- **Format**: PNG
- **Tips**:
  - Show at least 5-10 interactions
  - Include different interaction types (Visit, Call, Virtual)
  - Show the color-coded badges

### 4. api-docs.png
- **What to capture**: Swagger UI at http://localhost:8000/docs
- **Resolution**: 1920x1080 or higher
- **Format**: PNG
- **Tips**:
  - Expand one or two endpoints to show details
  - Show the "Try it out" functionality
  - Capture the schema definitions

### 5. ai-agent.png
- **What to capture**: Console or logs showing AI agent processing
- **Resolution**: 1200x800 minimum
- **Format**: PNG
- **Tips**:
  - Show the LangGraph workflow in action
  - Capture tool execution logs
  - Include LLM response if visible

## How to Take Screenshots

### Windows
1. Press `Windows + Shift + S` to open Snipping Tool
2. Select area to capture
3. Save to `docs/screenshots/` directory

### macOS
1. Press `Cmd + Shift + 4` for selection tool
2. Click and drag to select area
3. Screenshot saves to Desktop, move to `docs/screenshots/`

### Linux
1. Use `gnome-screenshot` or `flameshot`
2. Save to `docs/screenshots/` directory

## Screenshot Checklist

- [ ] dashboard.png - Main application view
- [ ] form.png - Interaction form close-up
- [ ] list.png - Interaction table with data
- [ ] api-docs.png - Swagger UI documentation
- [ ] ai-agent.png - AI agent in action

## After Adding Screenshots

Once you've added all screenshots, verify they display correctly in the README:

```bash
# View README in browser
# The images should load without broken links
```

## Optional: Create a GIF Demo

For even better documentation, consider creating an animated GIF showing:
1. Filling out the form
2. Submitting an interaction
3. Seeing it appear in the table

**Tools for GIF creation**:
- [ScreenToGif](https://www.screentogif.com/) (Windows)
- [Kap](https://getkap.co/) (macOS)
- [Peek](https://github.com/phw/peek) (Linux)

Save as `docs/screenshots/demo.gif` and add to README.
