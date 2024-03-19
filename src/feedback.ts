import { CompanionBooleanFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import { ModuleContext } from './index'

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

export interface FeedbackContext extends ModuleContext {
	checkFeedback: (feedbackId: string) => void
}

export function GetFeedbacksList(getContext: () => FeedbackContext): CompanionFeedbackDefinitions {
	const feedbacks: { [id in FeedbackId]: CompanionBooleanFeedbackDefinition | undefined } = {
		[FeedbackId.PlayStatus]: {
			type: 'boolean',
			name: 'Change style based on Play/Pause status',
			description: 'Change style based on Play/Pause status',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 183, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'playPause',
					default: 'Playing',
					choices: [
						{ id: 'Playing', label: 'Playing' },
						{ id: 'Paused', label: 'Paused' },
					],
				},
			],
			callback: (evt) => {
				const context = getContext()

				const playing = evt.options.playPause === 'Playing'

				return context.reaper.transport.isPlaying == playing
			},
			subscribe: (evt) => {
				const context = getContext()

				context.reaper.transport.onPropertyChanged('isPlaying', () => {
					context.checkFeedback(evt.id)
				})
			},
			unsubscribe: () => {
				// TODO: Unsubscribe from the property changed event
			},
		},
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
