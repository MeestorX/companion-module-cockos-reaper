import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

export enum ActionId {
	Record = 'record',
	Play = 'play',
	Stop = 'stop',
	Pause = 'pause',
	AutoRecordArm = 'autorecarm',
	SoloReset = 'soloreset',
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

	CustomAction = 'custom_action',
}

export function GetActionsList(): CompanionActionDefinitions {
	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		[ActionId.Record]: undefined,
		[ActionId.Play]: undefined,
		[ActionId.Stop]: undefined,
		[ActionId.Pause]: undefined,
		[ActionId.AutoRecordArm]: undefined,
		[ActionId.SoloReset]: undefined,
		[ActionId.StartRewind]: undefined,
		[ActionId.StopRewind]: undefined,
		[ActionId.StartForward]: undefined,
		[ActionId.StopForward]: undefined,
		[ActionId.ToggleClick]: undefined,
		[ActionId.ToggleRepeat]: undefined,
		[ActionId.GotoMarker]: undefined,
		[ActionId.GotoRegion]: undefined,
		[ActionId.TrackMute]: undefined,
		[ActionId.TrackSolo]: undefined,
		[ActionId.TrackArm]: undefined,
		[ActionId.TrackUnmute]: undefined,
		[ActionId.TrackUnsolo]: undefined,
		[ActionId.TrackUnarm]: undefined,
		[ActionId.TrackMuteToggle]: undefined,
		[ActionId.TrackSoloToggle]: undefined,
		[ActionId.TrackArmToggle]: undefined,
		[ActionId.TrackSelect]: undefined,
		[ActionId.TrackDeselect]: undefined,
		[ActionId.TrackMonitorEnable]: undefined,
		[ActionId.TrackMonitorDisable]: undefined,
		[ActionId.TrackFxBypass]: undefined,
		[ActionId.TrackFxOpenUi]: undefined,
		[ActionId.TrackFxUnbypass]: undefined,
		[ActionId.TrackFxCloseUi]: undefined,
		[ActionId.CustomAction]: undefined,
	}

	return actions
}
