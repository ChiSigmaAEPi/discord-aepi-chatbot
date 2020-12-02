import { Indicator } from '../constants/all';

export const extractId = (content: string) =>
  content
    .replace(Indicator.Bold, '')
    .replace(Indicator.Channel, '')
    .replace(Indicator.Emoji, '')
    .replace(Indicator.EmbedStart, '')
    .replace(Indicator.EmbedEnd, '')
    .trim();
