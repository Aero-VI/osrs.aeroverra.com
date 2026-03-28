// Clue Scroll Helper Suite
class ClueHelper {
    constructor() {
        this.stashUnits = {
            beginner: {
                total: 15,
                built: 12,
                units: [
                    { location: 'Lumbridge Swamp shed', items: ['Bronze dagger', 'Iron full helm', 'Gold ring'], built: true },
                    { location: 'Draynor Village market', items: ['Studded chaps', 'Iron kiteshield', 'Steel longsword'], built: true },
                    { location: 'Varrock Palace library', items: ['Green d\'hide chaps', 'Ruby ring', 'White apron'], built: false },
                    { location: 'Al Kharid Palace', items: ['Iron platelegs', 'Leather gloves', 'Leather boots'], built: true }
                ]
            },
            easy: {
                total: 29,
                built: 24,
                units: [
                    { location: 'Road junction north of Rimmington', items: ['Iron med helm', 'Emerald ring', 'White apron'], built: true },
                    { location: 'Wheat field near Draynor Village', items: ['Studded leather body', 'Bronze full helm', 'Staff'], built: true },
                    { location: 'Outside Al Kharid mine', items: ['Desert shirt', 'Leather gloves', 'Leather boots'], built: true },
                    { location: 'Fishing Guild bank', items: ['Emerald ring', 'Sapphire amulet', 'Bronze chainbody'], built: false }
                ]
            },
            medium: {
                total: 81,
                built: 65,
                units: [
                    { location: 'Centre of Canifis', items: ['Green d\'hide body', 'Iron 2h sword', 'Silver sickle'], built: true },
                    { location: 'Ardougne Zoo', items: ['Bronze platebody', 'Blue skirt', 'Iron crossbow'], built: true },
                    { location: 'Observatory', items: ['White apron', 'Green gnome boots', 'Ruby necklace'], built: false },
                    { location: 'Digsite', items: ['Green d\'hide chaps', 'Steel kiteshield', 'Ring of forging'], built: true }
                ]
            },
            hard: {
                total: 84,
                built: 72,
                units: [
                    { location: 'Wilderness Volcano', items: ['Blue d\'hide body', 'Blue d\'hide vambs', 'Amulet of power'], built: true },
                    { location: 'Fountain of Rune', items: ['Blue d\'hide body', 'Blue d\'hide chaps', 'Rune 2h'], built: true },
                    { location: 'Shilo Village bank', items: ['Mystic robe bottom', 'Bone spear', 'Rune platebody'], built: false },
                    { location: 'Castle Wars bank', items: ['Ruby amulet', 'Mithril scimitar', 'White apron'], built: true }
                ]
            },
            elite: {
                total: 77,
                built: 45,
                units: [
                    { location: 'Lava Dragon Isle', items: ['Black d\'hide body', 'Black d\'hide chaps', 'Lava battlestaff'], built: true },
                    { location: 'Barrows chest', items: ['Any Barrows item'], built: false },
                    { location: 'Warriors\' Guild bank', items: ['Dragon battleaxe', 'Dragon defender', 'Slayer helmet'], built: true },
                    { location: 'Port Phasmatys', items: ['Runite limbs', 'Rune plateskirt', 'Amulet of glory'], built: false }
                ]
            },
            master: {
                total: 55,
                built: 28,
                units: [
                    { location: 'Myths\' Guild', items: ['Dragon platebody', 'Rune kiteshield', 'Amulet of glory'], built: true },
                    { location: 'Mount Karuulm', items: ['Dragon hunter crossbow', 'Mythical cape', 'Amulet of fury'], built: false },
                    { location: 'Elf Camp', items: ['Crystal bow'], built: true },
                    { location: 'Soul Altar', items: ['Dragon pickaxe', 'Helm of neitiznot', 'Rune boots'], built: false }
                ]
            }
        };

        this.coordinates = [
            { coords: '00 degrees 00 minutes north 07 degrees 13 minutes west', location: 'Observatory', description: 'West of Castle Wars, north of Yanille' },
            { coords: '00 degrees 31 minutes south 17 degrees 43 minutes east', location: 'Cairn Isle', description: 'West of Shilo Village, Lady of the Waves' },
            { coords: '01 degrees 26 minutes north 08 degrees 01 minutes east', location: 'Champions Guild', description: 'Southwest of Varrock' },
            { coords: '03 degrees 45 minutes south 22 degrees 45 minutes east', location: 'Mos Le\'Harmless', description: 'East side of the island' },
            { coords: '04 degrees 00 minutes south 12 degrees 46 minutes east', location: 'South of Yanille', description: 'Southwest of Yanille' },
            { coords: '05 degrees 43 minutes north 23 degrees 05 minutes east', location: 'Mort Myre Swamp', description: 'South of Mort\'ton' },
            { coords: '16 degrees 43 minutes north 19 degrees 13 minutes east', location: 'Wilderness', description: 'Level 38 Wilderness, east of Lava Dragon Isle' },
            { coords: '24 degrees 56 minutes north 22 degrees 28 minutes east', location: 'Wilderness', description: 'Level 56 Wilderness, Rogues\' Castle' }
        ];

        this.emotePresets = {
            'Dance at the crossroads north of Draynor': {
                items: ['Iron platebody', 'Studded leather chaps', 'Bronze full helm'],
                emote: 'Dance'
            },
            'Bow in the Legends Guild': {
                items: ['Iron platelegs', 'Emerald amulet', 'Oak longbow'],
                emote: 'Bow'
            },
            'Spin at the Barbarian Village': {
                items: ['Blue d\'hide body', 'Iron warhammer', 'Steel boots'],
                emote: 'Spin'
            },
            'Jump for joy in Yanille bank': {
                items: ['Brown apron', 'Adamantite necklace', 'Iron dagger'],
                emote: 'Jump for joy'
            },
            'Yawn in the Castle Wars lobby': {
                items: ['Ruby amulet', 'Mithril scimitar', 'White apron'],
                emote: 'Yawn'
            }
        };

        this.currentPreset = null;
    }

