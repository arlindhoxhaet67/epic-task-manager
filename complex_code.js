/* complex_code.js */

// This code generates a maze using a randomized Prim's algorithm
// and solves the generated maze using the A* search algorithm.
// The maze is represented as a grid of cells, each with a unique ID.
// The IDs are generated using a combination of row and column indices.

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.id = `${row}-${col}`;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
    this.visited = false;
    this.distance = Infinity;
    this.previous = null;
  }
}

class Maze {
  constructor(rows, cols) {
    this.rows = Math.floor(rows);
    this.cols = Math.floor(cols);
    this.cells = [];
    this.start = null;
    this.end = null;

    // Initialize the maze grid with cells
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.cells.push(new Cell(i, j));
      }
    }

    // Generate the maze
    this.generateMaze();
  }

  generateMaze() {
    const stack = [];
    const initialCell = this.getRandomCell();
    initialCell.visited = true;
    stack.push(initialCell);

    while (stack.length > 0) {
      const currentCell = stack.pop();

      const neighbors = this.getUnvisitedNeighbors(currentCell);
      if (neighbors.length > 0) {
        stack.push(currentCell);

        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

        this.removeWall(currentCell, randomNeighbor);

        randomNeighbor.visited = true;
        stack.push(randomNeighbor);
      }
    }

    this.start = this.cells[0];
    this.end = this.cells[this.cells.length - 1];
  }

  getUnvisitedNeighbors(cell) {
    const { row, col } = cell;
    const neighbors = [];

    // Top neighbor
    if (row > 0) {
      const topNeighbor = this.cells[this.getIndex(row - 1, col)];
      if (!topNeighbor.visited) {
        neighbors.push(topNeighbor);
      }
    }

    // Right neighbor
    if (col < this.cols - 1) {
      const rightNeighbor = this.cells[this.getIndex(row, col + 1)];
      if (!rightNeighbor.visited) {
        neighbors.push(rightNeighbor);
      }
    }

    // Bottom neighbor
    if (row < this.rows - 1) {
      const bottomNeighbor = this.cells[this.getIndex(row + 1, col)];
      if (!bottomNeighbor.visited) {
        neighbors.push(bottomNeighbor);
      }
    }

    // Left neighbor
    if (col > 0) {
      const leftNeighbor = this.cells[this.getIndex(row, col - 1)];
      if (!leftNeighbor.visited) {
        neighbors.push(leftNeighbor);
      }
    }

    return neighbors;
  }

  getIndex(row, col) {
    return row * this.cols + col;
  }

  getRandomCell() {
    const randomRow = Math.floor(Math.random() * this.rows);
    const randomCol = Math.floor(Math.random() * this.cols);
    return this.cells[this.getIndex(randomRow, randomCol)];
  }

  removeWall(cell1, cell2) {
    const rowDiff = cell1.row - cell2.row;
    const colDiff = cell1.col - cell2.col;

    if (rowDiff === -1) {
      cell1.walls.bottom = false;
      cell2.walls.top = false;
    } else if (rowDiff === 1) {
      cell1.walls.top = false;
      cell2.walls.bottom = false;
    }

    if (colDiff === -1) {
      cell1.walls.right = false;
      cell2.walls.left = false;
    } else if (colDiff === 1) {
      cell1.walls.left = false;
      cell2.walls.right = false;
    }
  }

  solveMaze() {
    const openSet = [this.start];
    const closedSet = [];

    this.start.distance = 0;

    while (openSet.length > 0) {
      let closestIndex = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].distance < openSet[closestIndex].distance) {
          closestIndex = i;
        }
      }

      const current = openSet[closestIndex];

      if (current === this.end) {
        // Reached the end of the maze, stop searching
        break;
      }

      openSet.splice(closestIndex, 1);
      closedSet.push(current);

      const neighbors = this.getNeighbors(current);
      
      for (const neighbor of neighbors) {
        const tempDistance = current.distance + 1; // Assuming each step has a distance of 1 unit

        if (tempDistance < neighbor.distance) {
          neighbor.distance = tempDistance;
          neighbor.previous = current;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    // Reconstruct the path
    const path = [];
    let current = this.end;

    while (current !== null) {
      path.unshift(current);
      current = current.previous;
    }

    return path;
  }

  getNeighbors(cell) {
    const { row, col } = cell;
    const neighbors = [];

    // Top neighbor
    if (!cell.walls.top) {
      const topNeighbor = this.cells[this.getIndex(row - 1, col)];
      neighbors.push(topNeighbor);
    }

    // Right neighbor
    if (!cell.walls.right) {
      const rightNeighbor = this.cells[this.getIndex(row, col + 1)];
      neighbors.push(rightNeighbor);
    }

    // Bottom neighbor
    if (!cell.walls.bottom) {
      const bottomNeighbor = this.cells[this.getIndex(row + 1, col)];
      neighbors.push(bottomNeighbor);
    }

    // Left neighbor
    if (!cell.walls.left) {
      const leftNeighbor = this.cells[this.getIndex(row, col - 1)];
      neighbors.push(leftNeighbor);
    }

    return neighbors;
  }
}

const maze = new Maze(20, 20);
console.log(maze.solveMaze());