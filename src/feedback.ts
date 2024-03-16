import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'

export enum FeedbackId {
	PlayStatus = 'playStatus',
	StopStatus = 'stopStatus',
	RecordStatus = 'recordStatus',
	RewindStatus = 'rewindStatus',
	ForwardStatus = 'forwardStatus',
	RepeatStatus = 'repeatStatus',
	ClickStatus = 'clickStatus',
	CustomMessage = 'customMessage',

	// Track
	TrackMute = 'track_mute',
	TrackSolo = 'track_solo',
	TrackRecordArm = 'track_recarm',
	TrackSelected = 'track_select',
	TrackMonitor = 'track_monitor',

	// Track FX
	TrackFxBypass = 'track_fx_bypass',
	TrackFxOpenUi = 'track_fx_openui',
}

export function GetFeedbacksList(): CompanionFeedbackDefinitions {
	const feedbacks: { [id in FeedbackId]: CompanionFeedbackDefinition | undefined } = {
		[FeedbackId.PlayStatus]: undefined,
		[FeedbackId.StopStatus]: undefined,
		[FeedbackId.RecordStatus]: undefined,
		[FeedbackId.RewindStatus]: undefined,
		[FeedbackId.ForwardStatus]: undefined,
		[FeedbackId.RepeatStatus]: undefined,
		[FeedbackId.ClickStatus]: undefined,
		[FeedbackId.CustomMessage]: undefined,
		[FeedbackId.TrackMute]: undefined,
		[FeedbackId.TrackSolo]: undefined,
		[FeedbackId.TrackRecordArm]: undefined,
		[FeedbackId.TrackSelected]: undefined,
		[FeedbackId.TrackMonitor]: undefined,
		[FeedbackId.TrackFxBypass]: undefined,
		[FeedbackId.TrackFxOpenUi]: undefined,
	}

	return feedbacks
}
