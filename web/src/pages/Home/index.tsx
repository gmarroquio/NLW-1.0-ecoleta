import React from "react";
import {Link} from 'react-router-dom'
import { FiLogIn } from "react-icons/fi";

import "./styles.css";
import logo from "../../assets/logo.svg";

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Logo ecoleta" />
        </header>

        <main>
          <h1>Seu market place de coleta de residuos.</h1>
          <p>
            Ajudamos pessoas a encotrarem pontos de coletas de forma eficiente
          </p>

          <Link to="/cadastro">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadaster um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
