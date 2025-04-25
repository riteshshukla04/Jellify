import Client from '../../../api/client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import { Image } from 'expo-image'
import { getToken, getTokenValue, SizeTokens } from 'tamagui'

interface ImageProps {
	item: BaseItemDto
	circular?: boolean | undefined
	width?: SizeTokens | undefined
	height?: SizeTokens | undefined
}

export default function ItemImage({
	item,
	circular,
	width,
	height,
}: ImageProps): React.JSX.Element {
	return (
		<Image
			source={getImageApi(Client.api!).getItemImageUrlById(item.Id!)}
			style={{
				borderRadius: circular
					? width
						? width
						: getTokenValue('$12') + getToken('$5')
					: getTokenValue('$2'),
				width: width ? width : getToken('$12') + getToken('$5'),
				height: height ? height : getToken('$12') + getToken('$5'),
				alignSelf: 'center',
			}}
		/>
	)
}
