# FUSION Agenda Builder

A responsive web application for displaying and filtering UiPath FUSION event sessions. Built as an offline-first PDF export tool that allows users to create customized agenda PDFs for conference attendees.

## 🚀 How It Works

**For Admins:**
1. Update Excel file (`data/agenda.xlsx`) with session data
2. Run local conversion script: `node convert-agenda.js`
3. Commit and push changes to GitHub repositories
4. Site updates automatically via GitHub Pages

**For Users:**
1. Visit the GitHub Pages URL
2. Filter and browse FUSION sessions
3. Select sessions for personalized agenda
4. Export to PDF with custom branding

## 📋 Project Structure

### File Organization

```
fusion-agenda/
├── index.html              # Main application (single-page app)
├── agenda.json             # Session data (generated from Excel)
├── data/
│   └── agenda.xlsx         # Source Excel file with session data
├── convert-agenda.js       # Excel to JSON conversion script  
├── convert-csv.js          # Alternative CSV conversion script
├── package.json            # Node.js dependencies
└── README.md              # This documentation
```

## 🛠️ Setup and Development

### Prerequisites

- Node.js (for running conversion scripts)
- Git (for version control)
- Excel file with FUSION session data

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mihaiandreiuipath/fusion-agenda.git
   cd fusion-agenda
   ```

2. **Install dependencies:**
   ```bash
   npm install xlsx
   ```

3. **Setup Git remotes:**
   ```bash
   git remote add origin https://github.com/mihaiandreiuipath/fusion-agenda.git
   git remote add production https://github.com/uipathlabs-dev/fusion-agenda.git
   ```

## 📊 Excel File Format

The Excel file (`data/agenda.xlsx`) must have specific structure:

### Sheet Requirements
- **Sheet Name**: "Agenda"
- **Data Starts**: Row 3 (headers in row 3)
- **Format**: Excel (.xlsx) file format

### Column Mapping

| Column | Purpose | Example |
|--------|---------|---------|
| A | Unique ID | "fZXMyxrgNGfBX" |
| B | Session Title | "UiPath Vision of an Agentic World" |
| C | Description | "Session details..." |
| E | Start Date & Time | Excel date serial (45198.375) |
| F | End Date & Time | Excel date serial (45198.416) |
| G | Visibility | "Visible" / "Hidden" |
| H | Speaker | "Daniel.dines@uipath.com,Keynote" |
| I | Room/Location | "Main Hall" |
| L | Registration Status | "Enabled" / "Disabled" |
| U | Track (1st Filter) | "General" / "Target Audience" |
| W | Level (2nd Filter) | "All" / "Industry" / "Product" |

## 🔄 Data Management Workflow

### When Excel File Is Updated

1. **Replace the Excel file:**
   ```bash
   # Copy new Excel file to data folder
   cp /path/to/new-agenda.xlsx data/agenda.xlsx
   ```

2. **Convert Excel to JSON:**
   ```bash
   # Run the conversion script
   node convert-agenda.js
   ```

3. **Commit and deploy changes:**
   ```bash
   # Stage changes
   git add agenda.json data/agenda.xlsx
   
   # Commit with descriptive message
   git commit -m "Update session data from Excel - [date/event details]"
   
   # Push to both repositories
   git push origin main
   git push production main
   ```

### Date/Time Handling

- **Excel Format**: Date/time stored as Excel serial numbers
- **Conversion**: `(serial - 25569) * 86400 * 1000` to JavaScript Date
- **Output**: ISO 8601 format with Pacific Time offset (-07:00)
- **Display**: Formatted for Pacific Time Zone

## 🚀 Deployment

### GitHub Repositories

The project uses dual-repository setup:

1. **Development Repository:**
   - URL: `https://github.com/mihaiandreiuipath/fusion-agenda.git`
   - Purpose: Development and testing
   - GitHub Pages: `https://mihaiandreiuipath.github.io/fusion-agenda/`

2. **Production Repository:**
   - URL: `https://github.com/uipathlabs-dev/fusion-agenda.git`
   - Purpose: Production deployment
   - GitHub Pages: `https://uipathlabs-dev.github.io/fusion-agenda/`

### GitHub Pages Setup

For both repositories:
1. Go to **Settings** → **Pages**
2. Source: **Deploy from branch**
3. Branch: **main**
4. Folder: **/ (root)**
5. Save

### Deployment Process

```bash
# Standard deployment to both repositories
git push origin main        # Push to development
git push production main    # Push to production

# If repositories have diverged, you may need:
git pull --rebase origin main
git pull --rebase production main

# Force push if necessary (use with caution):
git push origin main --force-with-lease
git push production main --force-with-lease
```

## 🛠️ Technical Details

### Architecture

- **Frontend**: Single-page HTML app with vanilla JavaScript
- **Data**: JSON file generated from Excel via Node.js script
- **Hosting**: GitHub Pages (static hosting)
- **Processing**: Local conversion script (no GitHub Actions)
- **Dependencies**: None in frontend, XLSX library for conversion

### Core Features

- ✅ **Offline-first design** (no external dependencies)
- ✅ **Mobile-responsive** interface
- ✅ **Professional PDF export** with FUSION branding
- ✅ **Advanced filtering** (search, track, day, level, room)
- ✅ **Session selection** and custom agenda building
- ✅ **Real-time search** and filtering
- ✅ **Registration status handling** (enabled/disabled sessions)
- ✅ **Multi-day event support** (Sep 29 - Oct 2, 2025)

