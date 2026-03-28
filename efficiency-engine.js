// Efficiency Routing Engine
class EfficiencyEngine {
    constructor() {
        this.routes = {
            farmRuns: {
                herbs: {
                    name: 'Herb Run',
                    type: 'recurring',
                    frequency: 80, // minutes
                    duration: 6, // minutes
                    profit: 200000,
                    requirements: ['Magic Secateurs', '73 Farming'],
                    patches: [
                        { name: 'Ardougne', teleport: 'Ardougne Cloak', time: 0.5 },
                        { name: 'Catherby', teleport: 'Catherby Teleport', time: 0.5 },
                        { name: 'Falador', teleport: 'Explorer Ring', time: 0.5 },
                        { name: 'Port Phasmatys', teleport: 'Ectophial', time: 0.8 },
                        { name: 'Hosidius', teleport: 'Xeric\'s Glade', time: 0.5 },
                        { name: 'Weiss', teleport: 'Icy Basalt', time: 0.8 },
                        { name: 'Farming Guild', teleport: 'Skills Necklace', time: 0.5 },
                        { name: 'Harmony Island', teleport: 'Harmony Island Teleport', time: 1 },
                        { name: 'Troll Stronghold', teleport: 'Stony Basalt', time: 1.2 }
                    ]
                },
                trees: {
                    name: 'Tree Run',
                    type: 'recurring',
                    frequency: 360, // 6 hours
                    duration: 8,
                    profit: 150000,
                    requirements: ['83 Farming'],
                    patches: [
                        { name: 'Lumbridge', tree: 'Magic', teleport: 'Lumbridge Teleport', time: 1 },
                        { name: 'Varrock', tree: 'Magic', teleport: 'Varrock Teleport', time: 1 },
                        { name: 'Falador', tree: 'Magic', teleport: 'Falador Teleport', time: 1 },
                        { name: 'Taverley', tree: 'Magic', teleport: 'Falador Teleport', time: 1.5 },
                        { name: 'Tree Gnome Stronghold', tree: 'Magic', teleport: 'Slayer Ring', time: 1 },
                        { name: 'Farming Guild', tree: 'Redwood', teleport: 'Skills Necklace', time: 1.5 }
                    ]
                },
                birdhouses: {
                    name: 'Birdhouse Run',
                    type: 'recurring',
                    frequency: 50,
                    duration: 2,
                    profit: 80000,
                    xpPerHour: 150000, // Hunter XP
                    requirements: ['9 Hunter', '15 Crafting'],
                    locations: [
                        { name: 'Verdant Valley', teleport: 'Digsite Pendant' },
                        { name: 'Mushroom Meadow', teleport: 'Digsite Pendant' },
                        { name: 'Northern', teleport: 'Digsite Pendant' },
                        { name: 'Southern', teleport: 'Digsite Pendant' }
                    ]
                },
                seaweed: {
                    name: 'Seaweed Run',
                    type: 'recurring',
                    frequency: 240, // 4 hours
                    duration: 3,
                    profit: 0,
                    xpPerHour: 200000, // Crafting XP potential
                    requirements: ['Bone Voyage'],
                    patches: [
                        { name: 'Underwater Patch 1', teleport: 'Digsite Pendant' },
                        { name: 'Underwater Patch 2', teleport: 'Digsite Pendant' }
                    ]
                }
            },
            dailyTasks: {
                battlestaves: {
                    name: 'Zaff Battlestaves',
                    profit: 250000,
                    duration: 1,
                    requirements: ['Varrock Elite Diary'],
                    reset: 'daily'
                },
                sandBuckets: {
                    name: 'Bert\'s Sand',
                    profit: 100000,
                    duration: 0.5,
                    requirements: ['Hand in the Sand'],
                    reset: 'daily'
                },
                herbBoxes: {
                    name: 'Herb Boxes (NMZ)',
                    profit: 150000,
                    duration: 2,
                    requirements: ['NMZ Points'],
                    reset: 'daily'
                },
                dynamite: {
                    name: 'Volcanic Mine Shop',
                    profit: 80000,
                    duration: 1,
                    requirements: ['Volcanic Mine'],
                    reset: 'daily'
                },
                essenceMining: {
                    name: 'Pure Essence (Wizard Cromperty)',
                    profit: 50000,
                    duration: 0.5,
                    requirements: ['Ardougne Medium Diary'],
                    reset: 'daily'
                }
            },
            weeklyTasks: {
                tearsOfGuthix: {
                    name: 'Tears of Guthix',
                    xpReward: 'Varies (lowest skill)',
                    duration: 5,
                    requirements: ['Tears of Guthix Quest'],
                    reset: 'weekly'
                },
                penguinHideAndSeek: {
                    name: 'Penguin Hide & Seek',
                    xpReward: '25k+ in any skill',
                    duration: 30,
                    requirements: ['Cold War Quest'],
                    reset: 'weekly',
                    efficiency: 'high'
                },
                herbiboar: {
                    name: 'Herbiboar Weekly',
                    xpReward: '200k Hunter XP',
                    duration: 120,
                    requirements: ['80 Hunter', '31 Herblore'],
                    reset: 'weekly',
                    efficiency: 'medium'
                }
            },
            afkActivities: {
                // AFK activities sorted by profit
                vyrewatch: {
                    name: 'Vyrewatch Sentinels',
                    type: 'afk',
                    afkRating: 9,
                    profit: 2000000,
                    requirements: ['Sins of the Father'],
                    intensity: 'very low',
                    clicksPerMinute: 0.2
                },
                redwoods: {
                    name: 'Redwood Trees',
                    type: 'afk',
                    afkRating: 10,
                    profit: 0,
                    xpPerHour: 70000,
                    requirements: ['90 Woodcutting'],
                    intensity: 'very low',
                    clicksPerMinute: 0.1
                },
                nmz: {
                    name: 'Nightmare Zone',
                    type: 'afk',
                    afkRating: 8,
                    profit: -50000,
                    xpPerHour: 100000,
                    requirements: ['Combat stats'],
                    intensity: 'low',
                    clicksPerMinute: 0.3
                },
                anglerfish: {
                    name: 'Anglerfish',
                    type: 'afk',
                    afkRating: 9,
                    profit: 150000,
                    xpPerHour: 20000,
                    requirements: ['82 Fishing'],
                    intensity: 'very low',
                    clicksPerMinute: 0.2
                },
                magicTrees: {
                    name: 'Magic Trees',
                    type: 'afk',
                    afkRating: 8,
                    profit: 100000,
                    xpPerHour: 25000,
                    requirements: ['75 Woodcutting'],
                    intensity: 'low',
                    clicksPerMinute: 0.3
                },
                cannonballs: {
                    name: 'Cannonballs',
                    type: 'afk',
                    afkRating: 10,
                    profit: 200000,
                    xpPerHour: 13000,
                    requirements: ['35 Smithing'],
                    intensity: 'very low',
                    clicksPerMinute: 0.05
                }
            },
            activeActivities: {
                tob: {
                    name: 'Theatre of Blood',
                    type: 'active',
                    profit: 5000000,
                    intensity: 'extreme',
                    clicksPerMinute: 30,
                    requirements: ['Max Combat', 'Team']
                },
                cox: {
                    name: 'Chambers of Xeric',
                    type: 'active',
                    profit: 3500000,
                    intensity: 'high',
                    clicksPerMinute: 20,
                    requirements: ['High Combat']
                },
                vorkath: {
                    name: 'Vorkath',
                    type: 'active',
                    profit: 3000000,
                    intensity: 'high',
                    clicksPerMinute: 15,
                    requirements: ['DS2', 'DHCB/DHL']
                },
                corrupted: {
                    name: 'Corrupted Gauntlet',
                    type: 'active',
                    profit: 4000000,
                    intensity: 'extreme',
                    clicksPerMinute: 25,
                    requirements: ['SOTE', 'High skill']
                },
                sepulchre: {
                    name: 'Hallowed Sepulchre',
                    type: 'active',
                    profit: 2500000,
                    xpPerHour: 100000,
                    intensity: 'extreme',
                    clicksPerMinute: 40,
                    requirements: ['92 Agility']
                }
            }
        };
        
        this.playerSchedule = [];
    }

