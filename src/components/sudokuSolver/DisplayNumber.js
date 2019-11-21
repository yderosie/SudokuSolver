import React from "react";

// Permet d'afficher les cases
const DisplayNumber = React.memo(({value, edit = 1, handleChange, pos, error}) => {
  if (edit === 0) {
    return <span>{value !== "" ? value : <span>&nbsp;</span>}</span>
  } else {
    let errorMsg = "Seul les chiffres de 0 à 9 sont autoriser et doit respecter les règles du sudoku"
    return (<input
              className={"text-center form-control col-xs-2" + (error === true ? " has-error is-invalid" : "")}
              data-tip={error === true ? errorMsg : ""}
              onChange={(e) => handleChange(pos, e)}
              value={value} />)
  }
})

export default DisplayNumber;
