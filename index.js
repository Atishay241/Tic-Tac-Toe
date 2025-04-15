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

    return { getboard, setboard, reset };
})();

function create_player(name, marker) {
    let score = 0;
    const getscore = () => score;
    const addscore = () => score++;
    return { name, marker, getscore, addscore };
}

const Game = (function () {
    const player1 = create_player("Player 1", "X");
    const player2 = create_player("Player 2", "O");

    const anywin = (player) => {
        const board = Gameboard.getboard();
        const marker = player.marker;

        for (let i = 0; i < 3; i++) {
            if (board[i][0] === marker && board[i][1] === marker && board[i][2] === marker)
                return true;
        }

        for (let j = 0; j < 3; j++) {
            if (board[0][j] === marker && board[1][j] === marker && board[2][j] === marker)
                return true;
        }

        if (
            (board[0][0] === marker && board[1][1] === marker && board[2][2] === marker) ||
            (board[0][2] === marker && board[1][1] === marker && board[2][0] === marker)
        ) {
            return true;
        }

        return false;
    };

    return { player1, player2, anywin };
})();

const display = (function () {
    let turn = 0; // 0 for player1, 1 for player2

    const changeturn = function () {
        turn = turn === 0 ? 1 : 0;
        nameofplayer(); // update turn text
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

    return { player_name, changeturn, scorename, nameofplayer, getTurn, setTurn };
})();


document.querySelector(".SetName").addEventListener("click", () => {
    const name1 = display.player_name("#pl1", "Player 1");
    const name2 = display.player_name("#pl2", "Player 2");
  
    Game.player1.name = name1;
    Game.player2.name = name2;
  
    display.scorename();      
    display.nameofplayer();   
  });