### Data Processing Features

- ✅ **Excel serial date conversion**
- ✅ **Pacific Time Zone handling** 
- ✅ **Session validation** (removes invalid entries)
- ✅ **Duplicate ID generation** for missing IDs
- ✅ **Multi-column speaker parsing**

## 🎨 Customization

### Branding and Colors

The application uses UiPath brand colors defined in CSS variables:

```css
:root{ 
  --deep-blue: #182126;     /* Background */
  --orange: #FA4616;        /* Primary accent (FUSION orange) */
  --teal: #0BA2B3;          /* Secondary accent */
  --white: #FFFFFF;         /* Text color */
  --muted: #A0AAB9;         /* Muted text */
}
```

### Page Title

Currently set to "FUSION Agenda Builder" in both:
- HTML `<title>` tag
- Main `<h1>` heading

### PDF Export Branding

- Company name field appears in PDF header
- Custom styling for print media
- Session details optimized for PDF layout

## 🐛 Troubleshooting

### Excel Conversion Issues

**Issue**: `node convert-agenda.js` fails or produces empty JSON

**Solutions**:
- Verify Excel file is named `agenda.xlsx` in `data/` folder
- Check that Excel sheet is named "Agenda"
- Ensure data starts at row 3 (headers in row 3)
- Install XLSX dependency: `npm install xlsx`
- Check for Excel file corruption

### Empty agenda.json on GitHub

**Issue**: GitHub shows empty or outdated agenda.json file

**Solutions**:
- Run `node convert-agenda.js` locally after Excel updates
- Commit and push both `agenda.json` and `data/agenda.xlsx`
- Check git status: `git status`
- Verify file size: `ls -la agenda.json` (should be ~68KB with current data)

### Site Not Loading Data

**Issue**: Webpage shows "Loading..." or "Failed to load"

**Solutions**:
- Hard refresh browser: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
- Check browser developer console for errors (F12)
- Verify GitHub Pages is enabled and deployed
- Check that `agenda.json` exists in repository root
- Wait 5-10 minutes for GitHub Pages deployment

### Date/Time Display Issues

**Issue**: Sessions showing wrong times or "Invalid Date"

**Solutions**:
- Ensure Excel cells contain actual date/time values (not text)
- Verify date columns E and F contain Excel serial numbers
- Check timezone output in `agenda.json` (should end with `-07:00`)
- Test date conversion with sample data

### Git Push Rejected

**Issue**: `git push` fails with "non-fast-forward" error

**Solutions**:
```bash
# Pull and rebase before pushing
git pull --rebase origin main
git push origin main

# For production repository
git pull --rebase production main  
git push production main

# If rebasing fails due to conflicts, use force push (carefully)
git push origin main --force-with-lease
```

### PDF Export Problems

**Issue**: PDF export not working or formatting issues

**Solutions**:
- Ensure browser allows pop-ups from the site
- Try different browsers (Chrome recommended)
- Check that customer name is entered
- Verify sessions are selected before export

## 📖 Quick Reference

### Essential Commands

```bash
# Setup (one-time)
git clone https://github.com/mihaiandreiuipath/fusion-agenda.git
cd fusion-agenda
npm install xlsx

# Daily workflow (when Excel file updates)
node convert-agenda.js                    # Convert Excel to JSON
git add agenda.json data/agenda.xlsx      # Stage changes
git commit -m "Update session data"       # Commit changes
git push origin main                      # Deploy to development
git push production main                  # Deploy to production
```

### File Locations

- **Excel Source**: `data/agenda.xlsx` (update this file)
- **JSON Output**: `agenda.json` (generated, don't edit manually)
- **Main App**: `index.html` (single-page application)
- **Converter**: `convert-agenda.js` (Excel → JSON script)

### URLs

- **Development**: `https://mihaiandreiuipath.github.io/fusion-agenda/`
- **Production**: `https://uipathlabs-dev.github.io/fusion-agenda/`

### Key Data Points

- **Event Dates**: September 29 - October 2, 2025
- **Total Sessions**: 64 (as of latest update)
- **File Size**: ~68KB JSON output
- **Timezone**: Pacific Time (-07:00)
- **Sheet Name**: "Agenda" (in Excel file)
- **Data Row**: Starts at row 3

## 🎯 Best Practices

- **Version Control**: Commit both Excel and JSON files together
- **Testing**: Test locally by opening `index.html` in browser
- **Backup**: Git history serves as automatic backup system
- **Updates**: Always run conversion script after Excel changes
- **Deployment**: Push to both repositories for full deployment
- **Validation**: Check agenda.json file size after conversion (should be substantial, not empty)

---

## 📞 Support

**Current Status**: ✅ Fully deployed and operational

**Live Sites**:
- Development: `https://mihaiandreiuipath.github.io/fusion-agenda/`
- Production: `https://uipathlabs-dev.github.io/fusion-agenda/`

**For Issues**: Check troubleshooting section above or review git commit history for recent changes.

**Last Updated**: August 2025 - FUSION Agenda Builder with 64 sessions