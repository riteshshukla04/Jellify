import _ from 'lodash'

export function validateServerUrl(serverUrl: string | undefined) {
	if (!_.isEmpty(serverUrl)) {
		// Parse
		return true
	}

	return false
}
