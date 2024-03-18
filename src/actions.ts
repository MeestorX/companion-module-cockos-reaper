import {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionActionEvent,
	CompanionInputFieldNumber,
	LogLevel,
} from '@companion-module/base'
import { OscMessage, Reaper, RecordMonitoringMode, Track, TrackFx } from 'reaper-osc'

export enum ActionId {
	// Transport
	Record = 'record',
	Play = 'play',
	Stop = 'stop',
	Pause = 'pause',
	StartRewind = 'start_rewind',
	StopRewind = 'stop_rewind',
	StartForward = 'start_forward',
	StopForward = 'stop_forward',
	ToggleClick = 'click',
	ToggleRepeat = 'repeat',
	GotoMarker = 'goto_marker',
	GotoRegion = 'goto_region',

	// Track
	TrackMute = 'track_mute',
	TrackSolo = 'track_solo',
	TrackArm = 'track_arm',
	TrackUnmute = 'track_unmute',
	TrackUnsolo = 'track_unsolo',
	TrackUnarm = 'track_unarm',
	TrackMuteToggle = 'track_mute_toggle',
	TrackSoloToggle = 'track_solo_toggle',
	TrackArmToggle = 'track_arm_toggle',
	TrackSelect = 'track_select',
	TrackDeselect = 'track_deselect',
	TrackMonitorEnable = 'track_monitor_enable',
	TrackMonitorDisable = 'track_monitor_disable',

	// Track FX
	TrackFxBypass = 'track_fx_bypass',
	TrackFxOpenUi = 'track_fx_openui',
	TrackFxUnbypass = 'track_fx_unbypass',
	TrackFxCloseUi = 'track_fx_closeui',

	// General
	AutoRecordArm = 'autorecarm',
	SoloReset = 'soloreset',
	CustomAction = 'custom_action',
	RefreshOrc = 'refresh_osc',
}

export interface ActionProps {
	reaper: Reaper
	log: (level: LogLevel, message: string) => void
}

