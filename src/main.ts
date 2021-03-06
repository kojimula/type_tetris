var COLS = 10, ROWS = 20;   // 横10マス、縦20マス
var board: number[][] = []; // 盤面情報
var currentBlock: number[][];           // 操作中のブロックの状態
var currentX: number, currentY: number; // 操作中のブロックの位置
var interval: number;       // ゲームタイマーを保持する変数
var loseFlg: boolean;       // ゲームオーバーを管理するフラグ

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

newGame();

function newGame() {
    clearInterval(interval);  // ゲームタイマーをクリア
    init();
    newBlock();
    loseFlg = false;
    interval = setInterval(tick, 250);  // 250ミリ秒ごとに関数tickを呼び出す
}

// 盤面を空にする
function init() {
    for (var y = 0; y < ROWS; y++) {
        board[y] = [];
        for (var x = 0; x < COLS; x++) {
            board[y][x] = 0;
        }
    }
}

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

// インターバルにより指定した時間が経過する毎に呼び出される
function tick() {
    // １つ下へ移動
    if (valid(0, 1)) {
        currentY++;
    }
    // もし着地していたら(１つ下にブロックがあったら)
    else {
        freezeBlock();
        clearLines();   // ライン消去処理
        if (loseFlg) {
            newGame();
            return false;
        }

        // 新しい操作ブロックをセット
        newBlock();
    }
}

// 指定された方向に、操作ブロックを動かせるかどうかチェックする
// ゲームオーバー判定もここで行う
function valid(offsetX: number = 0, offsetY: number = 0, newBlock: number[][] = currentBlock): boolean {
    var newX = currentX + offsetX;
    var newY = currentY + offsetY;
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            // そのマスのブロックの有無を確認
            if (newBlock[y][x]) {
                if (typeof board[y + newY] == 'undefined'
                    || typeof board[y + newY][x + newX] == 'undefined'
                    || board[y + newY][x + newX]
                    || x + newX < 0
                    || x + newX >= COLS
                    || y + newY >= ROWS) {
                    if (currentY == 0
                        && offsetX == 0
                        && offsetY == 1) {
                        console.log('ガメオベラ');
                        loseFlg = true; // もし操作ブロックが盤面の上にあったら負けフラグを立てる
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

// 操作ブロックを盤面にセット
function freezeBlock() {
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            if (currentBlock[y][x]) {
                board[currentY + y][currentX + x] = currentBlock[y][x];
            }
        }
    }
}

// 底から順に一行が揃っているか調べ、揃っていたらその行を消去
function clearLines() {
    for (var y = ROWS - 1; y >= 0; y--) {
        var rowFilled = true;
        // 一行が揃っているか調べる
        for (var x = 0; x < COLS; x++) {
            if (board[y][x] == 0) {
                rowFilled = false;
                break;
            }
        }
        // もし一行揃っていたら, その列を消去
        if (rowFilled) {
            // その上にあったブロックを一つずつ落としていく
            for (var yy = y; yy > 0; yy--) {
                for (var x = 0; x < COLS; x++) {
                    board[yy][x] = board[yy - 1][x];
                }
            }
            y++;  // 一行落としたのでチェック処理を一つ下へ送る
        }
    }
}

// 操作ブロックを回す処理
function rotate(currentBlock: number[][]) {
    var rotatedBlock: number[][] = [];
    for (var y = 0; y < 4; y++) {
        rotatedBlock[y] = [];
        for (var x = 0; x < 4; x++) {
            rotatedBlock[y][x] = currentBlock[3 - x][y];
        }
    }
    return rotatedBlock;
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
            if (board[y][x]) {  // マスが空、つまり0ではなかったら
                ctx!.fillStyle = BlockColors[board[y][x] - 1];  // マスの種類に合わせて塗りつぶす色を設定
            }
            else {
                ctx!.fillStyle = 'grey';
            }
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


// 操作系処理
/*
 キーボードを入力した時に一番最初に呼び出される処理
 */
document.body.onkeydown = function (e) {
    // キーに名前をセット
    var keys: { [key: number]: string } = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate'
    };

    if (typeof keys[e.keyCode] != 'undefined') {
        // セットされたキーの場合
        keyPress(keys[e.keyCode]);
        // 描画処理を行う
        render();
    }
};

// キーボードが押された時に呼び出される関数
function keyPress(key: string) {
    switch (key) {
        case 'left':
            if (valid(-1)) {
                currentX--;  // 左に一つずらす
            }
            break;
        case 'right':
            if (valid(1)) {
                currentX++;  // 右に一つずらす
            }
            break;
        case 'down':
            if (valid(0, 1)) {
                currentY++;  // 下に一つずらす
            }
            break;
        case 'rotate':
            // 操作ブロックを回転
            var rotatedBlock = rotate(currentBlock);
            if (valid(0, 0, rotatedBlock)) {
                currentBlock = rotatedBlock;  // 回せる場合は回したあとの状態に操作ブロックをセット
            }
            break;
    }
}
