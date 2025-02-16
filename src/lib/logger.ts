type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

class Logger {
  private logLevel: LogLevel = 'info';

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metadataStr}`;
  }

  debug(message: string, metadata?: LogMetadata) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, metadata));
    }
  }

  info(message: string, metadata?: LogMetadata) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, metadata));
    }
  }

  warn(message: string, metadata?: LogMetadata) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, metadata));
    }
  }

  error(message: string, metadata?: LogMetadata) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, metadata));
    }
  }
}

export const logger = new Logger();