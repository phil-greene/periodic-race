/**
 * Game Engine for Periodic Table Race
 * Handles game logic, option generation, and scoring
 */
export class GameEngine {
  constructor(elements) {
    this.elements = elements;
  }

  /**
   * Generate 4 multiple choice options for the current element
   * @param {number} currentIndex - Index of the current element (0-based)
   * @returns {Array} Array of 4 element objects (1 correct, 3 random)
   */
  generateOptions(currentIndex) {
    if (currentIndex >= this.elements.length) {
      return [];
    }

    const correctElement = this.elements[currentIndex];
    const options = [correctElement];

    // Add 3 random incorrect options
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * this.elements.length);
      const randomElement = this.elements[randomIndex];
      
      // Ensure we don't add duplicates
      if (!options.find(opt => opt.atomicNumber === randomElement.atomicNumber)) {
        options.push(randomElement);
      }
    }

    // Shuffle options so correct answer isn't always first
    return this.shuffleArray(options);
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Save player score to localStorage
   * @param {number} completionTime - Time taken to complete in seconds
   * @param {string} playerName - Player's name (optional)
   */
  saveScore(completionTime, playerName = null) {
    if (!playerName) {
      playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
    }

    const scoreEntry = {
      playerName,
      time: completionTime,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };

    let leaderboard = this.getLeaderboard();
    leaderboard.push(scoreEntry);
    
    // Sort by completion time (fastest first)
    leaderboard.sort((a, b) => a.time - b.time);
    
    // Keep only top 10 scores
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('periodicTableRaceScores', JSON.stringify(leaderboard));
    return scoreEntry;
  }

  /**
   * Get leaderboard from localStorage
   * @returns {Array} Array of score entries
   */
  getLeaderboard() {
    try {
      const stored = localStorage.getItem('periodicTableRaceScores');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }

  /**
   * Clear leaderboard (for testing/reset purposes)
   */
  clearLeaderboard() {
    localStorage.removeItem('periodicTableRaceScores');
  }

  /**
   * Get element by atomic number
   * @param {number} atomicNumber - Atomic number to find
   * @returns {Object|null} Element object or null if not found
   */
  getElementById(atomicNumber) {
    return this.elements.find(el => el.atomicNumber === atomicNumber) || null;
  }

  /**
   * Get element category color class
   * @param {string} category - Element category
   * @returns {string} CSS class name for the category
   */
  getCategoryClass(category) {
    const categoryMap = {
      'alkali-metal': 'element-alkali-metal',
      'alkaline-earth': 'element-alkaline-earth',
      'transition-metal': 'element-transition-metal',
      'post-transition': 'element-post-transition',
      'metalloid': 'element-metalloid',
      'nonmetal': 'element-nonmetal',
      'halogen': 'element-halogen',
      'noble-gas': 'element-noble-gas',
      'lanthanide': 'element-lanthanide',
      'actinide': 'element-actinide'
    };

    return categoryMap[category] || 'element-nonmetal';
  }

  /**
   * Format time from seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get statistics about current leaderboard
   * @returns {Object} Stats object
   */
  getLeaderboardStats() {
    const leaderboard = this.getLeaderboard();
    
    if (leaderboard.length === 0) {
      return {
        totalPlayers: 0,
        fastestTime: null,
        averageTime: null
      };
    }

    const times = leaderboard.map(entry => entry.time);
    const fastestTime = Math.min(...times);
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;

    return {
      totalPlayers: leaderboard.length,
      fastestTime,
      averageTime: Math.round(averageTime)
    };
  }
}
