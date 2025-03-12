import * as readline from "readline"

type State = number[]
type Step = { state: State; steps: number }

function minStepsToMeasure(n: number, target: number, capacities: number[]): number {
	const queue: Step[] = [{ state: new Array(n).fill(0), steps: 0 }]
	const visited = new Set<string>()

	while (queue.length > 0) {
		const { state, steps } = queue.shift()!
		const stateKey = state.join(",")

		if (state.includes(target) || state.reduce((sum, v) => sum + v, 0) === target) {
			return steps
		}
		if (visited.has(stateKey)) continue
		visited.add(stateKey)

		for (let i = 0; i < n; i++) {
			// Наполнить кастрюлю до краев
			const fill = [...state]
			fill[i] = capacities[i]
			queue.push({ state: fill, steps: steps + 1 })

			// Вылить кастрюлю
			const empty = [...state]
			empty[i] = 0
			queue.push({ state: empty, steps: steps + 1 })

			// Переливание воды
			for (let j = 0; j < n; j++) {
				if (i !== j) {
					const pour = [...state]
					const pourAmount = Math.min(state[i], capacities[j] - state[j])
					pour[i] -= pourAmount
					pour[j] += pourAmount
					queue.push({ state: pour, steps: steps + 1 })
				}
			}
		}
	}
	return -1
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question("Введите количество кастрюль, требуемый объем и размеры кастрюль через пробел: ", (input) => {
	const [nStr, targetStr, ...capacitiesStr] = input.split(" ")
	const n = parseInt(nStr)
	if (n > 3) {
		console.log("Превышен лимит кастрюль")
		rl.close()
		return
	}
	const target = parseInt(targetStr)
	if (target > 250) {
		console.log("Превышен объем")
		rl.close()
		return
	}
	const capacities = capacitiesStr.map(Number)
	if (capacities.some((n) => n > 250)) {
		console.log("Превышен объем одной из кастрюли")
		rl.close()
		return
	}
	if (n !== capacities.length) {
		console.log("Количество кастрюль не соответствует их объемам")
		rl.close()
		return
	}

	if (capacities.reduce((sum, v) => sum + v, 0) >= target) {
		const result = minStepsToMeasure(n, target, capacities)
		console.log(result === -1 ? "Невозможно отмерить" : `Минимальное число шагов: ${result}`)
	} else {
		console.log("Невозможно отмерить")
	}
	rl.close()
	return
})
