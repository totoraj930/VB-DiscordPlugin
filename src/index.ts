import { PluginInitProps, VirtuButtonPlugin } from '@/src-common/Plugin';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import {
  onMicEvent,
  toggleMicAction,
  toggleMicButton,
} from './actions/toggleMic';
import {
  onSpeakerEvent,
  toggleSpeakerAction,
  toggleSpeakerButton,
} from './actions/toggleSpeaker';
import { DiscordApi } from './api';
import { emitEvent, events } from './events';

export let pluginInitProps: PluginInitProps | undefined;

export let api: DiscordApi | null = null;

export let clientId = '';
export let clientSecret = '';

export function onEvent(
  event: 'mic-on' | 'mic-off' | 'speaker-on' | 'speaker-off'
) {
  emitEvent(event);
  if (event === 'mic-on' || event === 'mic-off') {
    onMicEvent(event);
  } else if (event === 'speaker-on' || event == 'speaker-off') {
    onSpeakerEvent(event);
  }
}

const zKey = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
});

const discordPlugin: VirtuButtonPlugin = {
  schemaVersion: 1,
  id: 'discord-plugin',
  name: 'Discordプラグイン(built-in)',
  description: `Discordの操作を行うプラグインです。`,
  actions: [toggleMicAction, toggleSpeakerAction],
  events,
  controlButtons: [toggleMicButton, toggleSpeakerButton],
  init: async (initProps) => {
    pluginInitProps = initProps;

    const dir = path.join(initProps.pluginPath);
    const tokenFilePath = path.join(dir, './token.json');

    const keyFilePath = path.join(dir, './key.json');
    const rawKeyFile = fs.readFileSync(keyFilePath, { encoding: 'utf-8' });
    const key = zKey.parse(JSON.parse(rawKeyFile));
    clientId = key.clientId;
    clientSecret = key.clientSecret;
    api = new DiscordApi(tokenFilePath, key);
    await api.login();
  },
};

export default discordPlugin;
