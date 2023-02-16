import Emoji from 'Constants/Emoji'
import { FC, useCallback, useState, ChangeEvent } from 'react'

const App: FC = () => {
	const [Text, SetText] = useState<string>('')

	const OnInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		SetText(
			event.target.value.replaceAll(/(:[^:]+:)/gi, name => {
				const emojiName = name.slice(1, -1)
				console.log({ emojiName, name })

				return (
					Emoji.find(({ name }) => name === emojiName)?.emoji ?? name
				)
			})
		)
	}, [])

	return (
		<div>
			<input
				type='text'
				placeholder='Type :x:'
				value={Text}
				onChange={OnInput}
			/>
		</div>
	)
}

export default App
