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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
// Функция парсинга строки в прямоугольник
function parseRectangle(line) {
    const parts = line.trim().split(/\s+/).map(Number);
    if (parts.length !== 4 || parts.some(isNaN))
        return null;
    const [x1, y1, x2, y2] = parts;
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const top = Math.max(y1, y2);
    const bottom = Math.min(y1, y2);
    return { left, top, right, bottom };
}
// Функция вычисления пересечения всех прямоугольников
function getIntersectionArea(rectangles) {
    if (rectangles.length === 0)
        return 0;
    let intersectLeft = rectangles[0].left;
    let intersectRight = rectangles[0].right;
    let intersectTop = rectangles[0].top;
    let intersectBottom = rectangles[0].bottom;
    for (let i = 1; i < rectangles.length; i++) {
        const rect = rectangles[i];
        intersectLeft = Math.max(intersectLeft, rect.left);
        intersectRight = Math.min(intersectRight, rect.right);
        intersectTop = Math.min(intersectTop, rect.top);
        intersectBottom = Math.max(intersectBottom, rect.bottom);
    }
    const width = intersectRight - intersectLeft;
    const height = intersectTop - intersectBottom;
    if (width <= 0 || height <= 0)
        return 0;
    return width * height;
}
// Основная функция
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const ask = (question) => new Promise((resolve) => rl.question(question, resolve));
        const nInput = yield ask("Введите количество прямоугольников (N): ");
        rl.close();
        const N = parseInt(nInput);
        if (isNaN(N) || N <= 0) {
            console.error("Ошибка: введено некорректное число.");
            return;
        }
        let lines;
        try {
            lines = fs
                .readFileSync("RECT.TXT", "utf-8")
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        }
        catch (_a) {
            console.error("Ошибка при чтении файла RECT.TXT");
            return;
        }
        if (lines.length < N) {
            console.error(`Ошибка: в файле RECT.TXT только ${lines.length} строк, а требуется ${N}.`);
            return;
        }
        const rectangles = [];
        for (let i = 0; i < N; i++) {
            const rect = parseRectangle(lines[i]);
            if (!rect) {
                console.error(`Ошибка: некорректные данные в строке ${i + 1}: "${lines[i]}"`);
                return;
            }
            rectangles.push(rect);
        }
        const area = getIntersectionArea(rectangles);
        console.log(`Суммарная площадь пересечения: ${area}`);
    });
}
main();
