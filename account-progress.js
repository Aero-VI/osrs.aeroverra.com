// Account Progress Hub
class AccountProgress {
    constructor() {
        this.progressData = {
            '10tontos': {
                combatAchievements: {
                    easy: { completed: 33, total: 33 },
                    medium: { completed: 67, total: 85 },
                    hard: { completed: 89, total: 120 },
                    elite: { completed: 45, total: 90 },
                    master: { completed: 12, total: 60 },
                    grandmaster: { completed: 3, total: 40 }
                },
                achievementDiaries: {
                    'Ardougne': { easy: true, medium: true, hard: true, elite: true },
                    'Desert': { easy: true, medium: true, hard: true, elite: false },
                    'Falador': { easy: true, medium: true, hard: true, elite: true },
                    'Fremennik': { easy: true, medium: true, hard: true, elite: false },
                    'Kandarin': { easy: true, medium: true, hard: true, elite: true },
                    'Karamja': { easy: true, medium: true, hard: true, elite: false },
                    'Kourend & Kebos': { easy: true, medium: true, hard: true, elite: true },
                    'Lumbridge & Draynor': { easy: true, medium: true, hard: true, elite: true },
                    'Morytania': { easy: true, medium: true, hard: true, elite: true },
                    'Varrock': { easy: true, medium: true, hard: true, elite: true },
                    'Western Provinces': { easy: true, medium: true, hard: true, elite: true },
                    'Wilderness': { easy: true, medium: true, hard: false, elite: false }
                },
                musicTracks: {
                    unlocked: 612,
                    total: 655,
                    missing: [
                        { name: 'The Nightmare', location: 'The Nightmare boss' },
                        { name: 'Inferno', location: 'The Inferno' },
                        { name: 'Theatre of Blood', location: 'Theatre of Blood' },
                        { name: 'Beneath Cursed Sands', location: 'Tombs of Amascut' },
                        { name: 'Champion\'s Guild', location: 'Champions\' Challenge' }
                    ]
                },
                quests: {
                    completed: 286,
                    total: 293,
                    questPoints: 284,
                    totalQuestPoints: 293,
                    missing: [
                        { name: 'Desert Treasure II', difficulty: 'Grandmaster' },
                        { name: 'While Guthix Sleeps', difficulty: 'Grandmaster' },
                        { name: 'The Path of Glouphrie', difficulty: 'Master' },
                        { name: 'Secrets of the North', difficulty: 'Master' },
                        { name: 'A Kingdom Divided', difficulty: 'Experienced' },
                        { name: 'Temple of the Eye', difficulty: 'Experienced' },
                        { name: 'Sleeping Giants', difficulty: 'Experienced' }
                    ]
                },
                collections: {
                    pets: 15,
                    jars: 8,
                    champions: 2
                }
            },
            'Samuelb2800': {
                combatAchievements: {
                    easy: { completed: 33, total: 33 },
                    medium: { completed: 85, total: 85 },
                    hard: { completed: 95, total: 120 },
                    elite: { completed: 67, total: 90 },
                    master: { completed: 28, total: 60 },
                    grandmaster: { completed: 8, total: 40 }
                },
                achievementDiaries: {
                    'Ardougne': { easy: true, medium: true, hard: true, elite: false },
                    'Desert': { easy: true, medium: true, hard: false, elite: false },
                    'Falador': { easy: true, medium: true, hard: true, elite: false },
                    'Fremennik': { easy: true, medium: true, hard: true, elite: true },
                    'Kandarin': { easy: true, medium: true, hard: true, elite: false },
                    'Karamja': { easy: true, medium: true, hard: false, elite: false },
                    'Kourend & Kebos': { easy: true, medium: true, hard: true, elite: false },
                    'Lumbridge & Draynor': { easy: true, medium: true, hard: true, elite: true },
                    'Morytania': { easy: true, medium: true, hard: true, elite: true },
                    'Varrock': { easy: true, medium: true, hard: true, elite: true },
                    'Western Provinces': { easy: true, medium: true, hard: true, elite: false },
                    'Wilderness': { easy: true, medium: false, hard: false, elite: false }
                },
                musicTracks: {
                    unlocked: 578,
                    total: 655,
                    missing: [] // Too many to list
                },
                quests: {
                    completed: 268,
                    total: 293,
                    questPoints: 262,
                    totalQuestPoints: 293,
                    missing: [] // Too many to list
                },
                collections: {
                    pets: 12,
                    jars: 5,
                    champions: 0
                }
            }
        };
    }

