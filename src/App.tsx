import Emoji from 'Constants/Emoji'
import {
	FC,
	useCallback,
	useState,
	ChangeEvent,
	useEffect,
	useRef,
} from 'react'

const App: FC = () => {
	const [Text, SetText] = useState<string>('')
	const [LastUsed, SetLastUsed] = useState<string[]>(() => {
		return JSON.parse(localStorage.getItem('lastUsedEmojis') ?? '[]') ?? []
	})
	const [TargetIndex, SetTargetIndex] = useState<number>(0)

	const InputRef = useRef<HTMLInputElement>(null)

	const OnInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		let index = -1

		const replaceResult = event.target.value.replaceAll(
			/(:[^:]+:)/gi,
			name => {
				index = event.target.value.indexOf(name)

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
		SetTargetIndex(index)
	}, [])

	useEffect(() => {
		localStorage.setItem('lastUsedEmojis', JSON.stringify(LastUsed))
	}, [LastUsed])

	useEffect(() => {
		if (TargetIndex === -1) {
			InputRef.current?.setSelectionRange(
				InputRef.current.value.length,
				InputRef.current.value.length
			)

			return
		}

		InputRef.current?.setSelectionRange(TargetIndex + 1, TargetIndex + 1)
	}, [TargetIndex])

	return (
		<div>
			<input
				type='text'
				placeholder='Type :x:'
				value={Text}
				onChange={OnInput}
				ref={InputRef}
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