export function GetActionsList(getProps: () => ActionProps): CompanionActionDefinitions {
	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		// Transport
		[ActionId.Record]: {
			name: 'Record',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.record()
			},
		},
		[ActionId.Play]: {
			name: 'Play',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.play()
			},
		},
		[ActionId.Stop]: {
			name: 'Stop',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.stop()
			},
		},
		[ActionId.Pause]: {
			name: 'Pause',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.pause()
			},
		},
		[ActionId.StartRewind]: {
			name: 'Rewind (Start)',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.startRewinding()
			},
		},
		[ActionId.StopRewind]: {
			name: 'Rewind (Stop)',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.stopRewinding()
			},
		},
		[ActionId.StartForward]: {
			name: 'Forward (Start)',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.startFastForwarding()
			},
		},
		[ActionId.StopForward]: {
			name: 'Forward (Stop)',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.stopFastForwarding()
			},
		},
		[ActionId.ToggleClick]: {
			name: 'Click/Metronome',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.toggleMetronome()
			},
		},
		[ActionId.ToggleRepeat]: {
			name: 'Toggle Repeat',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.transport.toggleRepeat()
			},
		},
		[ActionId.GotoMarker]: {
			name: 'Go To Marker',
			options: [
				{
					type: 'number',
					label: 'Marker Number',
					id: 'marker',
					default: 1,
					min: 1,
					max: 1024,
				},
			],
			callback: (evt) => {
				const props = getProps()

				const message = new OscMessage(`/marker/${evt.options.marker}`)

				// TODO: replace with built-in when it is supported
				props.reaper.sendOscMessage(message)
			},
		},
		[ActionId.GotoRegion]: {
			name: 'Go To Region',
			options: [
				{
					type: 'number',
					label: 'Region Number',
					id: 'region',
					default: 1,
					min: 1,
					max: 1024,
				},
			],
			callback: (evt) => {
				const props = getProps()

				const message = new OscMessage(`/region/${evt.options.region}`)

				// TODO: replace with built-in when it is supported
				props.reaper.sendOscMessage(message)
			},
		},

		// Track Actions
		[ActionId.TrackMute]: {
			name: 'Track Mute',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.mute())
			},
		},
		[ActionId.TrackSolo]: {
			name: 'Track Solo',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.solo())
			},
		},
		[ActionId.TrackArm]: {
			name: 'Track Arm',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.recordArm())
			},
		},
		[ActionId.TrackUnmute]: {
			name: 'Track Unmute',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.unmute())
			},
		},
		[ActionId.TrackUnsolo]: {
			name: 'Track Unsolo',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.unsolo())
			},
		},
		[ActionId.TrackUnarm]: {
			name: 'Track Unarm',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.recordDisarm())
			},
		},
		[ActionId.TrackMuteToggle]: {
			name: 'Track Mute Toggle',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.toggleMute())
			},
		},
		[ActionId.TrackSoloToggle]: {
			name: 'Track Solo Toggle',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.toggleSolo())
			},
		},
		[ActionId.TrackArmToggle]: {
			name: 'Track Record Arm Toggle',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.toggleRecordArm())
			},
		},
		[ActionId.TrackSelect]: {
			name: 'Track Select',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.select())
			},
		},
		[ActionId.TrackDeselect]: {
			name: 'Track Deselect',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.deselect())
			},
		},
		[ActionId.TrackMonitorEnable]: {
			name: 'Track Monitoring Enable',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.setMonitoringMode(RecordMonitoringMode.ON))
			},
		},
		[ActionId.TrackMonitorDisable]: {
			name: 'Track Monitoring Disable',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getProps(), (track) => track.setMonitoringMode(RecordMonitoringMode.OFF))
			},
		},

		// Track Fx actions
		[ActionId.TrackFxBypass]: {
			name: 'Track Fx Bypass',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getProps(), (fx) => fx.bypass())
			},
		},
		[ActionId.TrackFxOpenUi]: {
			name: 'Track Fx Open Ui',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getProps(), (fx) => fx.openUi())
			},
		},
		[ActionId.TrackFxUnbypass]: {
			name: 'Track Fx Unbypass',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getProps(), (fx) => fx.unbypass())
			},
		},
		[ActionId.TrackFxCloseUi]: {
			name: 'Track Fx Close Ui',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getProps(), (fx) => fx.closeUi())
			},
		},

		// General
		[ActionId.AutoRecordArm]: {
			name: 'Autoarm Record',
			options: [],
			callback: () => {
				const props = getProps()

				// TODO: replace with built-in when it is supported
				const message = new OscMessage('/autorecarm')

				props.reaper.sendOscMessage(message)
			},
		},
		[ActionId.SoloReset]: {
			name: 'Reset Solos',
			options: [],
			callback: () => {
				const props = getProps()

				// TODO: replace with built-in when it is supported
				const message = new OscMessage('/soloreset')

				props.reaper.sendOscMessage(message)
			},
		},
		[ActionId.CustomAction]: {
			name: 'Custom Action',
			options: [
				{
					type: 'textinput',
					label: 'Action Command ID',
					id: 'action_cmd_id',
				},
			],
			callback: async (evt, ctx) => {
				const props = getProps()

				let command_id = evt.options.action_cmd_id

				if (typeof command_id !== 'string') {
					return
				}

				command_id = await ctx.parseVariablesInString(command_id)

				props.reaper.triggerAction(command_id)
			},
		},
		[ActionId.RefreshOrc]: {
			name: 'Refresh OSC',
			options: [],
			callback: () => {
				const props = getProps()

				props.reaper.refreshControlSurfaces()
			},
		},
	}

	return actions
}

function trackOption(): CompanionInputFieldNumber {
	return {
		type: 'number',
		label: 'Track',
		id: 'track',
		default: 1,
		min: 1,
		max: 1024,
	}
}

function fxOption(): CompanionInputFieldNumber {
	return {
		type: 'number',
		label: 'Fx',
		id: 'fx',
		default: 1,
		min: 1,
		max: 1024,
	}
}

function trackCallback(evt: CompanionActionEvent, props: ActionProps, callback: (track: Track) => void) {
	const trackIndex = Number(evt.options.track) - 1

	const track = props.reaper.tracks[trackIndex]

	if (track === undefined) {
		props.log('warn', `Track ${evt.options.track} not found`)
		return
	}

	callback(track)
}

function trackFxCallback(evt: CompanionActionEvent, props: ActionProps, callback: (fx: TrackFx) => void) {
	const fxIndex = Number(evt.options.fx) - 1

	return trackCallback(evt, props, (track: Track) => {
		const fx = track.fx[fxIndex]

		if (fx === undefined) {
			props.log('warn', `Fx ${evt.options.fx} not found`)
			return
		}

		callback(fx)
	})
}