    calculateCompletionPercentage(data) {
        const totalItems = data.easy.total + data.medium.total + data.hard.total + 
                          data.elite.total + data.master.total + data.grandmaster.total;
        const completedItems = data.easy.completed + data.medium.completed + data.hard.completed + 
                              data.elite.completed + data.master.completed + data.grandmaster.completed;
        return Math.round((completedItems / totalItems) * 100);
    }

    calculateDiaryCompletion(diaries) {
        let total = 0;
        let completed = 0;
        
        Object.values(diaries).forEach(region => {
            total += 4; // 4 tiers per region
            if (region.easy) completed++;
            if (region.medium) completed++;
            if (region.hard) completed++;
            if (region.elite) completed++;
        });
        
        return { completed, total, percentage: Math.round((completed / total) * 100) };
    }

    renderProgressHub() {
        const container = document.getElementById('progress-hub-content');
        if (!container) return;
        
        let html = `
            <div class="progress-hub">
                <div class="player-selector">
                    <button class="player-btn active" onclick="window.accountProgress.switchPlayer('10tontos')">10tontos</button>
                    <button class="player-btn" onclick="window.accountProgress.switchPlayer('Samuelb2800')">Samuelb2800</button>
                </div>
                
                <div id="player-progress" data-player="10tontos">
                    ${this.renderPlayerProgress('10tontos')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    renderPlayerProgress(playerName) {
        const data = this.progressData[playerName];
        const caPercentage = this.calculateCompletionPercentage(data.combatAchievements);
        const diaryStats = this.calculateDiaryCompletion(data.achievementDiaries);
        
        return `
            <div class="progress-sections">
                <!-- Combat Achievements -->
                <div class="progress-section">
                    <h3>Combat Achievements</h3>
                    <div class="overall-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${caPercentage}%"></div>
                        </div>
                        <p class="progress-text">${caPercentage}% Complete</p>
                    </div>
                    
                    <div class="tier-breakdown">
                        ${Object.entries(data.combatAchievements).map(([tier, info]) => `
                            <div class="tier-item">
                                <span class="tier-name">${tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                                <div class="tier-progress">
                                    <div class="tier-bar">
                                        <div class="tier-fill ${tier}" style="width: ${(info.completed / info.total) * 100}%"></div>
                                    </div>
                                    <span class="tier-numbers">${info.completed}/${info.total}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Achievement Diaries -->
                <div class="progress-section">
                    <h3>Achievement Diaries</h3>
                    <div class="overall-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${diaryStats.percentage}%"></div>
                        </div>
                        <p class="progress-text">${diaryStats.completed}/${diaryStats.total} Tasks (${diaryStats.percentage}%)</p>
                    </div>
                    
                    <div class="diary-grid">
                        ${Object.entries(data.achievementDiaries).map(([region, tiers]) => `
                            <div class="diary-region">
                                <h4>${region}</h4>
                                <div class="diary-tiers">
                                    <span class="diary-tier ${tiers.easy ? 'complete' : ''}" title="Easy">E</span>
                                    <span class="diary-tier ${tiers.medium ? 'complete' : ''}" title="Medium">M</span>
                                    <span class="diary-tier ${tiers.hard ? 'complete' : ''}" title="Hard">H</span>
                                    <span class="diary-tier ${tiers.elite ? 'complete' : ''}" title="Elite">L</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Music Cape Progress -->
                <div class="progress-section">
                    <h3>Music Cape Progress</h3>
                    <div class="overall-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(data.musicTracks.unlocked / data.musicTracks.total) * 100}%"></div>
                        </div>
                        <p class="progress-text">${data.musicTracks.unlocked}/${data.musicTracks.total} Tracks Unlocked</p>
                    </div>
                    
                    ${data.musicTracks.missing.length > 0 ? `
                        <div class="missing-items">
                            <h4>Missing Tracks (${data.musicTracks.missing.length})</h4>
                            <div class="missing-grid">
                                ${data.musicTracks.missing.slice(0, 10).map(track => `
                                    <div class="missing-item">
                                        <span class="item-name">${track.name}</span>
                                        <span class="item-location">${track.location}</span>
                                    </div>
                                `).join('')}
                                ${data.musicTracks.missing.length > 10 ? 
                                    `<p class="more-items">...and ${data.musicTracks.missing.length - 10} more</p>` : ''
                                }
                            </div>
                        </div>
                    ` : '<p class="complete-message">🎵 Music Cape Achieved! 🎵</p>'}
                </div>
                
                <!-- Quest Cape Progress -->
                <div class="progress-section">
                    <h3>Quest Cape Progress</h3>
                    <div class="overall-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(data.quests.completed / data.quests.total) * 100}%"></div>
                        </div>
                        <p class="progress-text">${data.quests.completed}/${data.quests.total} Quests (${data.quests.questPoints}/${data.quests.totalQuestPoints} QP)</p>
                    </div>
                    
                    ${data.quests.missing.length > 0 ? `
                        <div class="missing-items">
                            <h4>Missing Quests (${data.quests.missing.length})</h4>
                            <div class="quest-grid">
                                ${data.quests.missing.map(quest => `
                                    <div class="quest-item ${quest.difficulty.toLowerCase()}">
                                        <span class="quest-name">${quest.name}</span>
                                        <span class="quest-difficulty">${quest.difficulty}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : '<p class="complete-message">⚔️ Quest Cape Achieved! ⚔️</p>'}
                </div>
                
                <!-- Collections -->
                <div class="progress-section collections">
                    <h3>Collections</h3>
                    <div class="collection-stats">
                        <div class="collection-item">
                            <span class="collection-icon">🐾</span>
                            <span class="collection-name">Pets</span>
                            <span class="collection-count">${data.collections.pets}</span>
                        </div>
                        <div class="collection-item">
                            <span class="collection-icon">🏺</span>
                            <span class="collection-name">Jars</span>
                            <span class="collection-count">${data.collections.jars}</span>
                        </div>
                        <div class="collection-item">
                            <span class="collection-icon">🏆</span>
                            <span class="collection-name">Champion Scrolls</span>
                            <span class="collection-count">${data.collections.champions}/10</span>
                        </div>
                    </div>
                </div>
                
                <!-- Cape Checklist -->
                <div class="progress-section">
                    <h3>Max Cape Checklist</h3>
                    <div class="cape-checklist">
                        <div class="cape-item ${data.quests.completed === data.quests.total ? 'obtained' : ''}">
                            <span class="cape-name">Quest Cape</span>
                            <span class="cape-status">${data.quests.completed === data.quests.total ? '✓' : 
                                `${data.quests.total - data.quests.completed} quests left`}</span>
                        </div>
                        <div class="cape-item ${data.musicTracks.unlocked === data.musicTracks.total ? 'obtained' : ''}">
                            <span class="cape-name">Music Cape</span>
                            <span class="cape-status">${data.musicTracks.unlocked === data.musicTracks.total ? '✓' : 
                                `${data.musicTracks.total - data.musicTracks.unlocked} tracks left`}</span>
                        </div>
                        <div class="cape-item ${diaryStats.percentage === 100 ? 'obtained' : ''}">
                            <span class="cape-name">Achievement Diary Cape</span>
                            <span class="cape-status">${diaryStats.percentage === 100 ? '✓' : 
                                `${diaryStats.total - diaryStats.completed} tasks left`}</span>
                        </div>
                        <div class="cape-item">
                            <span class="cape-name">Max Cape</span>
                            <span class="cape-status">23/23 Skills at 99</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    switchPlayer(playerName) {
        // Update button states
        document.querySelectorAll('.player-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update content
        const container = document.getElementById('player-progress');
        container.dataset.player = playerName;
        container.innerHTML = this.renderPlayerProgress(playerName);
    }

    init() {
        this.renderProgressHub();
    }
}

// Initialize account progress
window.accountProgress = new AccountProgress();