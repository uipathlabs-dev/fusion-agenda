const fs = require('fs');

console.log('Updating agenda.json regEnabled values...');

try {
  // Read the current agenda.json
  const agendaData = JSON.parse(fs.readFileSync('./agenda.json', 'utf8'));
  
  // Sessions that should be hidden (regEnabled: false)
  const hiddenSessionTypes = [
    'test', // test entries
  ];
  
  let updatedCount = 0;
  let enabledCount = 0;
  let disabledCount = 0;
  
  // Update each session
  agendaData.sessions = agendaData.sessions.map(session => {
    const originalRegEnabled = session.regEnabled;
    
    // Default to enabled (visible) unless it's in the hidden list
    let shouldBeEnabled = true;
    
    // Check if this session should be hidden
    const titleLower = session.title.toLowerCase();
    if (hiddenSessionTypes.some(type => titleLower.includes(type.toLowerCase()))) {
      shouldBeEnabled = false;
    }
    
    // Update the regEnabled value
    session.regEnabled = shouldBeEnabled;
    
    if (originalRegEnabled !== shouldBeEnabled) {
      console.log(`Updated "${session.title}": ${originalRegEnabled} → ${shouldBeEnabled}`);
      updatedCount++;
    }
    
    if (shouldBeEnabled) {
      enabledCount++;
    } else {
      disabledCount++;
    }
    
    return session;
  });
  
  // Update metadata
  agendaData.metadata.generatedAt = new Date().toISOString();
  agendaData.metadata.totalSessions = agendaData.sessions.length;
  
  // Write the updated file
  fs.writeFileSync('./agenda.json', JSON.stringify(agendaData, null, 2));
  
  console.log(`\n✅ Successfully updated agenda.json:`);
  console.log(`   - Total sessions: ${agendaData.sessions.length}`);
  console.log(`   - Enabled (visible): ${enabledCount}`);
  console.log(`   - Disabled (hidden): ${disabledCount}`);
  console.log(`   - Changed: ${updatedCount}`);
  
} catch (error) {
  console.error('❌ Error updating agenda.json:', error.message);
  process.exit(1);
}