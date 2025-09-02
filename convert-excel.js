const XLSX = require('xlsx');
const fs = require('fs');

// Function to generate unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 13);
}

console.log('Converting Excel to JSON...');

try {
  // Read Excel file
  const workbook = XLSX.readFile('./data/agenda.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON - skip first 2 rows (headers are on row 3)
  const rawData = XLSX.utils.sheet_to_json(worksheet, { range: 2 }); // Start from row 3 (index 2)
  console.log('Found', rawData.length, 'rows in Excel file');
  
  if (rawData.length === 0) {
    throw new Error('No data found in Excel file');
  }
  
  // Show column names to debug
  console.log('Available columns:', Object.keys(rawData[0] || {}));
  
  // Transform data to expected format
  const sessions = rawData.map((row, index) => {
    // Map specific Excel column names to standard fields
    const id = row['Unique ID'] || generateId();
    const title = row['Session Title*'] || row['Session Title'] || '';
    const track = row['1st Filter Name'] || row['Track'] || 'General';
    const startDateTime = row['Start Date & Time\nMM/DD/YYYY 12H'] || row['Start Date & Time'] || row['Start'];
    const endDateTime = row['End Date & Time\nMM/DD/YYYY 12H'] || row['End Date & Time'] || row['End'];
    const room = row['Sessions Main Location'] || row['Room'] || '—';
    const speaker = row['(Email, Session-Role)'] || row['Speaker'] || '—';
    const level = row['2nd Filter Name'] || row['Level'] || 'All';
    const description = row['Description'] || '';
    
    // Extract day from start datetime and format properly
    let day = '';
    let start = '';
    let end = '';
    
    if (startDateTime) {
      let startDate;
      
      // Handle Excel date serial numbers
      if (typeof startDateTime === 'number') {
        // Convert Excel date serial to JavaScript Date
        startDate = new Date((startDateTime - 25569) * 86400 * 1000);
      } else {
        // Try to parse as regular date string
        startDate = new Date(startDateTime);
      }
      
      if (!isNaN(startDate.getTime())) {
        day = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        start = startDate.toISOString().replace('Z', '-07:00'); // Pacific time
        console.log(`Session "${title}": ${startDateTime} -> ${day} ${start}`);
      } else {
        console.warn(`Could not parse start date for session "${title}": ${startDateTime}`);
      }
    }
    
    if (endDateTime) {
      let endDate;
      
      // Handle Excel date serial numbers
      if (typeof endDateTime === 'number') {
        // Convert Excel date serial to JavaScript Date
        endDate = new Date((endDateTime - 25569) * 86400 * 1000);
      } else {
        // Try to parse as regular date string
        endDate = new Date(endDateTime);
      }
      
      if (!isNaN(endDate.getTime())) {
        end = endDate.toISOString().replace('Z', '-07:00'); // Pacific time
      }
    }
    
    // Handle regEnabled field
    let regEnabled = true; // default to enabled
    const enabledValue = row['Session Registration (Enabled/Disabled)'] || row['Enabled'];
    
    if (enabledValue !== undefined) {
      if (typeof enabledValue === 'boolean') {
        regEnabled = enabledValue;
      } else if (typeof enabledValue === 'string') {
        const valueStr = enabledValue.toLowerCase();
        regEnabled = valueStr.includes('enabled') || valueStr === 'true' || valueStr === '1' || valueStr === 'yes';
      } else if (typeof enabledValue === 'number') {
        regEnabled = enabledValue !== 0;
      }
    }
    
    return {
      id,
      title,
      track,
      day,
      start,
      end,
      room,
      speaker,
      level,
      description,
      regEnabled
    };
  });
  
  // Filter out invalid sessions (must have title)
  const validSessions = sessions.filter(s => s.title && s.title.trim() !== '');
  console.log('Processed', validSessions.length, 'valid sessions');
  
  // Show a sample session for debugging
  if (validSessions.length > 0) {
    console.log('Sample session:', JSON.stringify(validSessions[0], null, 2));
  }
  
  // Create the output JSON
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'agenda.xlsx',
      totalSessions: validSessions.length
    },
    sessions: validSessions
  };
  
  // Write to agenda.json
  fs.writeFileSync('./agenda.json', JSON.stringify(output, null, 2));
  console.log('Successfully generated agenda.json with', validSessions.length, 'sessions');
  
} catch (error) {
  console.error('Error processing Excel file:', error.message);
  process.exit(1);
}