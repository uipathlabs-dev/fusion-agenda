# 📊 Easy Excel-to-JSON Conversion via GitHub

This guide shows you how to easily update your FUSION agenda by simply uploading Excel files through GitHub's web interface. No local tools or technical setup required!

## 🚀 Quick Start: Update Excel via GitHub

### Method 1: Upload via GitHub Web Interface (Easiest)

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/mihaiandreiuipath/fusion-agenda`
   - Or: `https://github.com/uipathlabs-dev/fusion-agenda` (production)

2. **Navigate to the data folder**
   - Click on the `data/` folder
   - You'll see `agenda.xlsx` listed

3. **Upload your new Excel file**
   - Click `agenda.xlsx` to open it
   - Click the **pencil icon** (Edit this file) OR click **"..."** → **"Upload files"**
   - Drag and drop your new Excel file, or click "choose your files"
   - Make sure the filename is exactly `agenda.xlsx`

4. **Commit the changes**
   - Scroll down to "Commit changes"
   - Add a descriptive message like: `Update FUSION agenda - October sessions`
   - Click **"Commit changes"**

5. **Watch the magic happen! ✨**
   - GitHub Actions will automatically start converting your Excel to JSON
   - This takes about 1-2 minutes
   - The `agenda.json` file will be updated automatically
   - Your website will refresh within 5-10 minutes

### Method 2: Drag & Drop to Repository Root

1. Go to the main page of your repository
2. Drag your Excel file directly onto the file list
3. GitHub will ask you to commit - add a message and commit
4. The workflow will trigger automatically

## 📋 Excel File Requirements

Your Excel file **must** meet these requirements:

### File Structure
- **Filename**: Must be named `agenda.xlsx` (exactly)
- **Sheet Name**: Must have a sheet named "Agenda"
- **Data Location**: Session data starts at row 3 (row 3 contains headers)
- **Format**: Excel (.xlsx) format

### Column Mapping (Based on Your Current Structure)

| Column | Letter | Content | Example |
|--------|--------|---------|---------|
| A | A | Unique ID | `fZXMyxrgNGfBX` |
| B | B | Session Title | `UiPath Vision of an Agentic World` |
| C | C | Description | `Session details and agenda...` |
| E | E | Start Date & Time | Excel date serial (e.g., 45198.375) |
| F | F | End Date & Time | Excel date serial (e.g., 45198.416) |
| G | G | Visibility | `Visible` or `Hidden` |
| H | H | Speaker Info | `daniel.dines@uipath.com,Keynote` |
| I | I | Room/Location | `Main Hall` |
| L | L | Registration Status | `Enabled` or `Disabled` |
| U | U | Track (1st Filter) | `General`, `Target Audience`, etc. |
| W | W | Level (2nd Filter) | `All`, `Industry`, `Product` |

### Important Notes
- **Date Format**: Use Excel's date/time cells (not text). The system automatically converts Excel serial numbers
- **Empty Cells**: Empty sessions (no title) are automatically skipped
- **Hidden Sessions**: Sessions marked as "Hidden" in column G will have `regEnabled: false`

## 🔄 How the Automation Works

### What Happens When You Upload Excel:

1. **File Upload** → GitHub detects Excel file change
2. **Workflow Trigger** → GitHub Actions starts automatically  
3. **Processing** → Converts Excel serial dates to Pacific Time
4. **JSON Generation** → Creates/updates `agenda.json`
5. **Auto-commit** → Commits the JSON file with a timestamp
6. **Site Update** → GitHub Pages refreshes your live site

### Workflow Details
- **Trigger**: Any `.xlsx` or `.xls` file pushed to `data/` folder
- **Processing Time**: ~1-2 minutes
- **Auto-commit Message**: Includes filename and timestamp
- **Error Handling**: Shows detailed errors if conversion fails

## 🎯 Step-by-Step Visual Guide

### Updating Excel File on GitHub:

```
GitHub Repository → data/ folder → agenda.xlsx → Edit/Upload → Commit
     ↓
GitHub Actions automatically triggers
     ↓  
Excel → JSON conversion (1-2 minutes)
     ↓
agenda.json updated automatically
     ↓
Live site updates (5-10 minutes)
```

## 📊 Monitoring Your Updates

### Check if Conversion Worked:

1. **Actions Tab**
   - Go to your repository → **Actions** tab
   - Look for "Process Excel to JSON" workflows
   - Green checkmark ✅ = success, Red X ❌ = failed

2. **Check the JSON File**
   - Navigate to `agenda.json` in your repository
   - File should be ~60-70KB (not empty)
   - Check the `metadata.generatedAt` timestamp

3. **Test Your Live Site**
   - Development: `https://mihaiandreiuipath.github.io/fusion-agenda/`
   - Production: `https://uipathlabs-dev.github.io/fusion-agenda/`
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

## ⚡ Manual Workflow Trigger

If you need to re-run the conversion without uploading a new file:

1. Go to **Actions** tab in your repository
2. Click **"Process Excel to JSON"** workflow
3. Click **"Run workflow"** button
4. Select your branch (usually `main`)
5. Click **"Run workflow"**

## 🐛 Troubleshooting

### Common Issues & Solutions:

**❌ Problem**: Workflow doesn't start
- **Solution**: Make sure file is named exactly `agenda.xlsx` in the `data/` folder

**❌ Problem**: "Agenda sheet not found" error
- **Solution**: Ensure your Excel file has a sheet named "Agenda"

**❌ Problem**: Empty or invalid JSON output
- **Solution**: Check that data starts at row 3, and sessions have titles

**❌ Problem**: Wrong dates/times showing
- **Solution**: Ensure date columns (E & F) contain actual Excel date/time values, not text

**❌ Problem**: Site not updating
- **Solution**: Wait 5-10 minutes for GitHub Pages, then hard refresh browser

**❌ Problem**: Workflow fails with permissions error
- **Solution**: Ensure GitHub Actions are enabled in repository settings

### Getting Help:

1. **Check workflow logs** in the Actions tab for detailed error messages
2. **Verify Excel file structure** matches the requirements above
3. **Test with a simple Excel file** first to ensure the workflow works
4. **Compare with existing data** format in current `agenda.json`

## 🎊 Success Indicators

You'll know everything worked when:
- ✅ GitHub Actions shows green checkmark
- ✅ `agenda.json` file is updated with new timestamp
- ✅ File size is substantial (not empty)
- ✅ Live website shows your new sessions within 10 minutes

## 🔄 Dual Repository Setup

Remember you have two repositories:
- **Development**: `mihaiandreiuipath/fusion-agenda` (for testing)
- **Production**: `uipathlabs-dev/fusion-agenda` (for live site)

**Best Practice**: Test changes in development first, then copy to production.

---

## 🎯 Summary: Your New Workflow

1. **Update Excel** → Upload via GitHub web interface
2. **Commit** → Add descriptive message
3. **Wait** → 1-2 minutes for conversion
4. **Verify** → Check Actions tab and agenda.json
5. **Enjoy** → Updated site within 10 minutes!

**No more local Node.js, no more manual commands, no more technical setup!** 🎉