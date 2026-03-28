// Collection Log Tracker + Completion Optimizer
class CollectionLogTracker {
    constructor() {
        this.collectionData = null;
        this.loadCollectionData();
    }

    loadCollectionData() {
        // OSRS Collection Log data with drop rates
        this.collectionData = {
            'Bosses': {
                'General Graardor': {
                    items: [
                        { name: 'Bandos Chestplate', dropRate: 1/381, obtained: false },
                        { name: 'Bandos Tassets', dropRate: 1/381, obtained: false },
                        { name: 'Bandos Boots', dropRate: 1/381, obtained: false },
                        { name: 'Bandos Hilt', dropRate: 1/508, obtained: false },
                        { name: 'Godsword Shard 1', dropRate: 1/762, obtained: false },
                        { name: 'Godsword Shard 2', dropRate: 1/762, obtained: false },
                        { name: 'Godsword Shard 3', dropRate: 1/762, obtained: false }
                    ],
                    killCount: 0
                },
                'Commander Zilyana': {
                    items: [
                        { name: 'Armadyl Crossbow', dropRate: 1/508, obtained: false },
                        { name: 'Saradomin Hilt', dropRate: 1/508, obtained: false },
                        { name: "Saradomin's Light", dropRate: 1/254, obtained: false },
                        { name: 'Saradomin Sword', dropRate: 1/127, obtained: false },
                        { name: 'Godsword Shard 1', dropRate: 1/762, obtained: false },
                        { name: 'Godsword Shard 2', dropRate: 1/762, obtained: false },
                        { name: 'Godsword Shard 3', dropRate: 1/762, obtained: false }
                    ],
                    killCount: 0
                },
                'Corporeal Beast': {
                    items: [
                        { name: 'Elysian Sigil', dropRate: 1/4095, obtained: false },
                        { name: 'Arcane Sigil', dropRate: 1/1365, obtained: false },
                        { name: 'Spectral Sigil', dropRate: 1/1365, obtained: false },
                        { name: 'Spirit Shield', dropRate: 1/64, obtained: true },
                        { name: 'Holy Elixir', dropRate: 1/171, obtained: true }
                    ],
                    killCount: 500
                },
                'Vorkath': {
                    items: [
                        { name: 'Skeletal Visage', dropRate: 1/5000, obtained: false },
                        { name: 'Dragonbone Necklace', dropRate: 1/1000, obtained: true },
                        { name: "Vorkath's Head", dropRate: 1/50, obtained: true }
                    ],
                    killCount: 1337
                },
                'Chambers of Xeric': {
                    items: [
                        { name: 'Twisted Bow', dropRate: 1/1042, obtained: false },
                        { name: 'Elder Maul', dropRate: 1/313, obtained: false },
                        { name: 'Kodai Insignia', dropRate: 1/313, obtained: false },
                        { name: 'Dragon Claws', dropRate: 1/208, obtained: true },
                        { name: 'Ancestral Hat', dropRate: 1/313, obtained: false },
                        { name: 'Ancestral Robe Top', dropRate: 1/313, obtained: false },
                        { name: 'Ancestral Robe Bottom', dropRate: 1/313, obtained: false },
                        { name: 'Dexterous Prayer Scroll', dropRate: 1/156, obtained: true },
                        { name: 'Arcane Prayer Scroll', dropRate: 1/156, obtained: true },
                        { name: 'Twisted Buckler', dropRate: 1/208, obtained: false },
                        { name: 'Dragon Hunter Crossbow', dropRate: 1/208, obtained: true }
                    ],
                    killCount: 250
                },
                'Theatre of Blood': {
                    items: [
                        { name: 'Scythe of Vitur', dropRate: 1/173, obtained: false },
                        { name: 'Ghrazi Rapier', dropRate: 1/86, obtained: true },
                        { name: 'Sanguinesti Staff', dropRate: 1/86, obtained: false },
                        { name: 'Justiciar Faceguard', dropRate: 1/86, obtained: false },
                        { name: 'Justiciar Chestguard', dropRate: 1/86, obtained: true },
                        { name: 'Justiciar Legguards', dropRate: 1/86, obtained: false },
                        { name: 'Avernic Defender Hilt', dropRate: 1/115, obtained: true }
                    ],
                    killCount: 150
                }
            },
            'Slayer': {
                'Cerberus': {
                    items: [
                        { name: 'Primordial Crystal', dropRate: 1/512, obtained: true },
                        { name: 'Pegasian Crystal', dropRate: 1/512, obtained: false },
                        { name: 'Eternal Crystal', dropRate: 1/512, obtained: false },
                        { name: 'Smouldering Stone', dropRate: 1/512, obtained: true },
                        { name: 'Jar of Souls', dropRate: 1/2000, obtained: false }
                    ],
                    killCount: 800
                },
                'Abyssal Sire': {
                    items: [
                        { name: 'Abyssal Dagger', dropRate: 1/492, obtained: false },
                        { name: 'Abyssal Bludgeon Piece 1', dropRate: 1/164, obtained: true },
                        { name: 'Abyssal Bludgeon Piece 2', dropRate: 1/164, obtained: true },
                        { name: 'Abyssal Bludgeon Piece 3', dropRate: 1/164, obtained: false },
                        { name: 'Abyssal Orphan', dropRate: 1/2560, obtained: false }
                    ],
                    killCount: 600
                }
            },
            'Clue Scrolls': {
                'Master': {
                    items: [
                        { name: 'Bloodhound', dropRate: 1/1000, obtained: false },
                        { name: '3rd Age Pickaxe', dropRate: 1/313168, obtained: false },
                        { name: '3rd Age Axe', dropRate: 1/313168, obtained: false },
                        { name: '3rd Age Druidic Top', dropRate: 1/313168, obtained: false }
                    ],
                    killCount: 150
                },
                'Elite': {
                    items: [
                        { name: '3rd Age Range Top', dropRate: 1/52644, obtained: false },
                        { name: 'Gilded Scimitar', dropRate: 1/14663, obtained: false },
                        { name: 'Ring of 3rd Age', dropRate: 1/52644, obtained: false }
                    ],
                    killCount: 300
                }
            }
        };
    }

