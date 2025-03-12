"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function minCoinsForValueAndWeight(coins, V, W) {
    const dp = Array(V + 1)
        .fill(null)
        .map(() => Array(W + 1).fill(Infinity));
    dp[0][0] = 0;
    for (let v = 0; v <= V; v++) {
        for (let w = 0; w <= W; w++) {
            if (dp[v][w] !== Infinity) {
                for (const coin of coins) {
                    const newV = v + coin.value;
                    const newW = w + coin.weight;
                    if (newV <= V && newW <= W) {
                        dp[newV][newW] = Math.min(dp[newV][newW], dp[v][w] + 1);
                    }
                }
            }
        }
    }
    return dp[V][W] === Infinity ? 0 : dp[V][W];
}
function solveCoinProblem(filename) {
    const input = fs.readFileSync(filename, "utf-8").trim().split("\n");
    console.log(input);
    const [N, V, W] = input[0].split(" ").map(Number);
    const coins = input.slice(1, N + 1).map((line) => {
        const [value, weight] = line.split(" ").map(Number);
        return { value, weight };
    });
    const result = minCoinsForValueAndWeight(coins, V, W);
    console.log(result);
}
solveCoinProblem("COIN_2.TXT");
