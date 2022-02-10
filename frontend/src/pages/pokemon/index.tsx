import { Box } from "@chakra-ui/react";
import Link from 'next/link'
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { client } from "services/backend/client";
import { BasePokemon, PokeEnricherFetchClient } from "services/backend/client.generated";

const PokelistPage: NextPage = () => {
  const [basePokemon, setBasePokemon] = useState<BasePokemon[]>([]);

  useEffect(() => {
    client(PokeEnricherFetchClient).then(c =>
      c.pokeEnricher_GetAllPokemon().then(basePokemon => {
        console.log(basePokemon);
        setBasePokemon(basePokemon);
      })
    );
  }, []);

  return (
    <div>
      {basePokemon.map(pm => (
        <Link key={pm.id} href={{ pathname: `/pokemon/${pm.id}`, query: { id: pm.id } }} >
          <Box bg="tomato" w="100%" p={4} color="white">
            {pm.id} - {pm.name}
          </Box>
        </Link>
      ))}
    </div>
  );
};

export default PokelistPage;
