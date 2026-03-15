// Seeded Random Number Generator for Pokemon Roguelike
// Allows reproducible runs with the same seed

class SeededRNG {
    constructor(seed) {
        this.seed = seed;
        this.state = this.hashSeed(seed);
    }
    
    // Simple string hash function
    hashSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash === 0 ? 12345 : Math.abs(hash); // Avoid 0 seed
    }
    
    // Linear Congruential Generator for fast deterministic random
    // Returns float between 0 and 1
    random() {
        this.state = (this.state * 1103515245 + 12345) % 2147483648;
        return this.state / 2147483648;
    }
    
    // Random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
    
    // Random element from array
    randomChoice(array) {
        return array[this.randomInt(0, array.length - 1)];
    }
    
    // Shuffle array in place (Fisher-Yates)
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = this.randomInt(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    
    // Generate a random seed string
    static generateSeed() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, 1, I)
        let seed = '';
        for (let i = 0; i < 6; i++) {
            seed += chars[Math.floor(Math.random() * chars.length)];
        }
        return seed;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SeededRNG };
}
