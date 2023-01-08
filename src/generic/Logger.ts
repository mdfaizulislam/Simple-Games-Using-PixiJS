/**
 * Title: Logger
 * Description: This file is responsible for logging messages with more informative way
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

export class Logger {
  private mLogPrefix: string;
  private mLoggingEnabled: boolean;
  private mGenericLogEnabled: boolean = false;
  constructor(
    prefix: string,
    loggingEnabled: boolean,
    genericLoggingEnabled: boolean = false
  ) {
    this.mLogPrefix = prefix + ": ";
    this.mLoggingEnabled = loggingEnabled;
    this.mGenericLogEnabled = genericLoggingEnabled;
  }

  genericLog(message: any, ...optionalParams: any[]) {
    if (!this.mLoggingEnabled) return;
    if (this.mGenericLogEnabled) {
      console.log(this.mLogPrefix, message, optionalParams);
    }
  }
  /**
   *
   * @param message msg to print on console
   * @param logLevel 1: LOG, 2: WARN, 3: ERROR, others: Info
   */
  Log(message: string, logLevel: number = 1) {
    if (!this.mLoggingEnabled) return;
    switch (logLevel) {
      case 1:
        {
          console.log(this.mLogPrefix + message);
        }
        break;
      case 2:
        {
          console.warn(this.mLogPrefix + message);
        }
        break;
      case 2:
        {
          console.error(this.mLogPrefix + message);
        }
        break;
      default:
        {
          console.info(this.mLogPrefix + message);
        }
        break;
    }
  }
}
