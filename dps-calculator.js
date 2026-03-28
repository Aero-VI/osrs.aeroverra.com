// Advanced DPS Calculator with Gear Loadout Comparison
class DPSCalculator {
    constructor() {
        this.loadouts = [];
        this.combatStyles = {
            'melee': {
                'slash': { accuracy: 1.0, strength: 1.0 },
                'stab': { accuracy: 1.0, strength: 1.0 },
                'crush': { accuracy: 1.0, strength: 1.0 },
                'aggressive': { accuracy: 0.9, strength: 1.3 },
                'accurate': { accuracy: 1.3, strength: 0.9 },
                'controlled': { accuracy: 1.1, strength: 1.1 },
                'defensive': { accuracy: 1.0, strength: 0.8 }
            },
            'ranged': {
                'accurate': { accuracy: 1.3, strength: 0.9 },
                'rapid': { accuracy: 1.0, strength: 1.0, speed: 0.9 },
                'longrange': { accuracy: 1.1, strength: 0.9 }
            },
            'magic': {
                'accurate': { accuracy: 1.3, damage: 1.0 },
                'longrange': { accuracy: 1.1, damage: 0.95 }
            }
        };
        
        this.weaponDatabase = {
            // Melee weapons
            'Scythe of Vitur': { attack: 70, strength: 125, speed: 5, type: 'melee', style: 'slash' },
            'Ghrazi Rapier': { attack: 94, strength: 89, speed: 4, type: 'melee', style: 'stab' },
            'Blade of Saeldor': { attack: 94, strength: 89, speed: 4, type: 'melee', style: 'slash' },
            'Inquisitor\'s Mace': { attack: 89, strength: 89, speed: 4, type: 'melee', style: 'crush' },
            'Dragon Claws': { attack: 41, strength: 56, speed: 4, type: 'melee', style: 'slash', spec: true },
            'Armadyl Godsword': { attack: 132, strength: 132, speed: 6, type: 'melee', style: 'slash', spec: true },
            'Dragon Warhammer': { attack: 95, strength: 85, speed: 6, type: 'melee', style: 'crush', spec: true },
            
            // Ranged weapons
            'Twisted Bow': { ranged: 20, rangedStr: 20, speed: 5, type: 'ranged' },
            'Zaryte Crossbow': { ranged: 110, rangedStr: 0, speed: 5, type: 'ranged' },
            'Dragon Hunter Crossbow': { ranged: 95, rangedStr: 0, speed: 5, type: 'ranged' },
            'Toxic Blowpipe': { ranged: 30, rangedStr: 20, speed: 3, type: 'ranged' },
            'Armadyl Crossbow': { ranged: 100, rangedStr: 0, speed: 5, type: 'ranged' },
            
            // Magic weapons
            'Tumeken\'s Shadow': { magic: 35, magicDamage: 15, speed: 5, type: 'magic' },
            'Sanguinesti Staff': { magic: 25, magicDamage: 12, speed: 4, type: 'magic' },
            'Kodai Wand': { magic: 28, magicDamage: 15, speed: 4, type: 'magic' },
            'Nightmare Staff': { magic: 16, magicDamage: 15, speed: 5, type: 'magic' }
        };
        
        this.monsterDatabase = {
            'General Graardor': { defence: 250, magic: 80, ranged: 350, crush: 0, hp: 255 },
            'Corporeal Beast': { defence: 310, magic: 150, ranged: 200, stab: -10, hp: 2000 },
            'Vorkath': { defence: 214, magic: 150, ranged: 308, stab: 20, hp: 750 },
            'Verzik Vitur (P3)': { defence: 200, magic: 70, ranged: 100, crush: 30, hp: 1250 },
            'Chambers Guardian': { defence: 150, magic: 50, ranged: 50, crush: 0, hp: 600 },
            'The Nightmare': { defence: 240, magic: 600, ranged: 240, crush: -20, hp: 2400 }
        };
    }

