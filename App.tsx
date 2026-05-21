import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Pokemon = {
  id: number;
  name: string;
  image: string;
  height?: number;
  weight?: number;
  type?: string;
  ability?: string;
};

type PokemonListItem = {
  name: string;
  url: string;
};

export default function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filtered, setFiltered] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPokemons();
  }, []);

  async function loadPokemons() {
    try {
      const res = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=150'
      );

      const data: { results: PokemonListItem[] } =
        await res.json();

      const list = await Promise.all(
        data.results.map(async (item) => {
          const res = await fetch(item.url);
          const details = await res.json();

          return {
            id: details.id,
            name: details.name,
            image: details.sprites.front_default,
            height: details.height,
            weight: details.weight,
            type: details.types[0].type.name,
            ability: details.abilities[0].ability.name,
          };
        })
      );

      setPokemons(list);
      setFiltered(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  /* 🔥 COR DOS CARDS */
  function getPokemonColor(type?: string) {
    switch (type) {
      case 'fire':
        return '#f77f00';

      case 'water':
        return '#3a86ff';

      case 'grass':
        return '#38b000';

      case 'electric':
        return '#ffd60a';

      case 'psychic':
        return '#ff006e';

      case 'ghost':
        return '#6a4c93';

      case 'dragon':
        return '#4361ee';

      case 'fairy':
        return '#ff87ab';

      case 'rock':
        return '#9c6644';

      case 'ground':
        return '#bc6c25';

      case 'poison':
        return '#9d4edd';

      case 'bug':
        return '#70e000';

      case 'ice':
        return '#90e0ef';

      case 'fighting':
        return '#d00000';

      case 'normal':
        return '#adb5bd';

      default:
        return '#efefef';
    }
  }

  /* 🔥 BUSCA */
  function handleSearch(text: string) {
    setSearch(text);

    const filteredList = pokemons.filter((p) =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );

    setFiltered(filteredList);
  }

  /* 🔥 LIMPAR BUSCA */
  function clearSearch() {
    setSearch('');
    setFiltered(pokemons);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <View style={styles.bigLight} />

        <View>
          <Text style={styles.logo}>POKÉDEX</Text>

          <View style={styles.lights}>
            <View style={[styles.light, { backgroundColor: '#ff0000' }]} />
            <View style={[styles.light, { backgroundColor: '#ffd60a' }]} />
            <View style={[styles.light, { backgroundColor: '#38b000' }]} />
          </View>
        </View>
      </View>

      {/* 🔥 PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar Pokémon..."
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor="#555"
        />

        {/* 🔥 BOTÃO VOLTAR */}
        {search.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
          >
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🔥 LISTA */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const cardColor = getPokemonColor(item.type);

            return (
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    backgroundColor: cardColor,
                  },
                ]}
                onPress={() => setSelected(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />

                <Text style={styles.name}>
                  {item.name.toUpperCase()}
                </Text>

                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>
                    {item.type?.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* 🔥 MODAL */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <Image
                  source={{ uri: selected.image }}
                  style={styles.modalImage}
                />

                <Text style={styles.title}>
                  {selected.name.toUpperCase()}
                </Text>

                <Text style={styles.info}>
                  Altura: {selected.height}
                </Text>

                <Text style={styles.info}>
                  Peso: {selected.weight}
                </Text>

                <Text style={styles.info}>
                  Tipo: {selected.type}
                </Text>

                <Text style={styles.info}>
                  Habilidade: {selected.ability}
                </Text>

                <TouchableOpacity
                  onPress={() => setSelected(null)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    FECHAR
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b71c1c',
    paddingTop: 40,
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#d62828',
    padding: 15,
    borderRadius: 25,

    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 6,
    borderBottomWidth: 6,

    borderTopColor: '#ff6b6b',
    borderLeftColor: '#ff6b6b',
    borderRightColor: '#7f0000',
    borderBottomColor: '#7f0000',
  },

  bigLight: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3a86ff',
    borderWidth: 5,
    borderColor: '#d9f0ff',
    marginRight: 15,
  },

  logo: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 3,
  },

  lights: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },

  light: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
  },

  /* 🔥 PESQUISA */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  input: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,

    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 4,
    borderRightWidth: 4,

    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderBottomColor: '#666',
    borderRightColor: '#666',
  },

  /* 🔥 SETA */
  clearButton: {
    marginLeft: 10,
    backgroundColor: '#1d3557',
    width: 45,
    height: 45,
    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 4,
    borderRightWidth: 4,

    borderTopColor: '#4d6fa3',
    borderLeftColor: '#4d6fa3',
    borderBottomColor: '#0b1320',
    borderRightColor: '#0b1320',
  },

  arrow: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  /* 🔥 CARD */
  card: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,

    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 5,
    borderRightWidth: 5,

    borderTopColor: 'rgba(255,255,255,0.6)',
    borderLeftColor: 'rgba(255,255,255,0.6)',
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderRightColor: 'rgba(0,0,0,0.3)',
  },

  image: {
    width: 90,
    height: 90,
  },

  name: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#fff',
    letterSpacing: 1,
    fontSize: 15,
  },

  typeBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },

  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#d62828',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
  },

  modalImage: {
    width: 150,
    height: 150,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },

  info: {
    fontSize: 16,
    marginTop: 5,
    color: '#fff',
  },

  button: {
    marginTop: 20,
    backgroundColor: '#1d3557',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});