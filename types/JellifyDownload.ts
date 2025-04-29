import { JellifyTrack } from './JellifyTrack'

export type JellifyDownload = JellifyTrack & {
	savedAt: string
	isAutoDownloaded: boolean

	/**
	 * Path to the downloaded file
	 *
	 * This can be undefined as it wasn't being
	 * stored originally - so this preverves
	 * backwards compatibility
	 */
	path: string | undefined
}
