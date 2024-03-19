import { CompanionBooleanFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import { ModuleContext } from './index'
import { FloatMessageHandler, IMessageHandler } from 'reaper-osc'

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

export type FeedbackBindings = {
	[id: string]: () => void
}

export type CustomMessageFeedback = { handler: IMessageHandler; getState: () => boolean }

export type CustomMessageFeedbacks = {
	[id: string]: CustomMessageFeedback
}

export interface FeedbackContext extends ModuleContext {
	readonly checkFeedback: (id: string) => void
	readonly bindings: FeedbackBindings
	readonly customMessageFeedbacks: CustomMessageFeedbacks
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

				const unsubscribe = context.reaper.transport.onPropertyChanged('isPlaying', () => {
					context.checkFeedback(evt.id)
				})

				AddBinding(context, evt.id, unsubscribe)
			},
			unsubscribe: (evt) => {
				const context = getContext()

				Unbind(context, evt.id)
			},
		},
		[FeedbackId.StopStatus]: undefined,
		[FeedbackId.RecordStatus]: undefined,
		[FeedbackId.RewindStatus]: undefined,
		[FeedbackId.ForwardStatus]: undefined,
		[FeedbackId.RepeatStatus]: undefined,
		[FeedbackId.ClickStatus]: undefined,
		[FeedbackId.CustomMessage]: {
			type: 'boolean',
			name: 'Change style based on a custom OSC message',
			description: 'Change style based on a custom OSC message',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 255, 0),
			},
			options: [
				{
					type: 'textinput',
					label: 'Message',
					id: 'msg',
					default: '/repeat',
					required: true,
				},
				{
					type: 'dropdown',
					label: 'Message Type',
					id: 'type',
					default: 'f',
					choices: [
						{ id: 'f', label: 'Number' },
						{ id: 's', label: 'String' },
					],
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '1',
					useVariables: true,
				},
			],
			callback: (evt) => {
				const context = getContext()

				const feedback = context.customMessageFeedbacks[evt.id]

				return feedback.getState()
			},
			subscribe: (evt, callbackCtx) => {
				const context = getContext()

				const state: CustomMessageState = { state: false }

				// TODO: create handler based on type
				// TODO: clear handlers on destroy
				// TODO: parse address - may need to make a custom handler implementation that takes a function for the address
				const handler = CustomFloatFeedbackHandler(
					() => getContext(),
					<string>evt.options.msg,
					<string>evt.options.value,
					(result) => {
						if (state.state === result) {
							return
						}

						state.state = result
						context.checkFeedback(evt.id)
					},
					async (value) => callbackCtx.parseVariablesInString(value)
				)

				context.customMessageFeedbacks[evt.id] = { handler: handler, getState: () => state.state }
			},
			unsubscribe: (evt) => {
				const context = getContext()

				delete context.customMessageFeedbacks[evt.id]
			},
		},
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

type CustomMessageState = { state: boolean }

function CustomFloatFeedbackHandler(
	getContext: () => FeedbackContext,
	address: string,
	value: string,
	callback: (state: boolean) => void,
	parseVariables: (value: string) => Promise<string>
): IMessageHandler {
	return new FloatMessageHandler(address, (messageValue) => {
		parseVariables(value).then(
			(expanded) => {
				const number = parseFloat(expanded)

				if (isNaN(number)) {
					getContext().log(
						'warn',
						`value was not a float: ${JSON.stringify({
							intitial_value: value,
							expanded: expanded,
							parsed: number.toString(),
						})}`
					)
					return
				}

				callback(number === messageValue)
			},
			(reason) => {
				// TODO:
				getContext().log('error', `error parsing variable for custom message feedback: ${reason}`)
			}
		)
	})
}

function AddBinding(context: FeedbackContext, feedbackId: string, unsubscribe: () => void) {
	context.bindings[feedbackId] = unsubscribe
}

function Unbind(context: FeedbackContext, feedbackId: string) {
	context.bindings[feedbackId]()
	delete context.bindings[feedbackId]
}