    calculateMaxHit(loadout, combatStyle = 'controlled') {
        if (loadout.weapon.type === 'melee') {
            const effectiveStrength = Math.floor(loadout.strengthLevel * loadout.prayerBonus) + loadout.strengthBonus + 8;
            const maxHit = Math.floor((effectiveStrength * (loadout.weapon.strength + 64)) / 640);
            return maxHit;
        } else if (loadout.weapon.type === 'ranged') {
            const effectiveRanged = Math.floor(loadout.rangedLevel * loadout.prayerBonus) + 8;
            const maxHit = Math.floor((effectiveRanged * (loadout.rangedStrengthBonus + 64)) / 640);
            return maxHit;
        } else if (loadout.weapon.type === 'magic') {
            const baseMaxHit = loadout.spell ? loadout.spell.maxHit : 0;
            const magicDamageBonus = loadout.magicDamageBonus / 100;
            return Math.floor(baseMaxHit * (1 + magicDamageBonus));
        }
        return 0;
    }

    calculateAccuracy(loadout, monster, combatStyle = 'controlled') {
        let attackBonus = 0;
        let defenceBonus = 0;
        
        if (loadout.weapon.type === 'melee') {
            const effectiveAttack = Math.floor(loadout.attackLevel * loadout.prayerBonus) + loadout.attackBonus + 8;
            attackBonus = effectiveAttack * (loadout.weapon.attack + 64);
            defenceBonus = monster.defence;
        } else if (loadout.weapon.type === 'ranged') {
            const effectiveRanged = Math.floor(loadout.rangedLevel * loadout.prayerBonus) + 8;
            attackBonus = effectiveRanged * (loadout.weapon.ranged + 64);
            defenceBonus = monster.ranged;
        } else if (loadout.weapon.type === 'magic') {
            const effectiveMagic = Math.floor(loadout.magicLevel * loadout.prayerBonus) + 8;
            attackBonus = effectiveMagic * (loadout.weapon.magic + 64);
            defenceBonus = monster.magic;
        }
        
        if (attackBonus > defenceBonus) {
            return 1 - (defenceBonus + 2) / (2 * (attackBonus + 1));
        } else {
            return attackBonus / (2 * (defenceBonus + 1));
        }
    }

    calculateDPS(loadout, monster, combatStyle = 'controlled') {
        const maxHit = this.calculateMaxHit(loadout, combatStyle);
        const accuracy = this.calculateAccuracy(loadout, monster, combatStyle);
        const attackSpeed = loadout.weapon.speed * 0.6; // Convert to seconds
        
        const avgDamage = (maxHit * accuracy) / 2;
        const dps = avgDamage / attackSpeed;
        
        return {
            dps: dps,
            maxHit: maxHit,
            accuracy: accuracy * 100,
            avgDamage: avgDamage,
            attackSpeed: attackSpeed
        };
    }

    calculateSpecDPS(loadout, monster, specWeapon) {
        const specMaxHit = this.calculateMaxHit({ ...loadout, weapon: specWeapon });
        const specAccuracy = this.calculateAccuracy({ ...loadout, weapon: specWeapon }, monster);
        
        // Special attack multipliers
        const specMultipliers = {
            'Dragon Claws': { accuracy: 2.0, damage: 2.0, hits: 4 },
            'Armadyl Godsword': { accuracy: 2.0, damage: 1.375, hits: 1 },
            'Dragon Warhammer': { accuracy: 1.0, damage: 1.5, hits: 1, defReduction: 0.3 }
        };
        
        const mult = specMultipliers[specWeapon.name] || { accuracy: 1, damage: 1, hits: 1 };
        
        const specDamage = specMaxHit * mult.damage * mult.hits * (specAccuracy * mult.accuracy);
        
        return {
            damage: specDamage,
            accuracy: specAccuracy * mult.accuracy * 100,
            maxHit: specMaxHit * mult.damage
        };
    }

    compareLoadouts(loadouts, monster) {
        const results = loadouts.map(loadout => {
            const dpsData = this.calculateDPS(loadout, monster);
            return {
                name: loadout.name,
                ...dpsData,
                loadout: loadout
            };
        });
        
        return results.sort((a, b) => b.dps - a.dps);
    }

    calculateMultiTargetDPS(loadout, monsters) {
        // For AoE weapons like scythe
        const isAoE = loadout.weapon.name === 'Scythe of Vitur';
        let totalDPS = 0;
        
        monsters.forEach((monster, index) => {
            const dps = this.calculateDPS(loadout, monster);
            if (isAoE && index < 3) {
                // Scythe hits up to 3 targets
                totalDPS += dps.dps * (index === 0 ? 1 : index === 1 ? 0.5 : 0.25);
            } else if (index === 0) {
                totalDPS += dps.dps;
            }
        });
        
        return totalDPS;
    }