    calculateDropProbability(dropRate, kills) {
        // Calculate probability of getting at least one drop
        // P(at least one) = 1 - P(none) = 1 - (1 - dropRate)^kills
        return 1 - Math.pow(1 - dropRate, kills);
    }

    calculateDryStreak(dropRate, kills) {
        // Calculate how "dry" someone is
        const expectedDrops = kills * dropRate;
        const probability = this.calculateDropProbability(dropRate, kills);
        
        return {
            expectedDrops,
            probability,
            percentile: (1 - probability) * 100, // How unlucky (top X% dry)
            isVeryDry: probability > 0.95, // 95% should have gotten it by now
            isSuperDry: probability > 0.99 // 99% should have gotten it by now
        };
    }

    calculateBadLuckProtection(item, kills) {
        // Simulate bad luck protection thresholds
        const dropRate = item.dropRate;
        const expectedKills = 1 / dropRate;
        
        if (kills > expectedKills * 2) {
            return {
                active: true,
                message: "You're 2x the drop rate - bad luck protection likely active",
                boostedRate: dropRate * 1.5 // Hypothetical boost
            };
        } else if (kills > expectedKills * 3) {
            return {
                active: true,
                message: "You're 3x the drop rate - significant bad luck protection",
                boostedRate: dropRate * 2 // Hypothetical boost
            };
        }
        
        return {
            active: false,
            message: "Bad luck protection not yet active",
            boostedRate: dropRate
        };
    }

    getCompletionRecommendations() {
        const recommendations = [];
        
        Object.entries(this.collectionData).forEach(([category, bosses]) => {
            Object.entries(bosses).forEach(([bossName, bossData]) => {
                const missingItems = bossData.items.filter(item => !item.obtained);
                
                if (missingItems.length > 0) {
                    // Calculate efficiency score
                    const avgDropRate = missingItems.reduce((sum, item) => sum + item.dropRate, 0) / missingItems.length;
                    const estimatedKills = Math.ceil(1 / avgDropRate);
                    
                    recommendations.push({
                        category,
                        boss: bossName,
                        missingItems: missingItems.length,
                        currentKc: bossData.killCount,
                        estimatedKillsNeeded: estimatedKills,
                        efficiency: 1 / estimatedKills, // Higher = more efficient
                        items: missingItems
                    });
                }
            });
        });
        
        // Sort by efficiency (most efficient first)
        return recommendations.sort((a, b) => b.efficiency - a.efficiency);
    }

