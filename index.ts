interface Coords {
    row: number;
    col: number;
}

class Board {
    private board:number[][] = [[]];
    private dim:number = 0;
    private freeCells: Coords[] = [];

    constructor(dim:number){
        this.dim = dim;
        this.resetBoard();
    }

    private get emptyCellValue(): number { return 0; }
    private get treeCellValue(): number { return 1; }
    private get tentCellValue(): number { return 2; }

    private get treeCount(): number {
        return (this.dim * this.dim) / 5;
    }

    isCellEmpty(coords: Coords): boolean {
        return this.board[coords.row][coords.col] == this.emptyCellValue;
    }

    generateTreeMap(): void {
        let shouldRetry = false;
        this.resetBoard();
        for(let i = 0; i < this.treeCount; i++) {
            if(!this.placeRandomTreeAndTent()){
                shouldRetry = true;
                break;
            }
        }

        if(shouldRetry) this.generateTreeMap();
    }

    printBoard(): void {
        let colCount = this.range(this.dim);
        let rowCount = this.range(this.dim);

        for(let i = 0; i < this.dim; i++) {
            let cc = 0;
            let rc = 0;
            for(let j = 0; j < this.dim; j++) {
                if(this.board[i][j] == this.tentCellValue) cc++;
                if(this.board[j][i] == this.tentCellValue) rc++;
            }
            colCount[i] = cc;
            rowCount[i] = rc;
        }

        console.log("cols: ", colCount.join());
        console.log("rows: ", rowCount.join());

        this.clearUtilityCells();

        let rowText = "";
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                rowText += this.board[i][j] + " ";
            }

            console.log(rowText);
            rowText = "";
        }
    }

    private clearUtilityCells(): void {
        for(let r = 0; r < this.dim; r++) {
            for(let c = 0; c < this.dim; c++) {
                if(this.board[r][c] != this.treeCellValue) {
                    this.board[r][c] = this.emptyCellValue;
                }
            }
        }
    }

    private placeRandomTreeAndTent(): boolean {
        let placementWasSuccessful: boolean = true;

        while(true) {
            let treeCoords = this.getRandomCoords();
            let freeNeighbouringCells = this.getFreeNeighbouringCellsForTree(treeCoords);
            if(!freeNeighbouringCells.length) {
                this.freeCells = this.freeCells.filter((cell) => {
                    return !(cell.row == treeCoords.row && cell.col == treeCoords.col);
                });

                if(!this.freeCells.length) {
                    placementWasSuccessful = false;
                    break;
                }

                continue;
            }
            this.board[treeCoords.row][treeCoords.col] = this.treeCellValue;
            let tentCoords: Coords = this.getRandomElement(freeNeighbouringCells);
            this.board[tentCoords.row][tentCoords.col] = this.tentCellValue;

            this.freeCells = this.freeCells.filter(function(cell) {
                if (cell.row >= tentCoords.row - 1 && 
                    cell.row <= tentCoords.row + 1 &&
                    cell.col >= tentCoords.col - 1 &&
                    cell.col <= tentCoords.col + 1) {
                        return false;
                    }

                return true;
            });

            break;
        }

        return placementWasSuccessful;
    }

    private getRandomElement(collection: any[]): any {
        return collection[Math.floor(Math.random() * collection.length)];
    }

    private getRandomCoords(): Coords {
        var rndCoord = this.getRandomElement(this.freeCells);
        return rndCoord;
    }

    private getFreeNeighbouringCellsForTree(coords: Coords): Coords[] {
        return this.freeCells.filter(cell => {
            if ((cell.row == coords.row && cell.col == coords.col - 1) ||
                (cell.row == coords.row && cell.col == coords.col + 1) ||
                (cell.row == coords.row - 1 && cell.col == coords.col) ||
                (cell.row == coords.row + 1 && cell.col == coords.col)) {
                return true;
            }

            return false;
        });
    }

    private resetBoard(): void{
        this.board = this.matrix(this.dim, this.emptyCellValue);
        this.freeCells = [];
        for(let r = 0; r < this.dim; r++) {
            for(let c = 0; c < this.dim; c++) {
                this.freeCells.push({row: r, col: c});
            }
        }
    }

    private range (n:number): number[]{
        return Array(n).fill(0);
    }

    private matrix(dim:number, value:number): number[][] {
        return this.range(dim).map(v => this.range(dim).map(v => value));
    }
}

let board = new Board(10);
board.generateTreeMap();
board.printBoard();

