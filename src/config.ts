const envSettings = window as any;
export class Config {
  static alerts_url = envSettings.ALERTS_URL;
  static feedback_url = envSettings.FEEDBACK_URL;
}