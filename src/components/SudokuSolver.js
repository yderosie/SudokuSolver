import React from "react";
import ReactTooltip from 'react-tooltip'

import DisplayGrid from "./sudokuSolver/DisplayGrid.js"
import DisplayDispoGrid from "./sudokuSolver/DisplayDispoGrid.js"

export default class SudokuSolver extends React.Component {

    constructor(props) {
      super(props);
      this.nbEmptyCase = 0;
      this.state = {
        grids: [
                [
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", ""]
                ],
                [
                  ["", "7", "6", "", "1", "", "", "4", "3"],
                  ["", "", "", "7", "", "2", "9", "", ""],
                  ["", "9", "", "", "", "6", "", "", ""],
                  ["", "", "", "", "6", "3", "2", "", "4"],
                  ["4", "6", "", "", "", "", "", "1", "9"],
                  ["1", "", "5", "4", "2", "", "", "", ""],
                  ["", "", "", "2", "", "", "", "9", ""],
                  ["", "", "4", "8", "", "7", "", "", "1"],
                  ["9", "1", "", "", "5", "", "7", "2", ""]
                ],
                [
                  ["1", "", "", "", "3", "", "5", "9", ""],
                  ["3", "", "", "5", "", "", "", "2", ""],
                  ["", "5", "", "9", "", "2", "6", "3", "8"],
                  ["4", "3", "", "", "", "", "", "", ""],
                  ["", "", "", "6", "", "1", "", "", ""],
                  ["", "", "", "", "", "", "", "8", "7"],
                  ["6", "4", "7", "3", "", "8", "", "5", ""],
                  ["", "1", "", "", "", "5", "", "", "9"],
                  ["", "9", "2", "", "7", "", "", "", "3"]
                ],
                [
                  ["", "8", "", "1", "", "", "", "2", ""],
                  ["", "", "", "9", "", "", "", "5", ""],
                  ["9", "7", "2", "", "", "", "", "6", ""],
                  ["4", "", "", "", "2", "6", "", "", ""],
                  ["", "", "", "", "5", "", "7", "", ""],
                  ["8", "", "1", "", "", "", "", "", ""],
                  ["", "", "", "6", "9", "5", "", "", ""],
                  ["", "2", "5", "", "", "", "", "", "9"],
                  ["", "", "", "", "4", "", "", "", "1"]
                ],
                [
                  ["1", "", "", "6", "", "", "7", "", ""],
                  ["", "", "9", "", "", "", "", "", ""],
                  ["", "", "", "", "", "3", "", "", ""],
                  ["2", "", "", "5", "", "", "8", "", ""],
                  ["", "", "8", "", "", "", "1", "", ""],
                  ["", "", "", "", "", "", "", "", ""],
                  ["3", "", "", "4", "", "", "9", "", ""],
                  ["", "", "", "", "9", "", "", "", ""],
                  ["", "6", "", "", "", "7", "", "", "1"]
                ],
              ],
        sudokuSelected: 0,
        nbpossibility: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        gridFirst: [],
        gridSolved: [],
        solve: false,
        error: false
      }
    }

    // Permet de recuperer la grille du sudoku que le user a remplie
    solve = (grid) => {
      let gridF = grid.map((arr) => {
          return arr.slice();
      });
      if (this.checkIfCaseIsEmpty(grid) > 64) {
        this.setState({error: true})
      } else {
        this.nbEmptyCase = this.checkIfCaseIsEmpty(grid);
        this.sudokuSolver(grid);
        this.setState({gridFirst: gridF, solve: true, error: false});
      }
    }

    // Permet de definir les possibilité sur une case
    possibilityCalc = (grid, x, y) => {
      let possibility = [];
      for (let i = 0, len = this.state.nbpossibility.length; i < len; ++i) {
        if (this.checkInputPos(grid, this.state.nbpossibility[i], {x: x, y: y}) === true) {
          possibility.push(this.state.nbpossibility[i]);
        }
      }
      return possibility;
    }

    // Permet de résoudre le sudoku en se basant seulement sur les possibilité
    sudokuSolverWithPossibility = (grid) => {
      let modif = false;
      let impossible = false;
      for (let y = 0; y < 9; ++y) {
        for (let x = 0; x < 9; ++x) {
          if (grid[y][x] === "") {
            let possibility = this.possibilityCalc(grid, x, y);
            let len = possibility.length;
            if (len === 1) {
              grid[y][x] = possibility[0];
              this.nbEmptyCase--;
              modif = true;
            } else if (len === 0) {
              impossible = true;
              break;
            } else {
              for (var i = 0; i < len; ++i) {
                if (this.checkIfOnlyCaseInBloc(grid, possibility[i], {y: y, x: x}) === true) {
                  grid[y][x] = possibility[i];
                  this.nbEmptyCase--;
                  modif = true;
                }
              }
            }
          }
        }
      }
      if (impossible) {
        return [];
      }
      if (modif === true) {
        grid = this.sudokuSolverWithPossibility(grid);
      }
      return grid;
    }

