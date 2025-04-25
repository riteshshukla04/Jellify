import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CheckboxProps, XStack, Checkbox, Label } from 'tamagui'

export function CheckboxWithLabel({
	size,
	label = 'Toggle',
	...checkboxProps
}: CheckboxProps & { label?: string }) {
	const id = `checkbox-${(size || '').toString().slice(1)}`
	return (
		<XStack width={150} alignItems='center' gap='$4'>
			<Checkbox id={id} size={size} {...checkboxProps}>
				<Checkbox.Indicator>
					<Icon name='check' />
				</Checkbox.Indicator>
			</Checkbox>

			<Label size={size} htmlFor={id}>
				{label}
			</Label>
		</XStack>
	)
}
