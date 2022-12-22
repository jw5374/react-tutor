import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Square = (props) => {
  return (
	<button className="square" onClick={props.onSquareClick}>
	  {props.mark == null ? "" : props.mark}
	</button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square mark={this.props.boardState[i]} onSquareClick={() => this.props.boardClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
	super(props)
	this.state = { 
	  boardSteps: [Array(9).fill(null)],
	  stateStep: 0,
	  xIsPlayer: true
	}

	this.handleBoardClick = this.handleBoardClick.bind(this)
	this.handleStep = this.handleStep.bind(this)
  }

  componentDidMount() {
    const status = `Next player: X`;
	this.setState({ statusMsg: status })
  }

  handleBoardClick(index) {
	const nextPlayer = !this.state.xIsPlayer
	const currNum = this.state.stateStep
	const newBoard = [...this.state.boardSteps[currNum]]
	if (this.calcWinner(newBoard) || newBoard[index] != null) {
	  return
	}
	newBoard[index] = this.state.xIsPlayer ? "X" : "O"
	this.setState({ statusMsg: `Next player: ${nextPlayer ? "X" : "O"}`, boardSteps: [...this.state.boardSteps, newBoard], stateStep: currNum+1, xIsPlayer: nextPlayer })
  }

  handleStep(stepNum) {
	this.setState({
	  statusMsg: `Next player: ${stepNum % 2 === 0 ? "X" : "O"}`,
	  stateStep: stepNum,
	  boardSteps: this.state.boardSteps.slice(0, stepNum+1),
	  xIsPlayer: stepNum % 2 === 0
	})
  }

  calcWinner(squares) {
	const lines = [
	  [0, 1, 2],
	  [3, 4, 5],
	  [6, 7, 8],
	  [0, 3, 6],
	  [1, 4, 7],
	  [2, 5, 8],
	  [0, 4, 8],
	  [2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
	  const [a, b, c] = lines[i];
	  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
		return squares[a];
	  }
	}
	return null;
  }
  
  render() {
	const steps = this.state.boardSteps.map((step, index) => {
	  let stepMsg = index ? "Go to move #" + index : "Go to game start"
	  return (
		<li key={index}><button onClick={() => this.handleStep(index)}>{stepMsg}</button></li>
	  )
	})
	const currStep = this.state.stateStep
	const historySteps = this.state.boardSteps
	const currentBoard = historySteps[currStep]
	const winningPlayer = this.calcWinner(currentBoard)
    return (
      <div className="game">
        <div className="game-board">
		  <Board boardState={currentBoard} boardClick={(i) => this.handleBoardClick(i)} />
        </div>
        <div className="game-info">
          <div>{winningPlayer ? `Winner is ${winningPlayer}` : this.state.statusMsg}</div>
		  <ol>{steps}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

