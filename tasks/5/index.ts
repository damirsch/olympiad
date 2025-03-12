import * as fs from "fs"
import * as readline from "readline"

// Интерфейс прямоугольника
interface Rectangle {
	left: number
	top: number
	right: number
	bottom: number
}

// Функция парсинга строки в прямоугольник
function parseRectangle(line: string): Rectangle | null {
	const parts = line.trim().split(/\s+/).map(Number)
	if (parts.length !== 4 || parts.some(isNaN)) return null

	const [x1, y1, x2, y2] = parts

	const left = Math.min(x1, x2)
	const right = Math.max(x1, x2)
	const top = Math.max(y1, y2)
	const bottom = Math.min(y1, y2)

	return { left, top, right, bottom }
}

// Функция вычисления пересечения всех прямоугольников
function getIntersectionArea(rectangles: Rectangle[]): number {
	if (rectangles.length === 0) return 0

	let intersectLeft = rectangles[0].left
	let intersectRight = rectangles[0].right
	let intersectTop = rectangles[0].top
	let intersectBottom = rectangles[0].bottom

	for (let i = 1; i < rectangles.length; i++) {
		const rect = rectangles[i]
		intersectLeft = Math.max(intersectLeft, rect.left)
		intersectRight = Math.min(intersectRight, rect.right)
		intersectTop = Math.min(intersectTop, rect.top)
		intersectBottom = Math.max(intersectBottom, rect.bottom)
	}

	const width = intersectRight - intersectLeft
	const height = intersectTop - intersectBottom

	if (width <= 0 || height <= 0) return 0

	return width * height
}

// Основная функция
async function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	const ask = (question: string): Promise<string> => new Promise((resolve) => rl.question(question, resolve))

	const nInput = await ask("Введите количество прямоугольников (N): ")
	rl.close()

	const N = parseInt(nInput)
	if (isNaN(N) || N <= 0) {
		console.error("Ошибка: введено некорректное число.")
		return
	}

	let lines: string[]
	try {
		lines = fs
			.readFileSync("RECT.TXT", "utf-8")
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0)
	} catch {
		console.error("Ошибка при чтении файла RECT.TXT")
		return
	}

	if (lines.length < N) {
		console.error(`Ошибка: в файле RECT.TXT только ${lines.length} строк, а требуется ${N}.`)
		return
	}

	const rectangles: Rectangle[] = []
	for (let i = 0; i < N; i++) {
		const rect = parseRectangle(lines[i])
		if (!rect) {
			console.error(`Ошибка: некорректные данные в строке ${i + 1}: "${lines[i]}"`)
			return
		}
		rectangles.push(rect)
	}

	const area = getIntersectionArea(rectangles)
	console.log(`Суммарная площадь пересечения: ${area}`)
}

main()
