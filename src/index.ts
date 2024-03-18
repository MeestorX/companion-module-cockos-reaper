import {
	CompanionVariableDefinition,
	CompanionVariableValues,
	EmptyUpgradeScript,
	InstanceBase,
	InstanceStatus,
	runEntrypoint,
	SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, ModuleConfig } from './config'
import { GetPresetsList } from './presets'
import { GetFeedbacksList } from './feedback'
import { GetActionsList } from './actions'
import { OscMessage, Reaper, ReaperConfiguration } from 'reaper-osc'
import { GetVariableDefinitions, ReaperProperty } from './variables'

class ControllerInstance extends InstanceBase<ModuleConfig> {
	private _reaper: Reaper | null

	constructor(internal: unknown) {
		super(internal)

		this._reaper = null
	}

	public async init(config: ModuleConfig): Promise<void> {
		await this.configUpdated(config)

		this.setActionDefinitions(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			GetActionsList(() => ({ reaper: this._reaper!, log: (level, message) => this.log(level, message) }))
		)

		this.setPresetDefinitions(GetPresetsList())
		this.setFeedbackDefinitions(GetFeedbacksList())
	}

	public async configUpdated(config: ModuleConfig): Promise<void> {
		if (this._reaper !== null) {
			this.disconnectOsc()
		}

		const reaperConfig = new ReaperConfiguration()

		// Listener
		reaperConfig.localAddress = '0.0.0.0'
		reaperConfig.localPort = config.feedbackPort

		// Reaper
		reaperConfig.remoteAddress = config.host
		reaperConfig.remotePort = config.port

		reaperConfig.afterMessageReceived = (message, handled) => {
			this.afterMessageReceived(message, handled)
		}

		this._reaper = new Reaper(reaperConfig)

		this.bindVariables(
			this._reaper,
			(variables: CompanionVariableDefinition[]) => this.setVariableDefinitions(variables),
			(values: CompanionVariableValues) => this.setVariableValues(values)
		)

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
		this.disconnectOsc()
	}

	private afterMessageReceived: (message: OscMessage, handled: boolean) => void = () => {
		// TODO: implement handlers for custom feedbacks
		this.checkFeedbacks()
	}

	private async connectOsc(): Promise<void> {
		if (this._reaper === null) {
			this.log('error', 'Reaper is not configured')
			return
		}

		const promise = new Promise<void>((resolve) => {
			this.updateStatus(InstanceStatus.Connecting)

			this._reaper?.onReady(() => {
				this.log('info', 'Ready to receive messages from Reaper')

				this.updateStatus(InstanceStatus.Ok)
				resolve()
			})

			this._reaper?.startOsc()
		})

		return promise
	}

	private disconnectOsc() {
		if (this._reaper === null) {
			return
		}

		this._reaper?.stopOsc()
		this.updateStatus(InstanceStatus.Disconnected)
		this.log('info', 'Stopped listening to Reaper')
	}

	private bindVariables(
		reaper: Reaper,
		setVariableDefinitions: (variables: CompanionVariableDefinition[]) => void,
		setVariableValues: (values: CompanionVariableValues) => void
	): void {
		const variables = GetVariableDefinitions()

		setVariableDefinitions(variables)

		const variableValues: CompanionVariableValues = {}

		variables.forEach((variable) => {
			const property = variable.getProperty(reaper)

			// Bind the variable to the property
			property.item.onPropertyChanged(property.property, () => {
				setVariableValues({
					[variable.variableId]: this.getCurrentVariableValue(property, variable.valueConverter),
				})
			})

			// Set initial value
			variableValues[variable.variableId] = this.getCurrentVariableValue(property, variable.valueConverter)
		})

		setVariableValues(variableValues)
	}

	private getCurrentVariableValue(property: ReaperProperty, valueConverter?: (value: any) => any) {
		let value = property.valueSelector(property.item)

		if (valueConverter) {
			value = valueConverter(value)
		}

		return value
	}
}

// TODO: upgrade scripts
runEntrypoint(ControllerInstance, [EmptyUpgradeScript])