    generateOptimalRoute(playtime, preferences) {
        const route = {
            recurring: [],
            daily: [],
            weekly: [],
            activities: []
        };
        
        // Calculate recurring tasks that fit in playtime
        if (preferences.includeFarmRuns) {
            Object.values(this.routes.farmRuns).forEach(run => {
                const cycles = Math.floor(playtime / run.frequency);
                if (cycles > 0) {
                    route.recurring.push({
                        ...run,
                        cycles,
                        totalTime: cycles * run.duration,
                        totalProfit: cycles * run.profit
                    });
                }
            });
        }
        
        // Add daily tasks
        if (preferences.includeDailies) {
            Object.values(this.routes.dailyTasks).forEach(task => {
                route.daily.push(task);
            });
        }
        
        // Add weekly tasks if appropriate day
        if (preferences.includeWeeklies) {
            Object.values(this.routes.weeklyTasks).forEach(task => {
                route.weekly.push(task);
            });
        }
        
        // Fill remaining time with activities
        const remainingTime = this.calculateRemainingTime(playtime, route);
        
        if (preferences.activityType === 'afk') {
            route.activities = this.selectAFKActivities(remainingTime, preferences.afkLevel);
        } else if (preferences.activityType === 'active') {
            route.activities = this.selectActiveActivities(remainingTime, preferences.intensity);
        } else {
            // Mix of both
            route.activities = this.selectMixedActivities(remainingTime);
        }
        
        return route;
    }

