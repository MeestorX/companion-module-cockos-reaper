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
import { Reaper, ReaperConfiguration } from 'reaper-osc'

class ControllerInstance extends InstanceBase<ModuleConfig> {
	private reaper: Reaper | null

	constructor(internal: unknown) {
		super(internal)

		this.reaper = null
	}

	public async init(config: ModuleConfig): Promise<void> {
		/**
 * 
 * 	var self = this;
	self.status(self.STATE_OK); // report status ok!
	self.init_presets();
	self.init_variables();
	self.init_feedbacks();
	self.init_osc();
	debug = self.debug;
	log   = self.log;

	if (self.config.refreshOnInit) {
		debug("Sending control surface refresh action to " + self.config.host);
		self.system.emit('osc_send', self.config.host, self.config.port, '/action/41743');
	}
 */

		await this.configUpdated(config)

		this.setPresetDefinitions(GetPresetsList())
		this.setFeedbackDefinitions(GetFeedbacksList())
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.setActionDefinitions(
			GetActionsList(() => ({ reaper: this.reaper!, log: (level, message) => this.log(level, message) }))
		)
	}

	public async configUpdated(config: ModuleConfig): Promise<void> {
		if (this.reaper !== null) {
			this.reaper.stopOsc()
			this.updateStatus(InstanceStatus.Disconnected)
		}

		const reaperConfig = new ReaperConfiguration()

		reaperConfig.localAddress = '0.0.0.0'
		reaperConfig.remoteAddress = config.host
		reaperConfig.localPort = config.feedbackPort
		reaperConfig.remotePort = config.port

		this.reaper = new Reaper(reaperConfig)

		this.updateStatus(InstanceStatus.Connecting)

		this.reaper.onReady(() => {
			this.updateStatus(InstanceStatus.Ok)

			if (config.refreshOnInit) {
				this.reaper?.refreshControlSurfaces()
			}
		})

		this.reaper.startOsc()
	}

	public getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	public async destroy(): Promise<void> {
		// TODO: implement
	}
}

// TODO: upgrade scripts
runEntrypoint(ControllerInstance, [EmptyUpgradeScript])
