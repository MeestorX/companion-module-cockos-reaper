import {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionActionEvent,
	CompanionInputFieldNumber,
} from '@companion-module/base'
import { FloatMessage, OscMessage, RecordMonitoringMode, StringMessage, Track, TrackFx } from 'reaper-osc'
import { ModuleContext } from './index'

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
	CustomMessage = 'custom_message',
}

export type ActionContext = ModuleContext

export function GetActionsList(getContext: () => ActionContext): CompanionActionDefinitions {
	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		// Transport
		[ActionId.Record]: {
			name: 'Record',
			options: [],
			callback: () => {
				const props = getContext()

				props.reaper.transport.record()
			},
		},
		[ActionId.Play]: {
			name: 'Play',
			options: [],
			callback: () => {
				const props = getContext()

				props.reaper.transport.play()
			},
		},
		[ActionId.Stop]: {
			name: 'Stop',
			options: [],
			callback: () => {
				const props = getContext()

				props.reaper.transport.stop()
			},
		},
		[ActionId.Pause]: {
			name: 'Pause',
			options: [],
			callback: () => {
				const props = getContext()

				props.reaper.transport.pause()
			},
		},
		[ActionId.StartRewind]: {
			name: 'Rewind (Start)',
			options: [],
			callback: () => {
				const props = getContext()

				props.reaper.transport.startRewinding()
			},
		},
		[ActionId.StopRewind]: {
			name: 'Rewind (Stop)',
			options: [],
			callback: () => {
				const context = getContext()

				context.reaper.transport.stopRewinding()
			},
		},
		[ActionId.StartForward]: {
			name: 'Forward (Start)',
			options: [],
			callback: () => {
				const context = getContext()

				context.reaper.transport.startFastForwarding()
			},
		},
		[ActionId.StopForward]: {
			name: 'Forward (Stop)',
			options: [],
			callback: () => {
				const context = getContext()

				context.reaper.transport.stopFastForwarding()
			},
		},
		[ActionId.ToggleClick]: {
			name: 'Click/Metronome',
			options: [],
			callback: () => {
				const context = getContext()

				context.reaper.toggleMetronome()
			},
		},
		[ActionId.ToggleRepeat]: {
			name: 'Toggle Repeat',
			options: [],
			callback: () => {
				const context = getContext()

				context.reaper.transport.toggleRepeat()
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
				const context = getContext()

				const message = new OscMessage(`/marker/${evt.options.marker}`)

				// TODO: replace with built-in when it is supported
				context.reaper.sendOscMessage(message)
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
				const context = getContext()

				const message = new OscMessage(`/region/${evt.options.region}`)

				// TODO: replace with built-in when it is supported
				context.reaper.sendOscMessage(message)
			},
		},

		// Track Actions
		[ActionId.TrackMute]: {
			name: 'Track Mute',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.mute())
			},
		},
		[ActionId.TrackSolo]: {
			name: 'Track Solo',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.solo())
			},
		},
		[ActionId.TrackArm]: {
			name: 'Track Arm',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.recordArm())
			},
		},
		[ActionId.TrackUnmute]: {
			name: 'Track Unmute',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.unmute())
			},
		},
		[ActionId.TrackUnsolo]: {
			name: 'Track Unsolo',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.unsolo())
			},
		},
		[ActionId.TrackUnarm]: {
			name: 'Track Unarm',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.recordDisarm())
			},
		},
		[ActionId.TrackMuteToggle]: {
			name: 'Track Mute Toggle',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.toggleMute())
			},
		},
		[ActionId.TrackSoloToggle]: {
			name: 'Track Solo Toggle',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.toggleSolo())
			},
		},
		[ActionId.TrackArmToggle]: {
			name: 'Track Record Arm Toggle',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.toggleRecordArm())
			},
		},
		[ActionId.TrackSelect]: {
			name: 'Track Select',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.select())
			},
		},
		[ActionId.TrackDeselect]: {
			name: 'Track Deselect',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.deselect())
			},
		},
		[ActionId.TrackMonitorEnable]: {
			name: 'Track Monitoring Enable',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.setMonitoringMode(RecordMonitoringMode.ON))
			},
		},
		[ActionId.TrackMonitorDisable]: {
			name: 'Track Monitoring Disable',
			options: [trackOption()],
			callback: (evt) => {
				trackCallback(evt, getContext(), (track) => track.setMonitoringMode(RecordMonitoringMode.OFF))
			},
		},

		// Track Fx actions
		[ActionId.TrackFxBypass]: {
			name: 'Track Fx Bypass',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getContext(), (fx) => fx.bypass())
			},
		},
		[ActionId.TrackFxOpenUi]: {
			name: 'Track Fx Open Ui',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getContext(), (fx) => fx.openUi())
			},
		},
		[ActionId.TrackFxUnbypass]: {
			name: 'Track Fx Unbypass',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getContext(), (fx) => fx.unbypass())
			},
		},
		[ActionId.TrackFxCloseUi]: {
			name: 'Track Fx Close Ui',
			options: [trackOption(), fxOption()],
			callback: (evt) => {
				trackFxCallback(evt, getContext(), (fx) => fx.closeUi())
			},
		},

		// General
		[ActionId.AutoRecordArm]: {
			name: 'Autoarm Record',
			options: [],
			callback: () => {
				const context = getContext()

				// TODO: replace with built-in when it is supported
				const message = new OscMessage('/autorecarm')

				context.reaper.sendOscMessage(message)
			},
		},
		[ActionId.SoloReset]: {
			name: 'Reset Solos',
			options: [],
			callback: () => {
				const context = getContext()

				// TODO: replace with built-in when it is supported
				const message = new OscMessage('/soloreset')

				context.reaper.sendOscMessage(message)
			},
		},
		[ActionId.CustomAction]: {
			name: 'Custom Action',
			description: 'Execute a Reaper action',
			options: [
				{
					type: 'textinput',
					label: 'Action Command ID',
					id: 'action_cmd_id',
				},
			],
			callback: async (evt, ctx) => {
				const context = getContext()

				let command_id = evt.options.action_cmd_id

				if (typeof command_id !== 'string') {
					return
				}

				command_id = await ctx.parseVariablesInString(command_id)

				context.reaper.triggerAction(command_id)
			},
		},
		[ActionId.CustomMessage]: {
			name: 'Custom OSC Message',
			description: 'Send a custom OSC message',
			options: [
				{
					type: 'textinput',
					label: 'OSC Address',
					id: 'address',
				},
				{
					type: 'dropdown',
					label: 'Message Type',
					id: 'type',
					default: 'f',
					choices: [
						{ id: 'f', label: 'Number' },
						{ id: 's', label: 'String' },
						{ id: 't', label: 'Toggle' },
					],
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					isVisible: (opts) => {
						switch (opts.type) {
							case 'f':
							case 's':
								return true
							default:
								return false
						}
					},
				},
			],
			callback: async (evt, ctx) => {
				const context = getContext()

				let address = evt.options.address
				let value = evt.options.value

				if (typeof address !== 'string' || typeof value !== 'string') {
					return
				}

				address = await ctx.parseVariablesInString(address)
				value = await ctx.parseVariablesInString(value)

				let message: OscMessage

				switch (evt.options.type) {
					case 'f':
						message = new FloatMessage(address, Number(value))
						break
					case 's':
						message = new StringMessage(address, value)
						break
					default:
						return
				}

				context.reaper.sendOscMessage(message)
			},
		},
		[ActionId.RefreshOrc]: {
			name: 'Refresh OSC',
			options: [],
			callback: () => {
				const context = getContext()

				context.reaper.refreshControlSurfaces()
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
		tooltip: 'Use 0 to apply this action to MASTER',
		default: 1,
		min: 0,
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

function trackCallback(evt: CompanionActionEvent, context: ActionContext, callback: (track: Track) => void) {
	const trackNumber = Number(evt.options.track)

	const track = trackNumber === 0 ? context.reaper.master : context.reaper.tracks[trackNumber - 1]

	if (track === undefined) {
		context.log('warn', `Track ${evt.options.track} not found`)
		return
	}

	callback(track)
}

function trackFxCallback(evt: CompanionActionEvent, context: ActionContext, callback: (fx: TrackFx) => void) {
	const fxIndex = Number(evt.options.fx) - 1

	return trackCallback(evt, context, (track: Track) => {
		const fx = track.fx[fxIndex]

		if (fx === undefined) {
			context.log('warn', `Fx ${evt.options.fx} not found`)
			return
		}

		callback(fx)
	})
}
