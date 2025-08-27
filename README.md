# Fusion Agenda Builder

A simple, GitHub-powered agenda management system where you upload Excel files and automatically generate a public agenda website with PDF export capabilities.

## 🚀 How It Works

**For You (Admin):**
1. Upload new Excel file to the `data/` folder (via GitHub web interface)
2. GitHub Actions automatically converts Excel → JSON  
3. Site updates automatically within 2-3 minutes
4. That's it!

**For Users:**
1. Visit your GitHub Pages URL
2. View the latest agenda data (loads automatically)
3. Select sessions and export personalized PDF schedules

## 📋 Quick Setup

### 1. Create GitHub Repository

```bash
# Create a new repository named 'fusion-agenda' on GitHub
# Clone it locally or work directly in GitHub web interface
```

### 2. Upload Files

Copy these files to your repository:
```
fusion-agenda/
├── index.html          # Main agenda app
├── agenda.json         # Auto-generated from Excel  
├── data/
│   └── agenda.xlsx     # Your Excel file (you update this)
├── .github/
│   └── workflows/
│       └── process-excel.yml  # Automation workflow
└── README.md
```

### 3. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Source: **Deploy from branch**
3. Branch: **main** 
4. Folder: **/ (root)**
5. Save

Your site will be available at: `https://[username].github.io/fusion-agenda/`

## 📊 Excel File Format

### Required Columns

Your Excel file should have these columns (column names can vary):

| Required | Column Names (case-insensitive) | Example |
|----------|--------------------------------|---------|
| ✅ | **Title** / Session / SESSION | "Keynote: The Future of AI" |
| ✅ | **Start** / Start Time / start_time | "2025-09-30 09:00" |
| ✅ | **End** / End Time / end_time | "2025-09-30 09:15" |
| ✅ | **Day** / Date / DATE | "2025-09-30" |
| ⭕ | **Track** / TRACK | "Keynotes" |
| ⭕ | **Room** / Location / ROOM | "Main Hall" |
| ⭕ | **Speaker** / Presenter | "John Doe" |
| ⭕ | **Level** / LEVEL | "All" / "Beginner" / "Advanced" |
| ⭕ | **Description** / Abstract | "Session details..." |
| ⭕ | **Enabled** / Registration | "Enabled" / "Disabled" |

### Date/Time Formats Supported

- **Excel dates**: Standard Excel date/time cells
- **ISO format**: `2025-09-30T09:00:00-07:00`
- **Simple format**: `2025-09-30 09:00`
- **US format**: `9/30/2025 9:00 AM`

### Sample Excel Structure

| Title | Track | Day | Start | End | Room | Speaker | Description |
|-------|-------|-----|--------|-----|------|---------|------------|
| Opening Keynote | Keynotes | 2025-09-30 | 2025-09-30 09:00 | 2025-09-30 09:45 | Main Hall | Jane Smith | Welcome presentation |
| Workshop: AI Basics | Workshops | 2025-09-30 | 2025-09-30 10:00 | 2025-09-30 11:30 | Room A | Bob Johnson | Hands-on AI workshop |

## 🔄 Your Workflow

### Method 1: GitHub Web Interface (Easiest)

1. **Go to your repository** on GitHub
2. **Navigate to `data/agenda.xlsx`**
3. **Click the pencil icon** (Edit)
4. **Upload new Excel file** (drag & drop or click "choose files")
5. **Commit changes** (add a commit message)
6. **Wait 2-3 minutes** for automatic processing
7. **Visit your site** to see updates

### Method 2: Git Commands

```bash
# Clone your repo
git clone https://github.com/[username]/fusion-agenda.git
cd fusion-agenda

# Replace Excel file
cp /path/to/new-agenda.xlsx data/agenda.xlsx

# Commit and push
git add data/agenda.xlsx
git commit -m "Update agenda for Q4 event"
git push

# GitHub Actions will automatically process the update
```

## 🛠️ Technical Details

### Architecture

