import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface ReaperConfig {
	host?: string
	port?: number
	feedbackPort?: number
	refreshOnInit?: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls <a href="https://www.reaper.fm" target="_new">REAPER</a>.',
		},
		{
			type: 'textinput',
			id: 'host',
			width: 6,
			label: 'Target IP',
			tooltip: 'The IP of the computer running REAPER',
			regex: Regex.IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 3,
			tooltip: 'The port REAPER is listening to OSC on',
			regex: Regex.SIGNED_NUMBER,
		},
		{
			type: 'textinput',
			id: 'feedbackPort',
			label: 'Feedback Port',
			width: 3,
			tooltip: 'The port REAPER is sending OSC to',
			regex: Regex.SIGNED_NUMBER,
		},
		{
			type: 'checkbox',
			id: 'refreshOnInit',
			label: 'Refresh On Start',
			width: 3,
			tooltip: 'If enabled, a "Control surface: Refresh all surfaces" command will be sent to reaper on start.',
			default: false,
		},
	]
}
