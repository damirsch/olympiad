import * as fs from "fs"

interface Coin {
	value: number
	weight: number
}

function minCoinsForValueAndWeight(coins: Coin[], V: number, W: number): number {
	const dp: number[][] = Array(V + 1)
		.fill(null)
		.map(() => Array(W + 1).fill(Infinity))
	dp[0][0] = 0

	for (let v = 0; v <= V; v++) {
		for (let w = 0; w <= W; w++) {
			if (dp[v][w] !== Infinity) {
				for (const coin of coins) {
					const newV = v + coin.value
					const newW = w + coin.weight
					if (newV <= V && newW <= W) {
						dp[newV][newW] = Math.min(dp[newV][newW], dp[v][w] + 1)
					}
				}
			}
		}
	}

	return dp[V][W] === Infinity ? 0 : dp[V][W]
}

function solveCoinProblem(filename: string): void {
	const input = fs.readFileSync(filename, "utf-8").trim().split("\n")
	console.log(input)
	const [N, V, W] = input[0].split(" ").map(Number)
	const coins: Coin[] = input.slice(1, N + 1).map((line) => {
		const [value, weight] = line.split(" ").map(Number)
		return { value, weight }
	})
	const result = minCoinsForValueAndWeight(coins, V, W)
	console.log(result)
}

solveCoinProblem("COIN_2.TXT")
