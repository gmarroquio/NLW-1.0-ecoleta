import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { LeafletMouseEvent } from "leaflet";
import { Link, useHistory } from "react-router-dom";
import { Map, TileLayer, Marker } from "react-leaflet";
import { FiArrowLeft } from "react-icons/fi";

import api from "../../services/api";

import "./styles.css";

import logo from "../../assets/logo.svg";

interface Item {
  id: number;
  title: string;
  url: string;
}

interface UF {
  id: number;
  uf: string;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface IBGEUFResponse {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECITYResponse {
  id: number;
  nome: string;
}

const CreatePoint: React.FC = () => {
  const [pin, setPin] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Array<number>>([]);
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cityCoord, setCityCoord] = useState<[number, number]>([0, 0]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("");
  const [coord, setCoord] = useState<[number, number]>([0, 0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const history = useHistory();

  useEffect(() => {
    api.get("items").then((response) => setItems(response.data));
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then(({ data }) => {
        const ufs = data.map((estado) => ({
          id: estado.id,
          uf: estado.sigla,
          name: estado.nome,
        }));

        setUfs(ufs);
      });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCityCoord([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGECITYResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then(({ data }) => {
        const cities = data.map((city) => ({ id: city.id, name: city.nome }));
        setCities(cities);
      });
  }, [selectedUf]);

  const handleUfChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(e.target.value);
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const handleMapInput = (e: LeafletMouseEvent) => {
    setPin(true);
    setCoord([e.latlng.lat, e.latlng.lng]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleItemClick = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filtered = selectedItems.filter((item) => item !== id);
      setSelectedItems(filtered);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = coord;
    const image =
      "https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60";
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      image,
      items,
    };

    await api.post("/points", data);

    history.push("/");
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Logo Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        {/** Dados da entidade */}
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        {/** Mapa */}
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={cityCoord} zoom={15} onClick={handleMapInput}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pin && <Marker position={coord} />}
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select
                onChange={handleUfChange}
                value={selectedUf}
                name="uf"
                id="uf"
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf.id} value={uf.uf}>
                    {uf.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                onChange={handleCityChange}
                value={selectedCity}
                name="city"
                id="city"
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/** Itens Coletados */}
        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CreatePoint;
