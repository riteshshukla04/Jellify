import _ from 'lodash'
import { JellifyTrack } from '../../types/JellifyTrack'

export function buildNewQueue(
	existingQueue: JellifyTrack[],
	tracksToInsert: JellifyTrack[],
	insertIndex: number,
) {
	console.debug(`Building new queue`)

	let newQueue: JellifyTrack[] = []

	if (_.isEmpty(existingQueue)) newQueue = tracksToInsert
	else {
		newQueue = _.cloneDeep(existingQueue).splice(insertIndex, 0, ...tracksToInsert)
	}

	console.debug(`Built new queue of ${newQueue.length} items`)

	return newQueue
}
