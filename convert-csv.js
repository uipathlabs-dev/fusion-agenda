const fs = require('fs');

// Function to generate unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 13);
}

// Function to parse CSV
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = parseCSVLine(lines[0]); // First line has headers
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
  }
  
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

console.log('Converting CSV to JSON...');

try {
  // Read CSV file
  const csvText = fs.readFileSync('./New Microsoft Excel Worksheet.csv', 'utf-8');
  const rawData = parseCSV(csvText);
  
  console.log('Found', rawData.length, 'rows in CSV file');
  console.log('Available columns:', Object.keys(rawData[0] || {}));
  
  if (rawData.length === 0) {
    throw new Error('No data found in CSV file');
  }
  
  // Transform data to expected format
  const sessions = rawData.map((row, index) => {
    // Map specific CSV column names to standard fields
    const id = row['Unique ID '] || row['Unique ID'] || generateId();
    const title = row['Session Title*'] || row['Session Title'] || '';
    const track = row['1st Filter Name'] || 'General';
    const startDateTime = row['Start Date & Time\\nMM/DD/YYYY 12H'] || row['Start Date & Time'];
    const endDateTime = row['End Date & Time\\nMM/DD/YYYY 12H'] || row['End Date & Time'];
    const room = row['Sessions Main Location'] || '—';
    const speaker = row['(Email, Session-Role)'] || '—';
    const level = row['2nd Filter Name'] || 'All';
    const description = row['Description'] || '';
    
    // Extract day from start datetime and format properly
    let day = '';
    let start = '';
    let end = '';
    
    if (startDateTime && startDateTime.trim()) {
      const startDate = new Date(startDateTime);
      if (!isNaN(startDate.getTime())) {
        day = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        start = startDate.toISOString().replace('Z', '-07:00'); // Pacific time
        console.log(`Session "${title}": ${startDateTime} -> ${day} ${start}`);
      } else {
        console.warn(`Could not parse start date for session "${title}": ${startDateTime}`);
      }
    }
    
    if (endDateTime && endDateTime.trim()) {
      const endDate = new Date(endDateTime);
      if (!isNaN(endDate.getTime())) {
        end = endDate.toISOString().replace('Z', '-07:00'); // Pacific time
      }
    }
    
    // Handle regEnabled field
    let regEnabled = true; // default to enabled
    const enabledValue = row['Session Registration (Enabled/Disabled)'] || row['Enabled'];
    
    if (enabledValue !== undefined && enabledValue.trim()) {
      const valueStr = enabledValue.toLowerCase();
      regEnabled = valueStr.includes('enabled') || valueStr === 'true' || valueStr === '1' || valueStr === 'yes';
    }
    
    return {
      id,
      title: title.trim(),
      track: track.trim() || 'General',
      day,
      start,
      end,
      room: room.trim() || '—',
      speaker: speaker.trim() || '—',
      level: level.trim() || 'All',
      description: description.trim(),
      regEnabled
    };
  });
  
  // Filter out invalid sessions (must have title)
  const validSessions = sessions.filter(s => s.title && s.title !== '');
  console.log('Processed', validSessions.length, 'valid sessions');
  
  // Show a sample session for debugging
  if (validSessions.length > 0) {
    console.log('Sample session:', JSON.stringify(validSessions[0], null, 2));
  }
  
  // Create the output JSON
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'New Microsoft Excel Worksheet.csv',
      totalSessions: validSessions.length
    },
    sessions: validSessions
  };
  
  // Write to agenda.json
  fs.writeFileSync('./agenda.json', JSON.stringify(output, null, 2));
  console.log('Successfully generated agenda.json with', validSessions.length, 'sessions');
  
} catch (error) {
  console.error('Error processing CSV file:', error.message);
  process.exit(1);
}