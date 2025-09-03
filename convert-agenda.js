const XLSX = require('xlsx');
const fs = require('fs');

function generateId() {
  return Math.random().toString(36).substr(2, 13);
}

console.log('Converting Excel Agenda sheet to JSON...');

try {
  const workbook = XLSX.readFile('./data/FUSION Agenda_090225.xlsx');
  const worksheet = workbook.Sheets['Agenda'];
  
  if (!worksheet) {
    throw new Error('Agenda sheet not found');
  }
  
  // Get raw data starting from row 3 (headers) 
  const rawData = XLSX.utils.sheet_to_json(worksheet, { 
    range: 2, // Start from row 3 (0-indexed)
    header: 1 // Use first row as headers
  });
  
  console.log('Found', rawData.length, 'data rows');
  
  if (rawData.length === 0) {
    throw new Error('No data found');
  }
  
  // Get headers from row 3 (index 2)
  const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const headers = allRows[2]; // Row 3 contains headers
  console.log('Headers:', headers.slice(0, 10), '...'); // Show first 10 headers
  
  // Process each data row
  const sessions = [];
  
  for (let i = 1; i < rawData.length; i++) { // Skip header row
    const row = rawData[i];
    if (!row || row.length === 0) continue;
    
    // Map columns by index based on what we saw in the inspection
    const id = row[0] || generateId();
    const title = row[1] || '';
    const description = row[2] || '';
    const startDateTime = row[4]; // Excel date serial
    const endDateTime = row[5];   // Excel date serial
    const visible = row[6] || 'Visible';
    const speaker = row[7] || '';
    
    // Skip empty or invalid sessions
    if (!title || title.trim() === '') continue;
    
    // Convert Excel date serial to JavaScript Date
    let day = '';
    let start = '';
    let end = '';
    
    if (typeof startDateTime === 'number') {
      // Excel date serial to JS Date: (serial - 25569) * 86400 * 1000
      // Round to nearest minute to avoid precision issues (2:59:59.999 -> 3:00:00.000)
      const startTime = Math.round((startDateTime - 25569) * 86400 * 1000 / 60000) * 60000;
      const startDate = new Date(startTime);
      if (!isNaN(startDate.getTime())) {
        day = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
        start = startDate.toISOString().replace('Z', '-07:00'); // Pacific time
      }
    }
    
    if (typeof endDateTime === 'number') {
      // Round to nearest minute to avoid precision issues
      const endTime = Math.round((endDateTime - 25569) * 86400 * 1000 / 60000) * 60000;
      const endDate = new Date(endTime);
      if (!isNaN(endDate.getTime())) {
        end = endDate.toISOString().replace('Z', '-07:00');
      }
    }
    
    // Determine if session is enabled based on visibility
    let regEnabled = true;
    if (visible) {
      const visibilityStr = visible.toString().toLowerCase();
      regEnabled = !visibilityStr.includes('hidden');
    }
    
    // Map columns based on Excel structure investigation:
    // Column 26: 4th Filter Name - contains clean track categories (Registration, Networking, Keynote, Lab, etc.)
    // Column 33: General level categories - contains high-level groupings (Agentic Labs, Cross Industry Summit, etc.)
    // Column 8: Sessions Main Location - room information
    let track = row[26] || 'General';    // 4th Filter Name - session track/type
    const level = row[33] || 'All';      // General level categories - session level/audience
    const room = row[8] || '—';          // Sessions Main Location
    
    // Handle long concatenated track values - use "Lab" for Agentic Labs sessions
    if (track.length > 50 || track.includes(',')) {
      if (title.toString().startsWith('Agentic Labs:')) {
        track = 'Lab';
      } else {
        track = 'General';
      }
    }
    
    const session = {
      id: id.toString(),
      title: title.toString(),
      track: track.toString(),
      day,
      start,
      end,
      room: room.toString(),
      speaker: speaker.toString() || '—',
      level: level.toString(),
      description: description.toString(),
      regEnabled
    };
    
    sessions.push(session);
    console.log(`Processed: ${session.title} on ${session.day}`);
  }
  
  console.log(`Successfully processed ${sessions.length} sessions`);
  
  // Show sample
  if (sessions.length > 0) {
    console.log('Sample session:', JSON.stringify(sessions[0], null, 2));
  }
  
  // Create output JSON
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'agenda.xlsx',
      totalSessions: sessions.length
    },
    sessions
  };
  
  // Write to agenda.json
  fs.writeFileSync('./agenda.json', JSON.stringify(output, null, 2));
  console.log(`✅ Generated agenda.json with ${sessions.length} sessions`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}