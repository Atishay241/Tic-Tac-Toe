const Gameboard = (function () {
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getboard = () => board;

    const setboard = (row, col, val) => {
        if (board[row][col] !== "") return false;
        board[row][col] = val;
        return true;
    };

    const reset = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    };

    const fullboard = ()=>{
        let c = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if(board[i][j] === "") c++;
            }
        }
        return c===0;
    }

    return { getboard, setboard, reset,fullboard};
})();

function create_player(name, marker) {
    let score = 0;
    const getscore = () => score;
    const addscore = () => score++;
    const resetscore = () => score = 0;
    return { name, marker, getscore, addscore, resetscore };
}

const Game = (function () {
    const player1 = create_player("Player 1", "X");
    const player2 = create_player("Player 2", "O");

    const anywin = (player) => {
        const board = Gameboard.getboard();
        const marker = player.marker;
    
        // rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === marker && board[i][1] === marker && board[i][2] === marker)
                return `row${i}`;
        }
    
        // columns
        for (let j = 0; j < 3; j++) {
            if (board[0][j] === marker && board[1][j] === marker && board[2][j] === marker)
                return `col${j}`;
        }
    
        if (board[0][0] === marker && board[1][1] === marker && board[2][2] === marker)
            return "diagLR";
    
        if (board[0][2] === marker && board[1][1] === marker && board[2][0] === marker)
            return "diagRL";
    
        return false;
    };

    return { player1, player2, anywin };
})();

const display = (function () {
    let turn = 0; // 0 for player1, 1 for player2

    const changeturn = function () {
        turn = turn === 0 ? 1 : 0;
        nameofplayer(); 
    };

    const getTurn = () => turn;

    const player_name = function (id, fallback) {
        const pl = document.querySelector(id);
        return pl.value.trim() === "" ? fallback : pl.value.trim();
    };

    const scorename = function () {
        const name1Span = document.querySelector(".p1name");
        const name2Span = document.querySelector(".p2name");
        const sc1 = document.querySelector("#sc1");
        const sc2 = document.querySelector("#sc2");

        if (!name1Span || !name2Span || !sc1 || !sc2) return;

        name1Span.textContent = Game.player1.name;
        name2Span.textContent = Game.player2.name;

        sc1.textContent = Game.player1.getscore();
        sc2.textContent = Game.player2.getscore();
    };

    const nameofplayer = function () {
        const nameEl = document.querySelector(".turn");
        nameEl.textContent =
            getTurn() === 0 ? `${Game.player1.name}'s turn` : `${Game.player2.name}'s turn`;
    };

    const setTurn = (val) => { turn = val };

    const board_render = function(){
        cells.forEach((cell)=>{
            const id = cell.id;
            // console.log(id);
            const r = id[0] , c = id[1];
            // console.log(r,c);
            cell.textContent = Gameboard.getboard()[r][c];
        })
    }

    const player_wins = function(player){
        const nameEl = document.querySelector(".turn");
        nameEl.textContent = `${player.name} Wins !!! 🙌`
    }

    const player_tied = function(){
        const nameEl = document.querySelector(".turn");
        nameEl.textContent = "Match Tied !!! 😆"
    }

    return { player_name, changeturn, scorename, nameofplayer, getTurn, setTurn , board_render , player_wins , player_tied};
})();



document.querySelector(".SetName").addEventListener("click", () => {
    const name1 = display.player_name("#pl1", "Player 1");
    const name2 = display.player_name("#pl2", "Player 2");
  
    Game.player1.name = name1;
    Game.player2.name = name2;
  
    display.scorename();  
    
    const player = display.getTurn() === 0 ? Game.player1 : Game.player2 ;
    const res = Game.anywin(player);
    console.log(res);
    if(res){
        // console.log("mscksc");
        display.player_wins(player);
    }
    else if(Gameboard.fullboard()) display.player_tied;
    else display.nameofplayer();   
});


const cells = document.querySelectorAll(".cell");
cells.forEach(cell=>{
    cell.addEventListener("click", () => {

        const id = cell.id;
        const r = id[0], c = id[1];
        const turn = display.getTurn();
        const player = turn === 0 ? Game.player1 : Game.player2;
    
        if (Gameboard.setboard(r, c, player.marker) === false) return;
        display.board_render();
    
        const res = Game.anywin(player);
    
        if (res) {
            player.addscore();
            display.scorename();
            display.player_wins(player);
    
            indices[res].forEach(id => {
                document.getElementById(id).classList.add("highlight");
            });
    
            winSound.play();
    
            cells.forEach(cell => cell.style.pointerEvents = "none");
    
        } else if (Gameboard.fullboard()) {
            display.player_tied();
            winSound.play();
            cells.forEach(cell => cell.style.pointerEvents = "none");
        } else {
            display.changeturn();
        }
    });
    
})


const indices = {
    row0: ["00", "01", "02"],
    row1: ["10", "11", "12"],
    row2: ["20", "21", "22"],
    col0: ["00", "10", "20"],
    col1: ["01", "11", "21"],
    col2: ["02", "12", "22"],
    diagLR: ["00", "11", "22"], 
    diagRL: ["02", "11", "20"]   
};

const winSound = new Audio("mixkit-retro-game-notification-212.wav");

const restart = document.querySelector(".restart");

restart.addEventListener("click" , ()=> {
    // console.log("ekmcd")
    Gameboard.reset();
    display.setTurn(0);

    display.board_render();
    display.scorename();
    display.nameofplayer();

    cells.forEach(cell => {
        cell.classList.remove("highlight");
        cell.style.pointerEvents = "auto";
    })
    
})


document.querySelector(".resetGame").addEventListener("click", () => {

    Gameboard.reset();
    display.setTurn(0);
    display.board_render();

    Game.player1.name = "Player 1";
    Game.player2.name = "Player 2";

 
    Game.player1.resetscore();
    Game.player2.resetscore();

    display.scorename();
    display.nameofplayer();

    cells.forEach(cell => {
        cell.classList.remove("highlight");
        cell.style.pointerEvents = "auto";
    });

    document.querySelector("#pl1").value = "";
    document.querySelector("#pl2").value = "";
    
});