    calculateStashProgress() {
        let totalBuilt = 0;
        let totalUnits = 0;
        
        Object.values(this.stashUnits).forEach(tier => {
            totalBuilt += tier.built;
            totalUnits += tier.total;
        });
        
        return {
            built: totalBuilt,
            total: totalUnits,
            percentage: Math.round((totalBuilt / totalUnits) * 100)
        };
    }

    renderStashTracker() {
        const progress = this.calculateStashProgress();
        
        let html = `
            <div class="stash-tracker">
                <h3>STASH Unit Tracker</h3>
                <div class="overall-stash-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <p class="progress-text">${progress.built}/${progress.total} Units Built (${progress.percentage}%)</p>
                </div>
                
                <div class="stash-tiers">
                    ${Object.entries(this.stashUnits).map(([tier, data]) => `
                        <div class="stash-tier-section">
                            <h4 class="tier-title">${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier</h4>
                            <p class="tier-progress">${data.built}/${data.total} Built</p>
                            
                            <div class="stash-unit-list">
                                ${data.units.map(unit => `
                                    <div class="stash-unit ${unit.built ? 'built' : 'unbuilt'}">
                                        <div class="unit-header">
                                            <span class="unit-location">${unit.location}</span>
                                            <button class="toggle-built-btn" onclick="window.clueHelper.toggleStashBuilt('${tier}', '${unit.location}')">
                                                ${unit.built ? '✓' : '○'}
                                            </button>
                                        </div>
                                        <div class="unit-items">
                                            ${unit.items.map(item => `<span class="item">${item}</span>`).join(' • ')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return html;
    }

    renderCoordinateSolver() {
        let html = `
            <div class="coordinate-solver">
                <h3>Coordinate Clue Solver</h3>
                <div class="coord-search">
                    <input type="text" id="coord-input" placeholder="Enter coordinates (e.g., 00 00 N 07 13 W)">
                    <button onclick="window.clueHelper.searchCoordinate()">Search</button>
                </div>
                
                <div id="coord-result"></div>
                
                <div class="coord-list">
                    <h4>Common Coordinates</h4>
                    <div class="coord-grid">
                        ${this.coordinates.map(coord => `
                            <div class="coord-item" onclick="window.clueHelper.showCoordinate('${coord.coords}')">
                                <p class="coord-text">${coord.coords}</p>
                                <p class="coord-location">${coord.location}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }

    renderEmotePresets() {
        let html = `
            <div class="emote-presets">
                <h3>Emote Clue Gear Presets</h3>
                
                ${this.currentPreset ? `
                    <div class="active-preset">
                        <h4>Current Setup: ${this.currentPreset.clue}</h4>
                        <div class="preset-gear">
                            ${this.currentPreset.items.map(item => 
                                `<div class="gear-item">${item}</div>`
                            ).join('')}
                        </div>
                        <p class="emote-instruction">Emote: <strong>${this.currentPreset.emote}</strong></p>
                    </div>
                ` : ''}
                
                <div class="preset-list">
                    <h4>Quick Presets</h4>
                    ${Object.entries(this.emotePresets).map(([clue, preset]) => `
                        <div class="preset-item" onclick="window.clueHelper.loadPreset('${clue}')">
                            <p class="preset-clue">${clue}</p>
                            <p class="preset-emote">${preset.emote}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="custom-preset">
                    <h4>Create Custom Preset</h4>
                    <input type="text" id="custom-clue" placeholder="Clue description">
                    <input type="text" id="custom-items" placeholder="Items (comma separated)">
                    <input type="text" id="custom-emote" placeholder="Emote">
                    <button onclick="window.clueHelper.addCustomPreset()">Add Preset</button>
                </div>
            </div>
        `;
        
        return html;
    }

    toggleStashBuilt(tier, location) {
        const unit = this.stashUnits[tier].units.find(u => u.location === location);
        if (unit) {
            unit.built = !unit.built;
            this.stashUnits[tier].built = this.stashUnits[tier].units.filter(u => u.built).length;
            this.saveData();
            this.renderHelper();
        }
    }

    searchCoordinate() {
        const input = document.getElementById('coord-input').value.toLowerCase();
        const result = this.coordinates.find(coord => 
            coord.coords.toLowerCase().includes(input) ||
            coord.location.toLowerCase().includes(input)
        );
        
        const resultDiv = document.getElementById('coord-result');
        if (result) {
            resultDiv.innerHTML = `
                <div class="coord-result-card">
                    <h4>${result.coords}</h4>
                    <p class="result-location">${result.location}</p>
                    <p class="result-description">${result.description}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = '<p class="no-result">No matching coordinates found</p>';
        }
    }

    showCoordinate(coords) {
        document.getElementById('coord-input').value = coords;
        this.searchCoordinate();
    }

    loadPreset(clue) {
        this.currentPreset = {
            clue: clue,
            ...this.emotePresets[clue]
        };
        this.renderHelper();
    }

    addCustomPreset() {
        const clue = document.getElementById('custom-clue').value;
        const items = document.getElementById('custom-items').value.split(',').map(i => i.trim());
        const emote = document.getElementById('custom-emote').value;
        
        if (clue && items.length > 0 && emote) {
            this.emotePresets[clue] = { items, emote };
            this.saveData();
            this.renderHelper();
            
            // Clear inputs
            document.getElementById('custom-clue').value = '';
            document.getElementById('custom-items').value = '';
            document.getElementById('custom-emote').value = '';
        }
    }

    saveData() {
        localStorage.setItem('clueHelperData', JSON.stringify({
            stashUnits: this.stashUnits,
            emotePresets: this.emotePresets
        }));
    }

    loadData() {
        const saved = localStorage.getItem('clueHelperData');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.stashUnits) this.stashUnits = data.stashUnits;
            if (data.emotePresets) this.emotePresets = { ...this.emotePresets, ...data.emotePresets };
        }
    }

    renderHelper() {
        const container = document.getElementById('clue-helper-content');
        if (!container) return;
        
        let html = `
            <div class="clue-helper-grid">
                <div class="helper-section">
                    ${this.renderStashTracker()}
                </div>
                
                <div class="helper-section">
                    ${this.renderCoordinateSolver()}
                </div>
                
                <div class="helper-section">
                    ${this.renderEmotePresets()}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    init() {
        this.loadData();
        this.renderHelper();
    }
}

// Initialize clue helper
window.clueHelper = new ClueHelper();