- **Frontend**: Single-page HTML app with vanilla JavaScript
- **Data**: JSON file auto-generated from Excel
- **Hosting**: GitHub Pages (free)
- **Processing**: GitHub Actions (free tier: 2,000 minutes/month)

### GitHub Action Workflow

The `.github/workflows/process-excel.yml` file:

1. **Triggers** when Excel files in `data/` folder change
2. **Reads** Excel file using SheetJS library
3. **Converts** to JSON format expected by the app
4. **Validates** data (removes invalid sessions)
5. **Commits** updated `agenda.json` back to repository
6. **Deploys** automatically via GitHub Pages

### Features

- ✅ **Fully offline-capable** once loaded
- ✅ **No external dependencies** (everything embedded)
- ✅ **Mobile-responsive** design
- ✅ **Professional PDF export** with UiPath branding
- ✅ **Advanced filtering** (search, track, day, level)
- ✅ **Session selection** and agenda building
- ✅ **Automatic data validation**
- ✅ **Version control** for all agenda changes

## 🎨 Customization

### Branding

The UiPath logo is embedded as a data URL in `index.html`. To change:

1. Convert your logo to base64: https://base64.guru/converter/encode/image
2. Replace the `LOGO_DATAURL` variable in `index.html`

### Colors & Styling

Modify the CSS variables in `index.html`:

```css
:root{ 
  --deep-blue: #182126;     /* Background */
  --orange: #FA4616;        /* Primary accent */ 
  --teal: #0BA2B3;          /* Secondary accent */
  --white: #FFFFFF;         /* Text */
}
```

### Custom Domain

1. Add a `CNAME` file to your repository root:
   ```
   agenda.yourcompany.com
   ```
2. Configure DNS to point to `[username].github.io`
3. Update GitHub Pages settings to use custom domain

## 🐛 Troubleshooting

### Excel File Not Processing

**Issue**: Uploaded Excel file but no agenda.json update

**Solutions**:
- Check GitHub Actions tab for error logs
- Ensure Excel file is in `data/` folder
- Verify Excel file has required columns (Title, Start, Day)
- File size must be < 25MB for GitHub

### Site Not Loading Data

**Issue**: Agenda shows "Loading..." or "Failed to load"

**Solutions**:
- Check that `agenda.json` exists in repository root
- Verify GitHub Pages is enabled and deployed
- Try hard refresh (Ctrl+F5) to clear cache
- Check browser console for error messages

### Date Format Issues

**Issue**: Sessions showing incorrect times or "Invalid Date"

**Solutions**:
- Use Excel date/time cells instead of text
- Ensure timezone consistency in your data
- Check the date format in generated `agenda.json`

### GitHub Actions Quota

**Issue**: "You have exceeded your usage quota"

**Solutions**:
- Free tier includes 2,000 minutes/month
- Optimize by only updating Excel when needed
- Consider GitHub Pro ($4/month) for more quota

## 📖 Advanced Usage

### Multiple Events

To manage multiple events, create separate repositories:
- `fusion-agenda-q1` → `yourname.github.io/fusion-agenda-q1`
- `fusion-agenda-q2` → `yourname.github.io/fusion-agenda-q2`

### Backup Strategy

Your git history serves as automatic backup:
```bash
# View all agenda versions
git log --oneline data/agenda.xlsx

# Restore previous version
git checkout [commit-hash] data/agenda.xlsx
git commit -m "Restore previous agenda version"
git push
```

### Analytics

Add Google Analytics or similar by inserting tracking code in `index.html` before `</head>`:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 📞 Support

### Common Issues
- **Excel processing errors**: Check GitHub Actions logs
- **Site not updating**: Verify GitHub Pages deployment
- **PDF export problems**: Ensure browser allows popups

### Best Practices
- Test with small Excel files first
- Keep session titles concise for better mobile display
- Use consistent date/time formats throughout
- Regular backups via git history

---

**🎉 That's it!** You now have a professional agenda system that updates automatically when you upload Excel files. Perfect for conferences, workshops, and events.

**Live Example**: Upload your Excel file and see changes at `https://[username].github.io/fusion-agenda/` within minutes!