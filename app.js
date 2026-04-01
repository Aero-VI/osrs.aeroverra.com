// OSRS Stats Tracker App
const CRYSTALMATHLABS_API = 'https://crystalmathlabs.com/tracker/api.php';
const OSRS_HISCORES_API = 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws';

// Skill data
const SKILLS = [
    'Overall', 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 
    'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 
    'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility', 
    'Thieving', 'Slayer', 'Farming', 'Runecraft', 'Hunter', 'Construction'
];

// Tab switching
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show target content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');
    });
});

// Load stats on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPlayerStats('Samuelb2800', 'player1-stats');
    loadPlayerStats('10tontos', 'player2-stats');
});

// Fetch player stats from Hiscores
async function loadPlayerStats(username, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="loading">Loading stats...</div>';
    
    try {
        // Using Cloudflare Worker for reliable CORS proxy
        const workerUrl = `https://osrs-hiscores-api.autobuy.workers.dev/?player=${encodeURIComponent(username)}`;
        const response = await fetch(workerUrl);
        
        if (!response.ok) {
            throw new Error(`Player "${username}" not found`);
        }
        
        const data = await response.text();
        
        // Check if we actually got hiscores data (should start with numbers)
        if (!data.trim().match(/^-?\d+,\d+,\d+/)) {
            throw new Error('Invalid response from hiscores API');
        }
        
        const stats = parseHiscores(data);
        displayStats(stats, container, username);
    } catch (error) {
        console.error('Error loading stats:', error);
        container.innerHTML = `
            <div class="error-message">
                <h3>${username}</h3>
                <p>⚠️ Failed to load stats</p>
                <p style="font-size: 0.9em; color: #888;">${error.message}</p>
            </div>
        `;
    }
}

// Parse hiscores data
function parseHiscores(data) {
    const lines = data.trim().split('\n');
    const stats = {};
    
    lines.forEach((line, index) => {
        if (index < SKILLS.length) {
            const [rank, level, xp] = line.split(',');
            stats[SKILLS[index]] = {
                rank: parseInt(rank),
                level: parseInt(level),
                xp: parseInt(xp)
            };
        }
    });
    
    return stats;
}

// Display stats in UI
function displayStats(stats, container, username) {
    let html = `<h3 class="player-name">${username}</h3>`;
    
    for (const skill of SKILLS) {
        if (stats[skill] && skill !== 'Overall') {
            html += `
                <div class="skill-row">
                    <span class="skill-name">${skill}</span>
                    <span class="skill-level">${stats[skill].level}</span>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
}



// Load XP gains from CrystalMathLabs
let currentUsername = '';
let currentTimeframe = 'day';

async function loadXPGains(username = currentUsername, timeframe = currentTimeframe) {
    const container = document.getElementById('gains-content');
    
    // Validate username
    if (!username || username.trim() === '') {
        container.innerHTML = `
            <div class="info-message">
                <p>Enter a username above to view XP gains from CrystalMathLabs.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '<div class="loading">Loading XP gains...</div>';
    
    currentUsername = username;
    currentTimeframe = timeframe;
    
    try {
        // CrystalMathLabs API endpoint for tracking
        const cmlUrl = `https://crystalmathlabs.com/tracker/api.php?type=track&player=${encodeURIComponent(username)}&time=${timeframe}`;
        
        const response = await fetch(cmlUrl);
        const data = await response.text();
        
        if (data.includes('No change in stats') || data.includes('error') || !data.trim()) {
            container.innerHTML = `
                <div class="info-message">
                    <p>No XP gains detected for ${username} in the last ${timeframe === 'day' ? '24 hours' : timeframe === 'week' ? 'week' : 'month'}.</p>
                    <p style="font-size: 0.9em; color: #888; margin-top: 10px;">Note: Player must be tracked on CrystalMathLabs to show gains.</p>
                </div>
            `;
            return;
        }
        
        // Parse the CML response
        const lines = data.trim().split('\n');
        const gains = [];
        
        lines.forEach((line, index) => {
            if (index < SKILLS.length) {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const xpGain = parseInt(parts[1]);
                    if (xpGain > 0) {
                        gains.push({
                            skill: SKILLS[index],
                            xp: xpGain
                        });
                    }
                }
            }
        });
        
        // Sort by XP gained
        gains.sort((a, b) => b.xp - a.xp);
        
        if (gains.length === 0) {
            container.innerHTML = `
                <div class="info-message">
                    <p>No XP gains detected for ${username} in the last ${timeframe === 'day' ? '24 hours' : timeframe === 'week' ? 'week' : 'month'}.</p>
                </div>
            `;
            return;
        }
        
        // Display gains
        let html = `<div class="gains-header"><h3>XP Gains for ${username}</h3></div>`;
        html += '<div class="gains-list">';
        
        gains.forEach((gain, index) => {
            html += `
                <div class="gain-row">
                    <span class="gain-rank">#${index + 1}</span>
                    <span class="gain-skill">${gain.skill}</span>
                    <span class="gain-xp">+${gain.xp.toLocaleString()} XP</span>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading XP gains:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>⚠️ Failed to load XP gains</p>
                <p style="font-size: 0.9em; color: #888;">${error.message}</p>
                <p style="font-size: 0.9em; color: #888; margin-top: 10px;">Try: Make sure the player is tracked on CrystalMathLabs first.</p>
            </div>
        `;
    }
}

// Set up timeframe buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const timeframe = btn.getAttribute('data-timeframe');
            loadXPGains(currentUsername, timeframe);
        });
    });
    

});



// Styles for XP Gains
const additionalStyles = `
<style>
.gains-header {
    margin-bottom: 15px;
}

.gains-header h3 {
    color: var(--osrs-gold);
    font-size: 1.3rem;
}

.gains-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.gain-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: var(--osrs-bg-dark);
    border: 1px solid var(--osrs-border);
    border-radius: 5px;
}

.gain-rank {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--osrs-gold);
    min-width: 50px;
}

.gain-skill {
    flex: 1;
    font-weight: 500;
}

.gain-xp {
    color: var(--success);
    font-weight: 600;
}

.info-message, .error-message {
    padding: 20px;
    background-color: var(--osrs-bg-dark);
    border: 2px solid var(--osrs-border);
    border-radius: 8px;
    text-align: center;
}

.error-message {
    border-color: #d32f2f;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);