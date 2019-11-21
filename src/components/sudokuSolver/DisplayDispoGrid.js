import React from "react";

// Permet d'afficher les boutons pour les grille deja rentré
const DisplayDispoGrid = React.memo(({index, gridSelected}) => {
  return (<button key={index} type="button" className="btn btn-warning margin-top margin-left" onClick={() => gridSelected(index)} >{index === 0 ? "Grille Vide" : "Grille n°" + index }</button>)
})

export default DisplayDispoGrid;
