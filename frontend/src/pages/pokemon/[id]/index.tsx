import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { client } from "services/backend/client";
import { BasePokemon, CreatePropertyCommand, EnrichedPokemonDto, PokeEnricherFetchClient } from "services/backend/client.generated";
import { useRouter } from 'next/router';
import { Button, FormControl, FormLabel, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React from "react";
import ShowCasePokemonInfo from "components/ShowCasePokemonInfo";

type Props = {
  pokeId?: string
}

// pokemon/[id]
const PokemonInfo: NextPage<Props> = ({ pokeId }) => {

  const [newDataEntryName, setNewDataEntryName] = useState("");
  const [newDataEntryValue, setNewDataEntryValue] = useState("");
  const [pokemon, setPokemon] = useState<EnrichedPokemonDto>(null);
  const router = useRouter()
  // const { pokeId } = pokeProps
  // const { id } = router.query

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()
  const finalRef = React.useRef()

  const AddPokemonData = useCallback(() => {
    const newData: CreatePropertyCommand = {
      userId: 1,
      pokeId: pokemon.basePokemon.id,
      name: newDataEntryName,
      value: newDataEntryValue
    };
    const tempPokemon = pokemon;
    tempPokemon.extraEntries.push({
      name: newDataEntryName,
      userId: 1,
      value: newDataEntryValue
    });
    client(PokeEnricherFetchClient).then(c =>
      c.pokeEnricher_AddProperty(newData)
        .then((response) => {
          setPokemon(tempPokemon)
        })
        .catch(error => alert(error))
    );

    onClose();
  }, [pokemon, setPokemon, newDataEntryName, newDataEntryValue]);

  useEffect(() => {
    client(PokeEnricherFetchClient).then(c =>
      c.pokeEnricher_GetEnrichedPokemon(parseInt(pokeId)).then(basePokemon => {
        setPokemon(basePokemon);
      })
    );
  }, []);

  return (
    <div>
      <ShowCasePokemonInfo
        basePokemon={pokemon?.basePokemon}
        extraEntries={pokemon?.extraEntries}
        pokemonId={pokemon?.basePokemon.id}>

      </ShowCasePokemonInfo>
      <Button onClick={onOpen}>Tilføj pokemon data</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ny data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Data navn</FormLabel>
              <Input ref={initialRef} placeholder="handikap" onChange={e => setNewDataEntryName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Værdi</FormLabel>
              <Input placeholder="skriv værdi" onChange={e => setNewDataEntryValue(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={AddPokemonData}>
              Add Pokemon data
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

PokemonInfo.getInitialProps = async ({ query }) => {
  const { id } = query;
  return { pokeId: id };
}

export default PokemonInfo;
