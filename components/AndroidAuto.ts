import { CarPlay } from 'react-native-carplay'

import { ListTemplate } from 'react-native-carplay'
import CarPlayNavigation from './CarPlay/Navigation'

export function AndroidAutoModule() {
	const sections = Array.from({ length: 26 }).map((_, i) => ({
		header: `Header ${String.fromCharCode(97 + i).toLocaleUpperCase()}`,
		items: Array.from({ length: 3 }).map((_, j) => ({
			text: `Item ${j + 1}`,
		})),
		sectionIndexTitle: String.fromCharCode(97 + i).toLocaleUpperCase(),
	}))
	const listTemplate = new ListTemplate({
		sections,
		title: 'List Template',
		async onItemSelect(e) {
			const { index } = e
			console.log(index)
		},
	})

	CarPlay.emitter.addListener('didConnect', () => {
		CarPlay.setRootTemplate(listTemplate)

		// console.log('AndroidAutoModule',menuTemplate);
	})
	CarPlay.emitter.addListener('backButtonPressed', () => {
		CarPlay.popTemplate()
	})
	return
}
