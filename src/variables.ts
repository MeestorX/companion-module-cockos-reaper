import { CompanionVariableDefinition } from '@companion-module/base'
import { Reaper, Track, Transport } from 'reaper-osc'
import { INotifyPropertyChanged } from 'reaper-osc'

export type ReaperProperty = {
	item: INotifyPropertyChanged
	property: string
	valueSelector: (item: any) => any
}

export type ReaperPropertyVariableDefinition = {
	getProperty: (reaper: Reaper) => ReaperProperty
	valueConverter?: (value: any) => any
} & CompanionVariableDefinition

export function GetVariableDefinitions(): ReaperPropertyVariableDefinition[] {
	const variables: ReaperPropertyVariableDefinition[] = []

	variables.push(...LegacyVariableDefinitions())

	return variables
}

function LegacyVariableDefinitions(): ReaperPropertyVariableDefinition[] {
	const variables: ReaperPropertyVariableDefinition[] = [
		{
			variableId: 'playStatus',
			name: 'Play Status',
			getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, 'isPlaying'),
			valueConverter: (value) => (value ? 'Playing' : 'Paused'),
		},
		{
			variableId: 'stopStatus',
			name: 'Stopped Status',
			getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, 'isStopped'),
			valueConverter: (value) => (value ? 'Stopped' : 'Playing'),
		},
		{
			variableId: 'recordStatus',
			name: 'Record Status',
			getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, 'isRecording'),
			valueConverter: (value) => (value ? 'Recording' : 'Not Recording'),
		},
		{
			variableId: 'rewindStatus',
			name: 'Rewind Status',
			getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, 'isRewinding'),
			valueConverter: (value) => (value ? 'Rewinding' : 'Not Rewinding'),
		},
		{
			variableId: 'forwardStatus',
			name: 'Fast Forward Status',
			getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, 'isFastForwarding'),
			valueConverter: (value) => (value ? 'Fast Forwarding' : 'Not Fast Forwarding'),
		},
		{
			variableId: 'repeatStatus',
			name: 'Repeat Status',
			getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, 'isRepeatEnabled'),
			valueConverter: (value) => (value ? 'Active' : 'Inactive'),
		},
		{
			variableId: 'clickStatus',
			name: 'Click Status',
			getProperty: NotifyPropertySelector<Reaper>((reaper) => reaper, 'isMetronomeEnabled'),
			valueConverter: (value) => (value ? 'Active' : 'Inactive'),
		},
	]

	for (let i = 0; i < 8; i++) {
		const trackVariables = LegacyTrackVariables(i)

		variables.push(...trackVariables)
	}

	return variables
}

function LegacyTrackVariables(trackIndex: number): ReaperPropertyVariableDefinition[] {
	const trackNumber = trackIndex + 1

	// TODO: FX variables

	return [
		{
			variableId: LegacyTrackVariableId(trackNumber, 'Mute'),
			name: LegacyTrackVariableName(trackNumber, 'Muted'),
			getProperty: NotifyPropertySelector<Track>((reaper) => reaper.tracks[trackIndex], 'isMuted'),
			valueConverter: (value) => (value ? 'Muted' : 'Not Muted'),
		},
		{
			variableId: LegacyTrackVariableId(trackNumber, 'Solo'),
			name: LegacyTrackVariableName(trackNumber, 'Soloed'),
			getProperty: NotifyPropertySelector<Track>((reaper) => reaper.tracks[trackIndex], 'isSoloed'),
			valueConverter: (value) => (value ? 'Soloed' : 'Not Soloed'),
		},
		{
			variableId: LegacyTrackVariableId(trackNumber, 'Recarm'),
			name: LegacyTrackVariableName(trackNumber, 'Armed for Record'),
			getProperty: NotifyPropertySelector<Track>((reaper) => reaper.tracks[trackIndex], 'isRecordArmed'),
			valueConverter: (value) => (value ? 'Record Armed' : 'Record Disarmed'),
		},
		{
			variableId: LegacyTrackVariableId(trackNumber, 'Select'),
			name: LegacyTrackVariableName(trackNumber, 'Selected'),
			getProperty: NotifyPropertySelector<Track>((reaper) => reaper.tracks[trackIndex], 'isSelected'),
			valueConverter: (value) => (value ? 'Selected' : 'Not Selected'),
		},
		{
			variableId: LegacyTrackVariableId(trackNumber, 'Name'),
			name: LegacyTrackVariableName(trackNumber, 'Name'),
			getProperty: NotifyPropertySelector<Track>((reaper) => reaper.tracks[trackIndex], 'name'),
		},
		{
			variableId: LegacyTrackVariableId(trackNumber, 'Monitor'),
			name: LegacyTrackVariableName(trackNumber, 'Monitoring'),
			getProperty: NotifyPropertySelector<Track>((reaper) => reaper.tracks[trackIndex], 'recordMonitoring'),
			valueConverter: (value) => (value ? 'Monitoring' : 'Not Monitoring'),
		},
	]
}

function LegacyTrackVariableId(trackNumber: number, id: string): string {
	return `track${trackNumber}${id}`
}

function LegacyTrackVariableName(trackNumber: number, name: string): string {
	return `Track ${trackNumber} ${name}`
}

function NotifyPropertySelector<T extends INotifyPropertyChanged>(
	selector: (reaper: Reaper) => T,
	propertyName: keyof T & string
): (reaper: Reaper) => {
	item: T
	property: keyof T & string
	valueSelector: (item: T) => T[keyof T & string]
} {
	return (reaper: Reaper) => ({
		item: selector(reaper),
		property: propertyName,
		valueSelector: (item: T) => item[propertyName],
	})
}