    renderCalculator() {
        const container = document.getElementById('dps-calculator-content');
        if (!container) return;
        
        let html = `
            <div class="dps-interface">
                <div class="loadout-builder">
                    <h3>Build Loadout</h3>
                    <div class="loadout-inputs">
                        <div class="input-group">
                            <label>Loadout Name</label>
                            <input type="text" id="loadout-name" placeholder="Max Melee">
                        </div>
                        
                        <div class="input-group">
                            <label>Weapon</label>
                            <select id="weapon-select">
                                ${Object.entries(this.weaponDatabase).map(([name, stats]) => 
                                    `<option value="${name}">${name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="combat-stats">
                            <h4>Combat Levels</h4>
                            <div class="stat-grid">
                                <div class="stat-input">
                                    <label>Attack</label>
                                    <input type="number" id="attack-level" value="99" min="1" max="99">
                                </div>
                                <div class="stat-input">
                                    <label>Strength</label>
                                    <input type="number" id="strength-level" value="99" min="1" max="99">
                                </div>
                                <div class="stat-input">
                                    <label>Ranged</label>
                                    <input type="number" id="ranged-level" value="99" min="1" max="99">
                                </div>
                                <div class="stat-input">
                                    <label>Magic</label>
                                    <input type="number" id="magic-level" value="99" min="1" max="99">
                                </div>
                            </div>
                        </div>
                        
                        <div class="gear-bonuses">
                            <h4>Gear Bonuses</h4>
                            <div class="bonus-grid">
                                <div class="bonus-input">
                                    <label>Melee Attack</label>
                                    <input type="number" id="attack-bonus" value="150" placeholder="0">
                                </div>
                                <div class="bonus-input">
                                    <label>Melee Strength</label>
                                    <input type="number" id="strength-bonus" value="120" placeholder="0">
                                </div>
                                <div class="bonus-input">
                                    <label>Ranged Attack</label>
                                    <input type="number" id="ranged-bonus" value="0" placeholder="0">
                                </div>
                                <div class="bonus-input">
                                    <label>Ranged Strength</label>
                                    <input type="number" id="ranged-str-bonus" value="0" placeholder="0">
                                </div>
                                <div class="bonus-input">
                                    <label>Magic Attack</label>
                                    <input type="number" id="magic-bonus" value="0" placeholder="0">
                                </div>
                                <div class="bonus-input">
                                    <label>Magic Damage %</label>
                                    <input type="number" id="magic-damage-bonus" value="0" placeholder="0">
                                </div>
                            </div>
                        </div>
                        
                        <div class="prayer-select">
                            <label>Prayer Multiplier</label>
                            <select id="prayer-bonus">
                                <option value="1.0">None</option>
                                <option value="1.15">15% (Ultimate Strength)</option>
                                <option value="1.18">18% (Incredible Reflexes)</option>
                                <option value="1.20">20% (Piety/Rigour/Augury)</option>
                            </select>
                        </div>
                        
                        <button class="add-loadout-btn" onclick="window.dpsCalculator.addLoadout()">
                            Add Loadout
                        </button>
                    </div>
                </div>
                
                <div class="monster-select">
                    <h3>Select Target</h3>
                    <select id="monster-select">
                        ${Object.entries(this.monsterDatabase).map(([name, stats]) => 
                            `<option value="${name}">${name}</option>`
                        ).join('')}
                    </select>
                    
                    <button class="calculate-dps-btn" onclick="window.dpsCalculator.calculateAndDisplay()">
                        Calculate DPS
                    </button>
                </div>
                
                <div class="loadout-list">
                    <h3>Saved Loadouts</h3>
                    <div id="saved-loadouts"></div>
                </div>
                
                <div class="dps-results" id="dps-results"></div>
                
                <div class="spec-calculator">
                    <h3>Special Attack Calculator</h3>
                    <div class="spec-weapons">
                        <button onclick="window.dpsCalculator.calculateSpec('Dragon Claws')">Dragon Claws</button>
                        <button onclick="window.dpsCalculator.calculateSpec('Armadyl Godsword')">AGS</button>
                        <button onclick="window.dpsCalculator.calculateSpec('Dragon Warhammer')">DWH</button>
                    </div>
                    <div id="spec-results"></div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.displaySavedLoadouts();
    }

    addLoadout() {
        const loadout = {
            name: document.getElementById('loadout-name').value || 'Unnamed Loadout',
            weapon: this.weaponDatabase[document.getElementById('weapon-select').value],
            attackLevel: parseInt(document.getElementById('attack-level').value),
            strengthLevel: parseInt(document.getElementById('strength-level').value),
            rangedLevel: parseInt(document.getElementById('ranged-level').value),
            magicLevel: parseInt(document.getElementById('magic-level').value),
            attackBonus: parseInt(document.getElementById('attack-bonus').value) || 0,
            strengthBonus: parseInt(document.getElementById('strength-bonus').value) || 0,
            rangedBonus: parseInt(document.getElementById('ranged-bonus').value) || 0,
            rangedStrengthBonus: parseInt(document.getElementById('ranged-str-bonus').value) || 0,
            magicBonus: parseInt(document.getElementById('magic-bonus').value) || 0,
            magicDamageBonus: parseInt(document.getElementById('magic-damage-bonus').value) || 0,
            prayerBonus: parseFloat(document.getElementById('prayer-bonus').value)
        };
        
        loadout.weapon.name = document.getElementById('weapon-select').value;
        
        this.loadouts.push(loadout);
        this.displaySavedLoadouts();
    }

    displaySavedLoadouts() {
        const container = document.getElementById('saved-loadouts');
        if (!container) return;
        
        let html = '';
        this.loadouts.forEach((loadout, index) => {
            html += `
                <div class="saved-loadout">
                    <span>${loadout.name} - ${loadout.weapon.name}</span>
                    <button onclick="window.dpsCalculator.removeLoadout(${index})">Remove</button>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p>No loadouts saved yet</p>';
    }

    removeLoadout(index) {
        this.loadouts.splice(index, 1);
        this.displaySavedLoadouts();
    }

    calculateAndDisplay() {
        const monsterName = document.getElementById('monster-select').value;
        const monster = this.monsterDatabase[monsterName];
        
        if (this.loadouts.length === 0) {
            alert('Please add at least one loadout first!');
            return;
        }
        
        const results = this.compareLoadouts(this.loadouts, monster);
        
        const container = document.getElementById('dps-results');
        let html = `
            <h3>DPS Comparison vs ${monsterName}</h3>
            <div class="dps-chart">
        `;
        
        results.forEach((result, index) => {
            html += `
                <div class="dps-result ${index === 0 ? 'best' : ''}">
                    <h4>${result.name}</h4>
                    <div class="dps-stats">
                        <div class="dps-stat">
                            <span class="stat-label">DPS</span>
                            <span class="stat-value">${result.dps.toFixed(2)}</span>
                        </div>
                        <div class="dps-stat">
                            <span class="stat-label">Max Hit</span>
                            <span class="stat-value">${result.maxHit}</span>
                        </div>
                        <div class="dps-stat">
                            <span class="stat-label">Accuracy</span>
                            <span class="stat-value">${result.accuracy.toFixed(1)}%</span>
                        </div>
                        <div class="dps-stat">
                            <span class="stat-label">Attack Speed</span>
                            <span class="stat-value">${result.attackSpeed.toFixed(1)}s</span>
                        </div>
                    </div>
                    <div class="dps-bar">
                        <div class="dps-fill" style="width: ${(result.dps / results[0].dps) * 100}%"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    calculateSpec(weaponName) {
        if (this.loadouts.length === 0) {
            alert('Please add a loadout first!');
            return;
        }
        
        const loadout = this.loadouts[0]; // Use first loadout
        const weapon = this.weaponDatabase[weaponName];
        weapon.name = weaponName;
        
        const monsterName = document.getElementById('monster-select').value;
        const monster = this.monsterDatabase[monsterName];
        
        const specData = this.calculateSpecDPS(loadout, monster, weapon);
        
        const container = document.getElementById('spec-results');
        container.innerHTML = `
            <h4>${weaponName} Special Attack</h4>
            <div class="spec-stats">
                <p>Expected Damage: ${specData.damage.toFixed(1)}</p>
                <p>Accuracy: ${specData.accuracy.toFixed(1)}%</p>
                <p>Max Hit: ${specData.maxHit}</p>
            </div>
        `;
    }

    init() {
        this.renderCalculator();
    }
}

// Initialize DPS calculator
window.dpsCalculator = new DPSCalculator();