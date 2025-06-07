/**
 * Audio Manager for Periodic Table Race
 * Handles Web Audio API for game sound effects
 */
export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.correctBuffer = null;
    this.wrongBuffer = null;
    this.isInitialized = false;
    this.isMuted = false;
  }

  /**
   * Initialize Web Audio API
   */
  async initialize() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Load or generate sound effects
      await this.loadSounds();
      
      this.isInitialized = true;
      console.log('Audio Manager initialized successfully');
    } catch (error) {
      console.warn('Web Audio API not supported or failed to initialize:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Load sound files or generate synthetic sounds
   */
  async loadSounds() {
    try {
      // Try to load actual sound files first
      this.correctBuffer = await this.loadAudioFile('/sfx/correct.mp3');
      this.wrongBuffer = await this.loadAudioFile('/sfx/wrong.mp3');
    } catch (error) {
      console.log('Sound files not found, generating synthetic sounds');
      // Generate synthetic sounds as fallback
      this.correctBuffer = this.generateTone(523.25, 0.2, 'sine'); // C5 note
      this.wrongBuffer = this.generateTone(220, 0.3, 'sawtooth'); // A3 note
    }
  }

  /**
   * Load audio file and decode it
   * @param {string} url - URL of the audio file
   * @returns {Promise<AudioBuffer>} Decoded audio buffer
   */
  async loadAudioFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load audio file: ${url}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  /**
   * Generate a synthetic tone
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {string} waveType - Oscillator wave type
   * @returns {AudioBuffer} Generated audio buffer
   */
  generateTone(frequency, duration, waveType = 'sine') {
    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (waveType) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        default:
          sample = Math.sin(2 * Math.PI * frequency * t);
      }

      // Apply envelope (fade out)
      const envelope = Math.max(0, 1 - (t / duration) ** 2);
      channelData[i] = sample * envelope * 0.1; // Volume control
    }

    return buffer;
  }

  /**
   * Play a sound buffer
   * @param {AudioBuffer} buffer - Audio buffer to play
   */
  playBuffer(buffer) {
    if (!this.isInitialized || !buffer || this.isMuted) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set volume
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      
      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  /**
   * Play correct answer sound
   */
  playCorrect() {
    this.playBuffer(this.correctBuffer);
  }

  /**
   * Play wrong answer sound
   */
  playWrong() {
    this.playBuffer(this.wrongBuffer);
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Set mute state
   * @param {boolean} muted - Whether to mute audio
   */
  setMuted(muted) {
    this.isMuted = muted;
  }

  /**
   * Get current mute state
   * @returns {boolean} Current mute state
   */
  isMutedState() {
    return this.isMuted;
  }

  /**
   * Resume audio context (required for some browsers)
   */
  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Clean up audio resources
   */
  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }
}
