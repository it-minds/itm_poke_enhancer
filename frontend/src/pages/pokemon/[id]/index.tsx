import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { client } from "services/backend/client";
import { BasePokemon, CreatePropertyCommand, PokeEnricherFetchClient, PokeServiceDto } from "services/backend/client.generated";
import { useRouter } from 'next/router';
import { Button, FormControl, FormLabel, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React from "react";

const Index: NextPage = () => {

  const [newDataEntryName, setNewDataEntryName] = useState("");
  const [newDataEntryValue, setNewDataEntryValue] = useState("");
  const [pokemon, setPokemon] = useState<PokeServiceDto>(null);
  const { asPath } = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()
  const finalRef = React.useRef()

  const AddPokemonData = useCallback(() => {
    const newData: CreatePropertyCommand = {
      userId: pokemon.pokeId,
      pokeId: pokemon.pokeId,
      name: "ting",
      value: "ting2"
    };

    client(PokeEnricherFetchClient).then(c =>
      c.pokeEnricher_AddProperty(newData).catch(error => alert(error))
    )
  }, []);

  useEffect(() => {
    client(PokeEnricherFetchClient).then(c =>
      c.pokeEnricher_GetPokemon(1).then(basePokemon => {
        setPokemon(basePokemon);
      })
    );
  }, []);

  return (
    <div>
      <p>Hello</p>
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
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Index;
