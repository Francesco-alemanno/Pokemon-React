import { useState } from "react";
import "/css-componenti/Pokemon.css";

function Pokemon() {
  const [pokemonData, setPokemonData] = useState(null);
  const [inputName, setInputName] = useState("");
  const [errore, setErrore] = useState("");
  const [erroreApi, setErroreApi] = useState("");
  const [description, setDescription] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [pokedex, setPokedex] = useState([]);
  const [collapsedError, setCollapsedError] = useState(false);

  const typeColors = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    normal: "#A8A878",
    fighting: "#C03028",
    flying: "#A890F0",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    bug: "#A8B820",
    ghost: "#705898",
    steel: "#B8B8D0",
  };

  async function ricerca(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${inputName}`
      );
      if (!response.ok) {
        setErroreApi("errore durante il fetch dati");
      } else {
        const data = await response.json();
        setPokemonData(data);
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${inputName.toLowerCase()}`
        );
        const speciesData = await speciesResponse.json();

        const entry = speciesData.flavor_text_entries.find(
          (e) => e.language.name === "it"
        );

        setDescription(
          entry
            ? entry.flavor_text.replace(/\f|\n/g, " ")
            : "Descrizione non disponibile"
        );
      }
    } catch (error) {
      setErrore("errore ", error);
    }
  }
  function onChangeInput(event) {
    event.preventDefault();
    setInputName(event.target.value);
  }
  function handleToggle() {
    setCollapsed((t) => !t);
  }

  function aggiungiAlPokedex() {
    if (pokemonData && !pokedex.find((p) => p.id === pokemonData.id)) {
      setPokedex([...pokedex, pokemonData]);
    } else {
      setErrore("hai già selezionato questo pokemon");
    }
  }
  function rimuoviDalPokedex(id) {
    setPokedex(pokedex.filter((pokemon) => pokemon.id !== id));
  }

  return (
    <>
    {/*   CAMPO INPUT DI RICERCA */}
      {collapsed && (
        <form onSubmit={ricerca} className="container">
          <input
            className="input-search"
            type="text"
            value={inputName}
            onChange={onChangeInput}
            placeholder="Cerca il tuo pokemon..."
          />
          <button className="cerca-btn">Cerca!</button>
        </form>
      )}

      {/* FINE CAMPO INPUT DI RICERCA */}

      {/* TASTO PER ARPIRE E CHIUDERE POKEDEX */}
      <button className="pokedex-btn" onClick={handleToggle}>
        {!collapsed ? "RIMUOVI POKEDEX" : "MOSTRA POKEDEX"}
      </button>
      {/* FINE TASTO POKEDEX */}

      {/* POKEDEX */}
      {!collapsed && (
        <div className="pokedex">
          <h2>Il tuo Pokédex</h2>
          {pokedex.length === 0 ? (
            <p>Nessun Pokémon nel Pokédex</p>
          ) : (
            pokedex.map((pokemon) => (
              <div
                key={pokemon.id}
                className="poke-card"
                style={{
                  backgroundColor:
                    typeColors[pokemon.types[0].type.name] || "white",
                }}
              >
                <div className="name-type">
                  <div>
                    <p>{pokemon.name.toUpperCase()}</p>
                  </div>
                  <div>
                    <p>type: {pokemon.types[0].type.name.toUpperCase()}</p>
                  </div>
                </div>
                <img
                  src={pokemon.sprites.front_default}
                  alt="photo-pokemon"
                  width={200}
                  className="photo-pokemon"
                />
                <div className="hp">
                  <p>HP: {pokemon.stats[0].base_stat}</p>
                </div>
                <button onClick={() => rimuoviDalPokedex(pokemon.id)}>
                  Rimuovi
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {/* FINE POKEDEX */}

      {/* ERRORE DURANTE LA RICERCA DEL POKEMON */}
      {erroreApi && (
        <div className="error-box">
          <h4 style={{ color: "red" }}> ATTENZIONE!</h4>
          <p>Pokemon non esistente o scritto male!</p>
          <button
            onClick={() => {
              setErroreApi(null);
            }}
          >
            Chiudi
          </button>
        </div>
      )}
      {/* FINE ERRORE DURANTE LA RICERCA DEL POKEMON */}

      {/* ERROR BOX POKEMON GIA NEL POKEDEX */}
      {errore && collapsed && (
        <div className="error-box">
          <h4 style={{ color: "red" }}> ATTENZIONE!</h4>
          <p>Hai già selezionato questo pokemon!</p>
          <button
            onClick={() => {
              setErrore(null);
            }}
          >
            Chiudi
          </button>
        </div>
      )}
      {/* FINE ERROR BOX POKEMON GIA NEL POKEDEX */}


      {/* POKECARD  */}
      {pokemonData && collapsed && !errore && !erroreApi && (
        <div
          className="poke-card"
          style={{
            backgroundColor:
              typeColors[pokemonData.types[0].type.name] || "white",
          }}
        >
          <div className="name-type">
            <div>
              <p>{pokemonData.name.toUpperCase()}</p>
            </div>
            <div>
              <p> type:{pokemonData.types[0].type.name.toUpperCase()}</p>
            </div>
          </div>

          <img
            src={pokemonData.sprites.front_default}
            alt="photo-pokemon"
            width={200}
            style={{ boxSizing: "border-box" }}
            className="photo-pokemon"
          />
          <div className="hp">
            <p> HP: {pokemonData.stats[0].base_stat}</p>
          </div>

          <div className="description">
            <p>{description}</p>
          </div>
          <button onClick={aggiungiAlPokedex}>aggiungi al pokedex!</button>
        </div>
      )}
      {/* FINE POKECARD  */}

    </>
  );
}
export default Pokemon;
