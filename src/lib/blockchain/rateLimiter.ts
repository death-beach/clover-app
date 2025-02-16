export class RateLimiter {
  private timestamps: number[] = [];
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    
    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (this.timestamps.length >= this.maxRequests) {
      const oldestTimestamp = this.timestamps[0];
      const waitTime = this.windowMs - (now - oldestTimestamp);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      // After waiting, remove expired timestamps again
      const newNow = Date.now();
      this.timestamps = this.timestamps.filter(
        timestamp => newNow - timestamp < this.windowMs
      );
    }

    this.timestamps.push(now);
  }

  getRequestsRemaining(): number {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );
    return this.maxRequests - this.timestamps.length;
  }
}