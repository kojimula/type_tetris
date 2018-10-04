var COLS = 10, ROWS = 20;   // 横10マス、縦20マス
var board: number[][] = []; // 盤面情報
var currentBlock: number[][];           // 操作中のブロックの状態
var currentX: number, currentY: number; // 操作中のブロックの位置

var BlockShapes: number[][] = [
    [1, 1, 1, 1],
    [1, 1, 1, 0,
     1],
    [1, 1, 1, 0,
     0, 0, 1],
    [0, 1, 1, 0,
     0, 1, 1],
    [1, 1, 0, 0,
     0, 1, 1],
    [0, 1, 1, 0,
     1, 1],
    [0, 1, 0, 0,
     1, 1, 1]
];

var BlockColors: string[] = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

// 盤面を空にする
for (var y = 0; y < ROWS; y++) {
    board[y] = [];
    for (var x = 0; x < COLS; x++) {
        board[y][x] = 0;
    }
}

newBlock();

// ブロックのパターンをランダムに出力し、盤面の一番上へセット
function newBlock() {
    // ブロックのパターンをランダムに決定
    var id = Math.floor(Math.random() * BlockShapes.length);
    var BlockShape = BlockShapes[id];

    // 操作ブロックにパターンをセット
    currentBlock = [];
    for (var y = 0; y < 4; y++) {
        currentBlock[y] = [];
        for (var x = 0; x < 4; x++) {
            var i = 4 * y + x;
            if (typeof BlockShape[i] != 'undefined' && BlockShape[i]) {
                currentBlock[y][x] = id + 1;
            }
            else {
                currentBlock[y][x] = 0;
            }
        }
    }

    // ブロックを盤面の上端にセット
    currentX = 3;
    currentY = 0;
}

/// 画面レンダリング系処理
/*
 現在の盤面の状態を描画する処理
 */
var canvas = document.getElementsByTagName('canvas')[0];  // キャンバス
var ctx = canvas.getContext('2d');          // コンテクスト
var W = 300, H = 600;                       // キャンバスのサイズ
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS; // マスの幅を設定

// 30ミリ秒ごとに状態を描画する関数renderを呼び出す
setInterval(render, 30);

// 盤面と操作ブロックを描画
function render() {
    ctx!.clearRect(0, 0, W, H);  // 一度キャンバスを真っさらにする
    ctx!.strokeStyle = 'black';  // えんぴつの色を黒にする

    // 盤面を描画する
    for (var x = 0; x < COLS; x++) {
        for (var y = 0; y < ROWS; y++) {
            ctx!.fillStyle = 'grey';
            drawBlock(x, y);  // マスを描画
        }
    }

    // 操作ブロックを描画する
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            if (currentBlock[y][x]) {
                ctx!.fillStyle = BlockColors[currentBlock[y][x] - 1];  // マスの種類に合わせて塗りつぶす色を設定
                drawBlock(currentX + x, currentY + y);  // マスを描画
            }
        }
    }
}

// x, yの部分へマスを描画する処理
function drawBlock(x: number, y: number) {
    ctx!.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx!.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}
