import React, { Component } from 'react';
import Grid from './Grid/Grid';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

import './DijkstraViewer.css';

const getNewGridWallsnew = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
const getNewGridWithNewStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithNewFinish = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: !node.isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      valueInStartNodeR: NaN,
      startNodeR: 10,
      lastStartNodeR: NaN,
      valueInStartNodeC: NaN,
      startNodeC: 15,
      lastStartNodeC: NaN,
      valueInFinishNodeR: NaN,
      finishNodeR: 10,
      lastFinishNodeR: NaN,
      valueInFinishNodeC: NaN,
      finishNodeC: 35,
      lastFinishNodeC: NaN,
      mouseIsPressed: false,
    };

    this.handleStartC = this.handleStartC.bind(this);
    this.handleStartR = this.handleStartR.bind(this);
    this.handleFinishC = this.handleFinishC.bind(this);
    this.handleFinishR = this.handleFinishR.bind(this);
    this.handleSubmitNewStart = this.handleSubmitNewStart.bind(this);

  }
  handleStartC(event) {

    this.setState({ valueInStartNodeC: parseInt(event.target.value, 10) });

  }
  handleStartR(event) {
    this.setState({ valueInStartNodeR: parseInt(event.target.value, 10) });
  }
  handleFinishC(event) {
    this.setState({ valueInFinishNodeC: event.target.value })
  }
  handleFinishR(event) {
    this.setState({ valueInFinishNodeR: event.target.value })
  }
  handleSubmitNewStart() {
    this.setState({ startNodeC: this.state.valueInStartNodeC, startNodeR: this.state.valueInStartNodeR }, () => {
      let row = this.state.startNodeR
      let col = this.state.startNodeC
      const newGrid = getNewGridWithNewStart(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    });

    this.setState({ lastStartNodeR: this.state.startNodeR, lastStartNodeC: this.state.startNodeC }, () => {
      console.log(this.state.lastStartNodeC);
      console.log(this.state.lastStartNodeR)
      let stateRow = this.state.lastStartNodeR
      let stateCol = this.state.lastStartNodeC
      let stateRowParsed = parseInt(stateRow, 10);
      let stateColParsed = parseInt(stateCol, 10);
      console.log(typeof (stateRowParsed))
      let oldRow = stateRowParsed;
      let oldCol = stateColParsed;
      console.log(typeof (oldRow))
      console.log(oldRow)
      const newNewGrid = getNewGridWithNewStart(this.state.grid, oldRow, oldCol);
      this.setState({ grid: newNewGrid })
    });
  }

  handleSubmitNewFinish() {
    this.setState({ finishNodeC: this.state.valueInFinishNodeC, finishNodeR: this.state.valueInFinishNodeR }, () => {
      let row = this.state.finishNodeR
      let col = this.state.finishNodeC
      const newGrid = getNewGridWithNewFinish(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    });

    this.setState({ lastFinishNodeR: this.state.finishNodeR, lastFinishNodeC: this.state.finishNodeC }, () => {
      console.log(this.state.lastFinishNodeC);
      console.log(this.state.lastFinishNodeR);
      let stateRow = this.state.lastFinishNodeR
      let stateCol = this.state.lastFinishNodeC
      let stateRowParsed = parseInt(stateRow, 10);
      let stateColParsed = parseInt(stateCol, 10);
      console.log(typeof (stateRowParsed))
      let oldRow = stateRowParsed;
      let oldCol = stateColParsed;
      console.log(typeof (oldRow))
      console.log(oldRow)
      const newNewGrid = getNewGridWithNewFinish(this.state.grid, oldRow, oldCol);
      this.setState({ grid: newNewGrid })
    });
  }
  componentDidMount() {
    const createNode = (col, row) => {
      return {
        col,
        row,
        isStart: row === this.state.startNodeR && col === this.state.startNodeC,
        isFinish: row === this.state.finishNodeR && col === this.state.finishNodeC,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
      };
    };

    const getInitialGrid = () => {
      const grid = [];
      for (let row = 0; row < 21; row++) {
        const currentRow = [];
        for (let col = 0; col < 51; col++) {
          currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
      }
      return grid;
    };

    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWallsnew(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWallsnew(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateAlgo(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateAlgo(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  ViewDijksAlgo() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNodeR][this.state.startNodeC];
    const finishNode = grid[this.state.finishNodeR][this.state.finishNodeC];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  handleKeyPressOnStart = event => {
     if (event.key === 'Enter') {
      this.handleSubmitNewStart();
    }
  };

  handleKeyPressOnFinish = event => {
    if (event.key === 'Enter') {
      this.handleSubmitNewFinish();
    }
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (

      <div>
        <header className='header'>
          <div>
            <div>
              <div className='instructions'>
                <p> You can select Finish and Start Point</p>
                <p> Create Walls on the Map by clicking the squares</p>
                <p> This Algorithm will avoid the walls and always show you the shortest Path</p>
              </div>
              <input className='inputs' type="number" placeholder={"Number Between 1 and 50"} value={this.state.valueInStartNodeC} onChange={this.handleStartC} />
              <input className='inputs' type="number" placeholder={"Number Between 1 and 20"} value={this.state.valueInStartNodeR} onKeyPress={this.handleKeyPressOnStart} onChange={this.handleStartR} />
              <div className='submit-btn' onClick={() => this.handleSubmitNewStart()}>
                Start Line Coordinates
              </div>
            </div>
            <div>


              <input className='inputs' type="number" placeholder={"Number Between 1 and 50"} value={this.state.valueInFinishNodeC} onChange={this.handleFinishC} />
              <input className='inputs' type="number" placeholder={"Number Between 1 and 20"} onKeyPress={this.handleKeyPressOnFinish} value={this.state.valueInFinishNodeR} onChange={this.handleFinishR} />
              <div className='submit-btn' onClick={() => this.handleSubmitNewFinish()} >
                Finish Line Coordinates
            </div>
            </div>
          </div>
          <div className='visualize-btn' onClick={() => this.ViewDijksAlgo()}>
            Visualize Dijkstra's Algorithm
          </div>
        </header>
        {/*/GRID/*/}

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div className={`row ${rowIdx}`} key={rowIdx} >
                {
                  row.map((node, nodeIdx) => {
                    const { row, col, isFinish, isStart, isWall } = node;
                    return (
                      <Grid
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}></Grid>
                    );
                  })
                }
              </div>
            );
          })}
        </div>
        <div className='reset-btn' onClick={() => window.location.reload()}>
          Reset Grid
          </div>

      </div >
    );
  }
}