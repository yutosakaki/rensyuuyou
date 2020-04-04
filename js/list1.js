// list1
"use strict"
//list1 1 クラスの定義
class BlockAA {
    constructor(release, hold) {
        this.release = release;
        this.hold = hold;
    }
}

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//list7 カーソルクラスの定義
class Cursor {
    constructor(pos) {
        this.pos = pos;

        //list7 1 block flag
        this.isHolding = false;
    }
}

//list1 2 変数　定数の宣言
let field;
let cursor;
let combo;

const fieldSize = new Vec2(6, 5);

const block = {
    none: 0,
    circle: 1,
    triangle: 2,
    square: 3,
    diamond: 4,
    star: 5,
    max: 6,
};

const blockAA = [
    new BlockAA('　', '　'),
    new BlockAA('○', '●'),
    new BlockAA('△', '▲'),
    new BlockAA('□', '■'),
    new BlockAA('◇', '◆'),
    new BlockAA('☆', '★'),
];

const direction = {
    horizontal: 0,
    vertical: 1,
    max: 2
};

const directions = [
    new Vec2(1, 0), //horizontal
    new Vec2(0, 1)]; //vertical


//list1 3　描画関数

//list20
function updateAnimation(){
    let dropped = true;

    //list20 1
    dropped = dropBlocks();
    if(!dropped){
        let removed = true;
        //list20 2
        removed = removeBlocks();

        if(!removed){
            //list20 3
            combo = 0;
            draw();
            //list20 4
            endAnimation();
            return;
        }
    }

    //list20 5
    setTimeout(updateAnimation,300);
}


function endAnimation(){
    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;
}


//list19
function startAnimation(){
    window.onkeydown = null;
    window.onkeyup = null;
    //list19 1
    combo=0;
    updateAnimation();
}


//list17
function dropBlocks(){
    let dropped = false;

    //list17 1

    //list18
        for(let i= field.length - 1; i > 0; i--){
            for(let j=0; j < field[i].length; j++){
                    //list18 1
                    if((field[i][j] === block.none)
                    && (field[i-1][j] !== block.none)){
                        dropped = true;
                        field[i][j] = field[i-1][j];
                        field[i-1][j] = block.none;
                    }
            }
        }


    //list17 2
        for(let i=0; i < field[0].length; i++)
            if(field[0][i] === block.none){
                dropped = true;
                field[0][i] = 1 + parseInt(
                    Math.random() * (block.max -1));
            }

    //list17 3
        if(dropped)
        draw();
    return dropped;
}



//list 8
function onKeyDown(e) {
    //list8 1
    let lastPos =
        new Vec2(cursor.pos.x, cursor.pos.y);



    //list8 2 カーソル操作
    //list10
    switch (e.key) {
        case 'w': cursor.pos.y--; break;
        case 's': cursor.pos.y++; break;
        case 'a': cursor.pos.x--; break;
        case 'd': cursor.pos.x++; break;
        default:
            //list10 1
            cursor.isHolding = true;
            break;
    }

    //list8 3

    if (cursor.pos.x < 0) cursor.pos.x += fieldSize.x;
    if (cursor.pos.x >= fieldSize.x) cursor.pos.x -= fieldSize.x;
    if (cursor.pos.y < 0) cursor.pos.y += fieldSize.y;
    if (cursor.pos.y >= fieldSize.y) cursor.pos.y -= fieldSize.y;

    //list8 4

    if (cursor.isHolding) {
        let temp = field[lastPos.y][lastPos.x];
        field[lastPos.y][lastPos.x] =
            field[cursor.pos.y][cursor.pos.x];
        field[cursor.pos.y][cursor.pos.x] = temp;
    }


    draw();
}

//list9
function onKeyUp(e) {
    //list9 1 ブロックを離す

    //list11
    switch (e.key) {
        case 'w':
        case 's':
        case 'a':
        case 'd':
        default:
            cursor.isHolding = false;
            //list11 1 combo start
            startAnimation();
            break;
    }

    draw();
}

//list12
function removeBlocks() {
    let removed = false;
    //list12 1 削除フラグテーブルの作成
    let toRemove = [];
    for (let i = 0; i < field.length; i++) {
        toRemove[i] = [];
        for (let j = 0; j < field[i].length; j++)
            toRemove[i][j] = false;
    }

    //list12 2
    //list13
    for (let i = 0; i < field.length; i++)
        for (let j = 0; j < field[i].length; j++) {
            //list13 1
            if (field[i][j] === block.none)
                continue;
            //list13 2
            //list14
            for (let k = 0; k < directions.length; k++) {
                let v = new Vec2(j, i);
                let chain = 1;
                //list14 1
                //list15
                while (true) {
                    //list15 1
                    v = new Vec2(
                        v.x + directions[k].x,
                        v.y + directions[k].y);

                    if ((v.x >= field[i].length) || (v.y >= field.length)) break;

                    if (field[v.y][v.x] === field[i][j])
                        chain++;
                    else break;
                }
                //list14 2
                if (chain >= 3) {
                    removed = true;
                    //list 16 1
                    v = new Vec2(j, i);
                    for (let l = 0; l < chain; l++) {
                        toRemove[v.y][v.x] = true;
                        v = new Vec2(
                            v.x + directions[k].x,
                            v.y + directions[k].y);

                    }

                }

            }



        }

    //list12 3
    for (let i = 0; i < field.length; i++)
        for (let j = 0; j < field[i].length; j++)
            if (toRemove[i][j])
                field[i][j] = block.none;

    //list12 4
        if(removed)
        combo++;

    //list12 5
    if (removed)
        draw();

    return removed;
}




//list2
function init() {
    //list2 1　フィールドの生成
    //list5
    field = [];
    for (let i = 0; i < fieldSize.y; i++) {
        field[i] = [];
        for (let j = 0; j < fieldSize.x; j++) {

            let newBlock = 1
                + parseInt(
                    Math.random() * block.max - 1);
            field[i].push(newBlock);
        }
    }


    //list2 2 その他の初期化
    cursor = new Cursor(new Vec2(0, 0));
    combo = 0;



    //list2 3　イベントハンドラの登録
    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;



    //list2 4
    draw();

}

//list3
function draw() {
    let html = '';

    //list3 1 フィールドの描画
    //list6
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            let aa = blockAA[field[i][j]].release;
            // list6 1 つかんでいれば塗りつぶし
            if (cursor.isHolding
                && (i === cursor.pos.y)
                && (j === cursor.pos.x))
                aa = blockAA[field[i][j]].hold;

            html += aa;
        }

        //list6 2 カーソルのもとの行に矢印を描画する
        if (i === cursor.pos.y)
            html += '←';
        html += '<br>';
    }

    for (let i = 0; i < field[0].length; i++)
        if (i === cursor.pos.x)
            html += '↑';
        else
            html += '　';
    html += '<br>';




    //list3 2
    //list4
    html += '<br>';

    if (combo === 0) {
        html += `[w,s,a,d]:カーソル移動　<br>
            [その他のキー]: ブロックを`
        html += (cursor.isHolding)
            ? '離す'
            : 'つかむ';

    }

    else html += `${combo} コンボ！`;




    let div = document.querySelector('div');
    div.innerHTML = html;
}

//list1 4
init();