    calculateRemainingTime(totalTime, route) {
        let used = 0;
        
        route.recurring.forEach(task => {
            used += task.totalTime;
        });
        
        route.daily.forEach(task => {
            used += task.duration;
        });
        
        route.weekly.forEach(task => {
            used += task.duration;
        });
        
        return totalTime - used;
    }

    selectAFKActivities(time, minAfkRating = 7) {
        return Object.values(this.routes.afkActivities)
            .filter(activity => activity.afkRating >= minAfkRating)
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 3);
    }

    selectActiveActivities(time, maxIntensity = 'high') {
        const intensityLevels = {
            'low': 1,
            'medium': 2,
            'high': 3,
            'extreme': 4
        };
        
        return Object.values(this.routes.activeActivities)
            .filter(activity => intensityLevels[activity.intensity] <= intensityLevels[maxIntensity])
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 3);
    }

    selectMixedActivities(time) {
        const afk = this.selectAFKActivities(time / 2);
        const active = this.selectActiveActivities(time / 2);
        return [...afk, ...active];
    }

    renderEngine() {
        const container = document.getElementById('efficiency-content');
        if (!container) return;
        
        let html = `
            <div class="efficiency-controls">
                <h3>Session Planner</h3>
                <div class="planner-inputs">
                    <div class="input-row">
                        <label>Play Time (minutes)</label>
                        <input type="number" id="playtime" value="120" min="30" max="1440">
                    </div>
                    
                    <div class="input-row">
                        <label>Activity Type</label>
                        <select id="activity-type">
                            <option value="mixed">Mixed (AFK + Active)</option>
                            <option value="afk">AFK Only</option>
                            <option value="active">Active Only</option>
                        </select>
                    </div>
                    
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="include-farm" checked>
                            Include Farm Runs
                        </label>
                        <label>
                            <input type="checkbox" id="include-dailies" checked>
                            Include Daily Tasks
                        </label>
                        <label>
                            <input type="checkbox" id="include-weeklies" checked>
                            Include Weekly Tasks
                        </label>
                    </div>
                    
                    <button class="generate-route-btn" onclick="window.efficiencyEngine.generateAndDisplay()">
                        Generate Optimal Route
                    </button>
                </div>
            </div>
            
            <div class="route-display" id="route-display"></div>
            
            <div class="activity-browser">
                <h3>Activity Browser</h3>
                <div class="activity-tabs">
                    <button class="activity-tab active" data-type="farm">Farm Runs</button>
                    <button class="activity-tab" data-type="daily">Daily Tasks</button>
                    <button class="activity-tab" data-type="weekly">Weekly Tasks</button>
                    <button class="activity-tab" data-type="afk">AFK Activities</button>
                    <button class="activity-tab" data-type="active">Active Content</button>
                </div>
                <div id="activity-list"></div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Set up tab switching
        document.querySelectorAll('.activity-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.activity-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.displayActivityList(tab.dataset.type);
            });
        });
        
        // Display initial list
        this.displayActivityList('farm');
    }

    generateAndDisplay() {
        const playtime = parseInt(document.getElementById('playtime').value);
        const preferences = {
            activityType: document.getElementById('activity-type').value,
            includeFarmRuns: document.getElementById('include-farm').checked,
            includeDailies: document.getElementById('include-dailies').checked,
            includeWeeklies: document.getElementById('include-weeklies').checked,
            afkLevel: 7,
            intensity: 'high'
        };
        
        const route = this.generateOptimalRoute(playtime, preferences);
        this.displayRoute(route);
    }

    displayRoute(route) {
        const container = document.getElementById('route-display');
        
        let totalProfit = 0;
        let totalTime = 0;
        
        let html = '<h3>Your Optimal Route</h3>';
        
        // Recurring tasks
        if (route.recurring.length > 0) {
            html += '<div class="route-section">';
            html += '<h4>Recurring Tasks</h4>';
            route.recurring.forEach(task => {
                html += `
                    <div class="route-item">
                        <span class="task-name">${task.name}</span>
                        <span class="task-cycles">${task.cycles} cycles</span>
                        <span class="task-time">${task.totalTime} min</span>
                        <span class="task-profit">${task.totalProfit.toLocaleString()} gp</span>
                    </div>
                `;
                totalProfit += task.totalProfit;
                totalTime += task.totalTime;
            });
            html += '</div>';
        }
        
        // Daily tasks
        if (route.daily.length > 0) {
            html += '<div class="route-section">';
            html += '<h4>Daily Tasks</h4>';
            route.daily.forEach(task => {
                html += `
                    <div class="route-item">
                        <span class="task-name">${task.name}</span>
                        <span class="task-time">${task.duration} min</span>
                        <span class="task-profit">${task.profit.toLocaleString()} gp</span>
                    </div>
                `;
                totalProfit += task.profit;
                totalTime += task.duration;
            });
            html += '</div>';
        }
        
        // Activities
        if (route.activities.length > 0) {
            html += '<div class="route-section">';
            html += '<h4>Recommended Activities</h4>';
            route.activities.forEach(activity => {
                html += `
                    <div class="route-item ${activity.type}">
                        <span class="task-name">${activity.name}</span>
                        <span class="task-type">${activity.type.toUpperCase()}</span>
                        <span class="task-intensity">${activity.intensity || 'N/A'}</span>
                        <span class="task-profit">${activity.profit.toLocaleString()} gp/hr</span>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Summary
        html += `
            <div class="route-summary">
                <h4>Session Summary</h4>
                <p>Total Time Used: ${totalTime} minutes</p>
                <p>Estimated Profit: ${totalProfit.toLocaleString()} gp</p>
                <p>GP/Hour: ${Math.round((totalProfit / totalTime) * 60).toLocaleString()}</p>
            </div>
        `;
        
        container.innerHTML = html;
    }

    displayActivityList(type) {
        const container = document.getElementById('activity-list');
        let activities = [];
        
        switch(type) {
            case 'farm':
                activities = Object.values(this.routes.farmRuns);
                break;
            case 'daily':
                activities = Object.values(this.routes.dailyTasks);
                break;
            case 'weekly':
                activities = Object.values(this.routes.weeklyTasks);
                break;
            case 'afk':
                activities = Object.values(this.routes.afkActivities);
                break;
            case 'active':
                activities = Object.values(this.routes.activeActivities);
                break;
        }
        
        let html = '<div class="activity-grid">';
        activities.forEach(activity => {
            html += `
                <div class="activity-card">
                    <h4>${activity.name}</h4>
                    ${activity.profit ? `<p class="profit">Profit: ${activity.profit.toLocaleString()} gp</p>` : ''}
                    ${activity.xpPerHour ? `<p class="xp">XP/hr: ${activity.xpPerHour.toLocaleString()}</p>` : ''}
                    ${activity.duration ? `<p class="duration">Duration: ${activity.duration} min</p>` : ''}
                    ${activity.frequency ? `<p class="frequency">Every ${activity.frequency} min</p>` : ''}
                    ${activity.afkRating ? `<p class="afk-rating">AFK Rating: ${activity.afkRating}/10</p>` : ''}
                    ${activity.intensity ? `<p class="intensity">Intensity: ${activity.intensity}</p>` : ''}
                    ${activity.requirements ? `<p class="reqs">Reqs: ${activity.requirements.join(', ')}</p>` : ''}
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    init() {
        this.renderEngine();
    }
}

// Initialize efficiency engine
window.efficiencyEngine = new EfficiencyEngine();