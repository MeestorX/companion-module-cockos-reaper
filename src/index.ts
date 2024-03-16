import { EmptyUpgradeScript, InstanceBase, runEntrypoint, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, ReaperConfig } from './config'
import { GetPresetsList } from './presets'
import { GetFeedbacksList } from './feedback'
import { GetActionsList } from './actions'

class ControllerInstance extends InstanceBase<ReaperConfig> {
	private config: ReaperConfig

	constructor(internal: unknown) {
		super(internal)

		this.config = {}
	}

	public async init(config: ReaperConfig): Promise<void> {
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

		this.config = config

		await this.configUpdated(this.config)

		this.setPresetDefinitions(GetPresetsList())
		this.setFeedbackDefinitions(GetFeedbacksList())
		this.setActionDefinitions(GetActionsList())
	}

	public async configUpdated(config: ReaperConfig): Promise<void> {
		this.config = config
	}

	public getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	public async destroy(): Promise<void> {
		// TODO: implement
	}
}

runEntrypoint(ControllerInstance, [EmptyUpgradeScript])
