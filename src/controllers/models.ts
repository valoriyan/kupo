export interface RenderableDateTime {
  year: number;
  // 0 based value
  month: number;
  // 1 based value
  day: number;
  // 0-23
  hour: number;
  // 0 - 59
  minute: number;
  // Example: 'America/New_York'
  userTimeZone: string;
}
