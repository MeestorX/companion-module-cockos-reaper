import {
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

class ControllerInstance extends InstanceBase<ModuleConfig> {
	private reaper: Reaper | null

	constructor(internal: unknown) {
		super(internal)

		this.reaper = null
	}

	public async init(config: ModuleConfig): Promise<void> {
		await this.configUpdated(config)

		this.setActionDefinitions(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			GetActionsList(() => ({ reaper: this.reaper!, log: (level, message) => this.log(level, message) }))
		)

		this.setPresetDefinitions(GetPresetsList())
		this.setFeedbackDefinitions(GetFeedbacksList())

		// this.setVariableDefinitions()
	}

	public async configUpdated(config: ModuleConfig): Promise<void> {
		if (this.reaper !== null) {
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

		this.reaper = new Reaper(reaperConfig)

		this.log('debug', `Reaper Configuration: ${JSON.stringify(reaperConfig, null, 2)}`)

		await this.connectOsc()

		if (config.refreshOnInit) {
			this.log('info', 'Refreshing OSC values')
			this.reaper.refreshControlSurfaces()
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
		if (this.reaper === null) {
			this.log('error', 'Reaper is not configured')
			return
		}

		const promise = new Promise<void>((resolve) => {
			this.updateStatus(InstanceStatus.Connecting)

			this.reaper?.onReady(() => {
				this.log('info', 'Ready to receive messages from Reaper')

				this.updateStatus(InstanceStatus.Ok)
				resolve()
			})

			this.reaper?.startOsc()
		})

		return promise
	}

	private disconnectOsc() {
		if (this.reaper === null) {
			return
		}

		this.reaper?.stopOsc()
		this.updateStatus(InstanceStatus.Disconnected)
		this.log('info', 'Stopped listening to Reaper')
	}
}

// TODO: upgrade scripts
runEntrypoint(ControllerInstance, [EmptyUpgradeScript])