    renderTracker() {
        const container = document.getElementById('collection-log-content');
        if (!container) return;
        
        let html = '<div class="collection-categories">';
        
        // Render each category
        Object.entries(this.collectionData).forEach(([category, bosses]) => {
            html += `
                <div class="collection-category">
                    <h3>${category}</h3>
                    <div class="boss-grid">
            `;
            
            Object.entries(bosses).forEach(([bossName, bossData]) => {
                const obtained = bossData.items.filter(item => item.obtained).length;
                const total = bossData.items.length;
                const percentage = (obtained / total) * 100;
                
                html += `
                    <div class="boss-card" onclick="window.collectionLog.showBossDetails('${category}', '${bossName}')">
                        <h4>${bossName}</h4>
                        <div class="completion-bar">
                            <div class="completion-fill" style="width: ${percentage}%"></div>
                        </div>
                        <p class="completion-text">${obtained}/${total} (${Math.round(percentage)}%)</p>
                        <p class="kc-text">KC: ${bossData.killCount}</p>
                    </div>
                `;
            });
            
            html += '</div></div>';
        });
        
        html += '</div>';
        
        // Add recommendations section
        html += '<div class="recommendations-section">';
        html += '<h3>Completion Optimizer</h3>';
        
        const recommendations = this.getCompletionRecommendations();
        html += '<div class="recommendations-grid">';
        
        recommendations.slice(0, 6).forEach(rec => {
            html += `
                <div class="recommendation-card">
                    <h4>${rec.boss}</h4>
                    <p class="rec-category">${rec.category}</p>
                    <p class="missing-count">${rec.missingItems} items missing</p>
                    <p class="efficiency-score">Efficiency: ${(rec.efficiency * 1000).toFixed(1)}</p>
                    <p class="estimated-kc">~${rec.estimatedKillsNeeded} kills needed</p>
                </div>
            `;
        });
        
        html += '</div></div>';
        
        container.innerHTML = html;
    }

    showBossDetails(category, bossName) {
        const bossData = this.collectionData[category][bossName];
        const modal = document.createElement('div');
        modal.className = 'collection-modal';
        
        let html = `
            <div class="modal-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>${bossName}</h2>
                <p class="modal-kc">Kill Count: ${bossData.killCount}</p>
                <div class="items-grid">
        `;
        
        bossData.items.forEach(item => {
            const dryStreak = this.calculateDryStreak(item.dropRate, bossData.killCount);
            const badLuck = this.calculateBadLuckProtection(item, bossData.killCount);
            
            html += `
                <div class="item-card ${item.obtained ? 'obtained' : 'missing'}">
                    <h4>${item.name}</h4>
                    <p class="drop-rate">Drop rate: 1/${Math.round(1/item.dropRate)}</p>
                    ${!item.obtained ? `
                        <p class="expected">Expected: ${dryStreak.expectedDrops.toFixed(2)}</p>
                        <p class="probability">Chance by now: ${(dryStreak.probability * 100).toFixed(1)}%</p>
                        ${dryStreak.isVeryDry ? '<p class="dry-warning">⚠️ Very dry!</p>' : ''}
                        ${dryStreak.isSuperDry ? '<p class="dry-warning">🔥 Super dry!</p>' : ''}
                        ${badLuck.active ? `<p class="bad-luck">${badLuck.message}</p>` : ''}
                    ` : '<p class="obtained-text">✓ Obtained</p>'}
                </div>
            `;
        });
        
        html += `
                </div>
                <button class="update-kc-btn" onclick="window.collectionLog.updateKillCount('${category}', '${bossName}')">
                    Update Kill Count
                </button>
            </div>
        `;
        
        modal.innerHTML = html;
        document.body.appendChild(modal);
    }

    updateKillCount(category, bossName) {
        const newKc = prompt(`Enter new kill count for ${bossName}:`);
        if (newKc && !isNaN(newKc)) {
            this.collectionData[category][bossName].killCount = parseInt(newKc);
            this.renderTracker();
            document.querySelector('.collection-modal').remove();
            this.showBossDetails(category, bossName);
        }
    }

    init() {
        this.renderTracker();
    }
}

// Initialize collection log
window.collectionLog = new CollectionLogTracker();