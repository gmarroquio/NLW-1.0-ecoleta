import React, { useEffect, useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { View, ImageBackground, Text, Image, StyleSheet } from "react-native";
import { Picker } from "@react-native-community/picker";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ItemValue } from "@react-native-community/picker/typings/Picker";

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

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("");

  /** Select UF */
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

  /** Select city */
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

  const handleSelectUf = (e: ItemValue) => {
    setSelectedUf(String(e));
  };
  const handleSelectCity = (e: ItemValue) => {
    setSelectedCity(String(e));
  };

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <Picker
          mode="dropdown"
          selectedValue={selectedUf}
          style={styles.input}
          onValueChange={handleSelectUf}
        >
          <Picker.Item label="Selecione o estado" value="0" />
          {ufs.map((uf) => (
            <Picker.Item key={uf.id} label={uf.name} value={uf.uf} />
          ))}
        </Picker>
        <Picker
          mode="dropdown"
          selectedValue={selectedCity}
          style={styles.input}
          onValueChange={handleSelectCity}
        >
          <Picker.Item label="Selecione a cidade" value="0" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>
        <RectButton
          style={styles.button}
          onPress={() =>
            navigation.navigate("Points", {
              uf: selectedUf,
              city: selectedCity,
            })
          }
        >
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    color: "#444",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
