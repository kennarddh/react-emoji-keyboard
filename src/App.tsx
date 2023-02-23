import Emoji from 'Constants/Emoji'
import { FC, useCallback, useState, ChangeEvent, useEffect } from 'react'

const App: FC = () => {
	const [Text, SetText] = useState<string>('')
	const [LastUsed, SetLastUsed] = useState<string[]>(() => {
		return JSON.parse(localStorage.getItem('lastUsedEmojis') ?? '[]') ?? []
	})

	const OnInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const replaceResult = event.target.value.replaceAll(
			/(:[^:]+:)/gi,
			name => {
				const emojiName = name.slice(1, -1).toLowerCase()

				const findResult = Emoji.find(
					({ name }) => name === emojiName
				)?.emoji

				if (findResult) {
					SetLastUsed(prev => {
						if (prev.includes(emojiName)) return prev

						const newPrev = [...prev]

						if (prev.length === 10) {
							newPrev.shift()
						}

						newPrev.push(emojiName)

						return newPrev
					})
				}

				return findResult ?? name
			}
		)

		SetText(replaceResult)
	}, [])

	useEffect(() => {
		localStorage.setItem('lastUsedEmojis', JSON.stringify(LastUsed))
	}, [LastUsed])

	return (
		<div>
			<input
				type='text'
				placeholder='Type :x:'
				value={Text}
				onChange={OnInput}
			/>
			<div>
				<h3>Last used emojis</h3>
				{LastUsed.map(emojiName => (
					<ol key={emojiName}>
						<li>
							<p>
								{
									Emoji.find(({ name }) => emojiName === name)
										?.emoji
								}{' '}
								{emojiName}
							</p>
						</li>
					</ol>
				))}
			</div>
		</div>
	)
}

export default App
