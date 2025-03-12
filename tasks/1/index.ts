import * as readline from "readline"

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.question("Введите слово: ", (word: string) => {
	console.log(isDigitalWord(word))
	rl.close()
})

function isDigitalWord(word: string): string {
	if (word.length > 15) {
		return "Вы превысили максимальное количество символов"
	}
	const numbers = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"]

	for (const number of numbers) {
		let index = 0
		for (const char of word) {
			if (char === number[index]) {
				index++
				if (index === number.length) {
					return number
				}
			}
		}
	}

	return "NO"
}
