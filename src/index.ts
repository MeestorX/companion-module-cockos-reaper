/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	CompanionVariableValues,
	EmptyUpgradeScript,
	InstanceBase,
	InstanceStatus,
	runEntrypoint,
	SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, ModuleConfig } from './config'
import { GetPresetsList } from './presets'
import { CustomMessageFeedbacks, FeedbackBindings, GetFeedbacksList } from './feedback'
import { GetActionsList } from './actions'
import { LogLevel, OscMessage, Reaper, ReaperConfiguration } from 'reaper-osc'
import { GetVariableDefinitions, ReaperProperty } from './variables'

class ControllerInstance extends InstanceBase<ModuleConfig> {
	private _reaper: Reaper | null
	private _unsubscribeVariables: Unsubscribe[] = []
	private _feedbackBindings: FeedbackBindings = {}
	private _customMessageFeedbacks: CustomMessageFeedbacks = {}

	constructor(internal: unknown) {
		super(internal)

		this._reaper = null
	}

	public async init(config: ModuleConfig): Promise<void> {
		await this.configUpdated(config)

		this.setActionDefinitions(
			GetActionsList(() => ({ reaper: this._reaper!, log: (level, message) => this.log(level, message) }))
		)

		this.setPresetDefinitions(GetPresetsList())
		this.setFeedbackDefinitions(
			GetFeedbacksList(() => ({
				reaper: this._reaper!,
				log: (level, message) => this.log(level, message),
				checkFeedback: (feedbackId) => this.checkFeedbacksById(feedbackId),
				bindings: this._feedbackBindings,
				customMessageFeedbacks: this._customMessageFeedbacks,
			}))
		)
	}

	public async configUpdated(config: ModuleConfig): Promise<void> {
		if (this._reaper !== null) {
			await this.disconnectOsc()
			this.unbindVariables()
			this.unbindFeedbacks()
		}

		const reaperConfig = new ReaperConfiguration()

		// Listener
		reaperConfig.localAddress = '0.0.0.0'
		reaperConfig.localPort = config.feedbackPort

		// Reaper
		reaperConfig.remoteAddress = config.host
		reaperConfig.remotePort = config.port

		reaperConfig.afterMessageReceived = (message, handled) => {
console.log('OSC Message received: ', message)
			this.handleCustomMessages(message, handled)
		}

		this._reaper = new Reaper(reaperConfig)

		this.bindVariables()

		this.log('debug', `Reaper Configuration: ${JSON.stringify(reaperConfig, null, 2)}`)

		await this.connectOsc()

		if (config.refreshOnInit) {
			this.log('info', 'Refreshing OSC values')
			this._reaper.refreshControlSurfaces()
		}
	}

	public getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	public async destroy(): Promise<void> {
		await this.disconnectOsc()
		this.unbindVariables()
		this.unbindFeedbacks()
	}

	private handleCustomMessages(message: OscMessage, _: boolean) {
		Object.values(this._customMessageFeedbacks).forEach((feedback) => {
			feedback.handler.handle(message)
		})
	}

	private async connectOsc() {
		if (this._reaper === null) {
			this.log('error', 'Reaper is not configured')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		await this._reaper.start()

		this.updateStatus(InstanceStatus.Ok)
	}

	private async disconnectOsc() {
		if (this._reaper === null) {
			return
		}

		await this._reaper.stop()
		this.updateStatus(InstanceStatus.Disconnected)
		this.log('info', 'Stopped listening to Reaper')
	}

	private unbindFeedbacks(): void {
		const bindings = this._feedbackBindings

		for (const entry of Object.entries(bindings)) {
			entry[1]()
			delete bindings[entry[0]]
		}
	}

	private bindVariables(): void {
		const variables = GetVariableDefinitions()

		const unsubscribes: Unsubscribe[] = []

		this.setVariableDefinitions(variables)

		const variableValues: CompanionVariableValues = {}

		variables.forEach((variable) => {
			const property = variable.getProperty(this._reaper!)

			// Bind the variable to the property
			const unsub = property.item.onPropertyChanged(property.property, () => {
				this.setVariableValues({
					[variable.variableId]: this.getCurrentVariableValue(property, variable.valueConverter),
				})
			})

			unsubscribes.push(unsub)

			// Set initial value
			variableValues[variable.variableId] = this.getCurrentVariableValue(property, variable.valueConverter)
		})

		this.setVariableValues(variableValues)

		this._unsubscribeVariables = unsubscribes
	}

	private unbindVariables(): void {
		const unsubscribes = this._unsubscribeVariables
		this._unsubscribeVariables = []

		unsubscribes.forEach((element) => {
			element()
		})
	}

	private getCurrentVariableValue(property: ReaperProperty, valueConverter?: (value: any) => any) {
		let value = property.valueSelector(property.item)

		if (valueConverter) {
			value = valueConverter(value)
		}

		return value
	}
}

export interface ModuleContext {
	readonly reaper: Reaper
	readonly log: (level: LogLevel, message: string) => void
}

type Unsubscribe = () => void

// TODO: upgrade scripts
runEntrypoint(ControllerInstance, [EmptyUpgradeScript])
