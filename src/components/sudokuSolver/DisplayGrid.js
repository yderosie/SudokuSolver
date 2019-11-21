import React from "react";

import DisplayNumber from "./DisplayNumber.js"

export default class DisplayGrid extends React.Component {

    constructor(props) {
      super(props);
      let grid = props.grid.map((arr) => {
          return arr.slice();
      });
      this.state = {
        grid: grid,
        inputError: {}
      }
    }

    // Permet de voir si la valeur entré est valide
    checkInputValue = (value) => {
      if ((Number.isInteger(parseInt(value)) && value < 10 && value > 0) || value === "" || value === " ") {
        return true;
      }
      return false;
    }

    // Permet de verifier si la valeur rentré est en accord avec les regle du sudoku
    checkInputPos = (value, pos) => {
      let grid = this.state.grid;
      if (grid[pos.y].indexOf(value) !== -1) {
        return false;
      }
      for (let i = 0; i < 9; ++i) {
        if (grid[i][pos.x] === value) {
          return false
        }
      }
      for (let y = parseInt(pos.y / 3) * 3, lengthY = parseInt(pos.y / 3) * 3 + 3; y < lengthY; ++y) {
        for (var x = parseInt(pos.x / 3) * 3, lengthX = parseInt(pos.x / 3) * 3 + 3; x < lengthX; ++x) {
          if (grid[y][x] === value) {
            return false
          }
        }
      }
      return true;
    }

    handleChange = (pos, event) => {
      if (this.checkInputValue(event.target.value) && (this.checkInputPos(event.target.value, pos) || event.target.value === "")) {
        let grid = this.state.grid;
        grid[pos.y][pos.x] = event.target.value;
        this.setState({grid: grid, inputError: {}})
      } else {
        this.setState({inputError: pos})
      }
    }

    // Permet de faire l'affichage de chaque case
    setLine = (row, indexRow) => {
        return row.map((value, indexLine) => {
          let pos = {y: indexRow, x: indexLine};
          return (
            <th key={pos.x + pos.y} className={this.state.inputError !== {} && this.state.inputError.x === indexLine && this.state.inputError.y === indexRow ? "has-error" : ""}>
              <DisplayNumber
                key={pos.x + pos.y}
                pos={pos}
                value={value}
                handleChange={this.handleChange}
                edit={this.props.edit}
                error={this.state.inputError !== {} && this.state.inputError.x === indexLine && this.state.inputError.y === indexRow ? true : false}
              />
            </th>
          );
        });
    }

    setRowGrid = () => {
      return this.state.grid.map((row, indexRow) => {
        return (
          <tr key={indexRow}>
            {this.setLine(row, indexRow)}
          </tr>
        );
      });
    }

    render = () => {
      let grid = this.setRowGrid();
      return (
        <div className="col-xs-6 margin-top">
          {this.props.error &&
            <div className="alert alert-danger" role="alert">
              Il faut un minimum de 17 cases remplis pour valider le sudoku et pouvoir le résoudre
            </div>
          }
          <table className={"sudoku_grid_" + (this.props.edit ? "input" : "display") + " text-center table table-bordered table-dark"}>
            <tbody>
              {grid}
            </tbody>
          </table>
          {this.props.edit === 1 &&
            <button
              type="button"
              className="btn btn-primary margin-top"
              onClick={(e) => this.props.solve(this.state.grid)}>
                Résoudre le Sudoku
            </button>}
        </div>
      );
    }
}
