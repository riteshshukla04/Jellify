import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import FavoriteButton from '../Global/components/favorite-button'
import { ArtistProvider } from './provider'
import ArtistNavigation from './navigation'

export function ArtistScreen({
	route,
	navigation,
}: {
	route: RouteProp<StackParamList, 'Artist'>
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { artist } = route.params

	navigation.setOptions({
		headerRight: () => {
			return <FavoriteButton item={artist} />
		},
	})

	return (
		<ArtistProvider artist={artist}>
			<ArtistNavigation />
		</ArtistProvider>
	)
}
