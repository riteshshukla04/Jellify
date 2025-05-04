import { TabBarTemplate } from 'react-native-carplay'
import CarPlayHome from './Home'
import CarPlayDiscover from './Discover'
import uuid from 'react-native-uuid'
import { Api } from '@jellyfin/sdk'
import { JellifyUser } from '../../types/JellifyUser'

const CarPlayNavigation = (api: Api, user: JellifyUser, sessionId: string) =>
	new TabBarTemplate({
		id: uuid.v4(),
		title: 'Tabs',
		templates: [CarPlayHome(api, user, sessionId), CarPlayDiscover],
		onTemplateSelect(template, e) {},
	})

export default CarPlayNavigation
