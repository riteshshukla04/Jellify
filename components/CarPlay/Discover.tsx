import { ListTemplate } from 'react-native-carplay'
import uuid from 'react-native-uuid'

const CarPlayDiscover = new ListTemplate({
	id: uuid.v4(),
	tabTitle: 'Discover',
	tabSystemImageName: 'globe',
})

export default CarPlayDiscover
