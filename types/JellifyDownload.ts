import { JellifyTrack } from './JellifyTrack'

export type JellifyDownload = JellifyTrack & {
	savedAt: string
	isAutoDownloaded: boolean
}
