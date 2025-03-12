import * as readline from "readline"

const SIZE = 5
const N = SIZE * SIZE
const CHAR_CODE_A = "A".charCodeAt(0)

// Преобразует символ в координаты на панели 5×5
function getCoords(char: string): [number, number] {
	const index = char.toUpperCase().charCodeAt(0) - CHAR_CODE_A
	return [Math.floor(index / SIZE), index % SIZE]
}

// Преобразует координаты в символ
function getChar(x: number, y: number): string {
	return String.fromCharCode(CHAR_CODE_A + x * SIZE + y)
}

// Преобразует входную строку в матрицу состояний 5×5
function parseState(input: string): number[][] {
	const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
	for (const char of input) {
		const [x, y] = getCoords(char)
		board[x][y] = char === char.toLowerCase() ? 1 : 2
	}
	return board
}

// Создаёт матрицу воздействия M (размер 25×25)
// M[i][j] = 1, если нажатие клавиши j влияет на ячейку i (текущая и соседние по вертикали/горизонтали)
function createMoveMatrix(): number[][] {
	const M = Array.from({ length: N }, () => Array(N).fill(0))
	for (let i = 0; i < N; i++) {
		const x = Math.floor(i / SIZE)
		const y = i % SIZE
		// Влияние: текущая клавиша и её соседи
		const affected = [
			[x, y],
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1],
		]
		for (const [a, b] of affected) {
			if (a >= 0 && a < SIZE && b >= 0 && b < SIZE) {
				const idx = a * SIZE + b
				M[idx][i] = 1
			}
		}
	}
	return M
}

// Возвращает результат операции по модулю m (чтобы получить положительный остаток)
function mod(n: number, m: number): number {
	return ((n % m) + m) % m
}

// Решает систему линейных уравнений M*x = b по модулю 3 методом Гаусса
// Если решений нет, возвращает null
function solveSystem(M: number[][], b: number[]): number[] | null {
	// Копируем матрицы, чтобы не изменять исходные данные
	M = M.map((row) => row.slice())
	b = b.slice()
	const n = M.length // 25
	const m = M[0].length // 25
	const pivotPositions: number[] = Array(n).fill(-1)
	let row = 0
	for (let col = 0; col < m && row < n; col++) {
		// Ищем опорный элемент (pivot) в столбце
		let pivotRow = -1
		for (let r = row; r < n; r++) {
			if (M[r][col] !== 0) {
				pivotRow = r
				break
			}
		}
		if (pivotRow === -1) continue
		// Меняем местами текущую строку и строку с найденным pivot'ом
		if (pivotRow !== row) {
			;[M[row], M[pivotRow]] = [M[pivotRow], M[row]]
			;[b[row], b[pivotRow]] = [b[pivotRow], b[row]]
		}
		pivotPositions[row] = col
		// Нормализуем строку: домножаем на обратный элемент по модулю 3
		// В mod3: обратный для 1 равен 1, для 2 равен 2 (так как 2*2 = 4 ≡ 1)
		const inv = M[row][col] === 1 ? 1 : 2
		for (let j = col; j < m; j++) {
			M[row][j] = mod(M[row][j] * inv, 3)
		}
		b[row] = mod(b[row] * inv, 3)
		// Обнуляем столбец col для всех остальных строк
		for (let r = 0; r < n; r++) {
			if (r !== row && M[r][col] !== 0) {
				const factor = M[r][col]
				for (let j = col; j < m; j++) {
					M[r][j] = mod(M[r][j] - factor * M[row][j], 3)
				}
				b[r] = mod(b[r] - factor * b[row], 3)
			}
		}
		row++
	}
	// Проверка на совместимость: если есть строка, где все коэффициенты равны 0, а свободный член не равен 0, решений нет
	for (let r = row; r < n; r++) {
		let allZero = true
		for (let j = 0; j < m; j++) {
			if (M[r][j] !== 0) {
				allZero = false
				break
			}
		}
		if (allZero && b[r] !== 0) return null
	}
	// Назначаем свободным переменным значение 0 и выполняем обратную подстановку
	const x = Array(m).fill(0)
	for (let i = row - 1; i >= 0; i--) {
		const col = pivotPositions[i]
		let sum = 0
		for (let j = col + 1; j < m; j++) {
			sum = mod(sum + M[i][j] * x[j], 3)
		}
		x[col] = mod(b[i] - sum, 3)
	}
	return x
}

// Основная функция поиска решения
function findSolution(initialBoard: number[][]): string {
	// Формируем вектор b длины 25, где для каждой ячейки: initial state + M*x = 0 mod3
	// => требуем b = -initial mod3
	const b: number[] = []
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			b.push(mod(-initialBoard[i][j], 3))
		}
	}
	const M = createMoveMatrix()
	const solution = solveSystem(M, b)
	if (solution === null) return "IMPOSSIBLE"
	// Формируем строку результата:
	// Если x[i] == 1 → клавиша нажата один раз → выводим в нижнем регистре;
	// Если x[i] == 2 → клавиша нажата дважды → выводим в верхнем регистре.
	const moves: string[] = []
	for (let idx = 0; idx < solution.length; idx++) {
		const letter = String.fromCharCode(CHAR_CODE_A + idx)
		if (solution[idx] === 1) {
			moves.push(letter.toLowerCase())
		} else if (solution[idx] === 2) {
			moves.push(letter.toUpperCase())
		}
	}
	// Сортировка результата по алфавиту (без учёта регистра)
	moves.sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()))
	return moves.join("")
}

// Чтение входных данных
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.question("Введите строку", (input) => {
	const board = parseState(input.trim())
	const result = findSolution(board)
	console.log(result)
	rl.close()
})