    // Permet de resoudre le sudoku en utilisant le Backtracking
    sudokuSolverWithRandonPossibility = (grid) => {
      let gridclone = grid.map((arr) => {
        return arr.slice();
      });
      for (let y = 0; y < 9; ++y) {
        for (let x = 0; x < 9; ++x) {
          if (gridclone[y][x] === "") {
            let possibility = this.possibilityCalc(gridclone, x, y);
            let len = possibility.length;
            if (len ===  0) {
              return;
            }
            let i = 1;
            gridclone[y][x] = possibility[0];
            while (i < len && this.sudokuSolver(gridclone) === false) {
              gridclone[y][x] = possibility[i++];
            }
            this.nbEmptyCase--;
          }
        }
      }
      return gridclone;
    }

    // Met en relation les deux fonction pour resoudre afin qu'elle soient complementaire
    sudokuSolver = (grid) => {
      let gridclone = grid.map((arr) => {
        return arr.slice();
      });
      let result = this.sudokuSolverWithPossibility(gridclone);
      if (result.length > 0 && this.checkIfCaseIsEmpty(result) === 0) {
        this.setState({gridSolved: result});
        return true;
      } else if (result.length > 0 && this.nbEmptyCase > 0) {
        this.sudokuSolverWithRandonPossibility(result);
      }
      return false;
    }

    // Permet de verifier si un chiffre peux etre place a une position donnée
    checkInputPos = (grid, value, pos) => {
      if (grid[pos.y].indexOf(value) !== -1) {
        return false;
      }
      for (let i = 0; i < 9; ++i) {
        if (grid[i][pos.x] === value) {
          return false;
        }
      }
      for (let y = parseInt(pos.y / 3) * 3, lengthY = parseInt(pos.y / 3) * 3 + 3; y < lengthY; ++y) {
        for (let x = parseInt(pos.x / 3) * 3, lengthX = parseInt(pos.x / 3) * 3 + 3; x < lengthX; ++x) {
          if (grid[y][x] === value) {
            return false;
          }
        }
      }
      return true;
    }

    // Permet de savoir si un chiffre peux etre mis a qu'un seul endroit afin d'eliminer des possibilité
    checkIfOnlyCaseInBloc = (grid, value, pos) => {
      for (let y = parseInt(pos.y / 3) * 3, lengthY = parseInt(pos.y / 3) * 3 + 3; y < lengthY; ++y) {
        for (let x = parseInt(pos.x / 3) * 3, lengthX = parseInt(pos.x / 3) * 3 + 3; x < lengthX; ++x) {
          if (grid[y][x] === "" && (y !== pos.y || pos.x !== x) && this.checkInputPos(grid, value, {y: y, x: x}) === true) {
            return false;
          }
        }
      }
      return true;
    }

    // Pemet de retourner le nombre de case vide
    checkIfCaseIsEmpty = (grid) => {
      let nb = 0
      for (let y = 0; y < 9; ++y) {
        for (let x = 0; x < 9; ++x) {
          if (grid[y][x] === "") {
            ++nb;
          }
        }
      }
      return nb;
    }

    // Permet a l'utilisateur de reset la grille
    reset = () => {
      this.setState({
        gridFirst: [],
        gridSolved: [],
        solve: false,
      });
    }

    // Permet de changer la grille avec celle que l'utilisateur a choisi
    gridSelected = (index) => {
      this.setState({
        sudokuSelected: index
      })
    }

    // Retourne la liste des bouttons des grille deja rentré afin que l'utilisateur puisse ne pas a avoir tout a remplir
    displayDispoGrid = () => {
      return this.state.grids.map((grid, index) => {
        if (index !== this.state.sudokuSelected) {
          return <DisplayDispoGrid key={index} gridSelected={this.gridSelected} index={index}/>;
        }
        return "";
      });
    }

    render = () => {
      return (
        <div className="col-xs-12">
          { this.state.solve && this.state.gridSolved !== [] ?
            <div>
              <h3 className="margin-top">Voici la solution du sudoku</h3>
              <div className="row">
                <div className="col-md-auto offset-md-3">
                  <DisplayGrid key="init" grid={this.state.gridFirst} edit={0} />
                </div>
                <div className="col-md-auto">
                  <DisplayGrid key="solved" grid={this.state.gridSolved} edit={0} />
                </div>
              </div>
              <button type="button" className="btn btn-primary margin-top" onClick={this.reset} >Résoudre un autre Sudoku</button>
            </div>
          :
            <div>
              <h3 className="margin-top">Veuillez remplir la grille pour ensuite resoudre le sudoku</h3>
              <div>
                {this.displayDispoGrid()}
              </div>
              <DisplayGrid key={this.state.sudokuSelected}
                grid={this.state.grids[this.state.sudokuSelected]}
                edit={1}
                error={this.state.error}
                solve={this.solve}
              />
              <ReactTooltip place="top" type="dark" effect="solid"/>
            </div>
          }
        </div>
      );
    }
}
