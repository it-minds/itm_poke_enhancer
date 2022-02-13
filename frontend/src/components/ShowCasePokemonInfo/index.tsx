import { Container, Box, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import pokemon from "pages/pokemon";
import { FC } from "react";
import { BasePokemon, PokeExtraEntryDto } from "services/backend/client.generated";
import styles from './styles.module.css';


type Props = {
  pokemonId: number,
  basePokemon: BasePokemon,
  extraEntries: PokeExtraEntryDto[],
}

const ShowCasePokemonInfo: FC<Props> = (props: Props) => {

  const { pokemonId, basePokemon, extraEntries } = props;

  return (
    <Container maxW='container.lg'>
      <Box className={styles.headLine} textStyle='h1'>{basePokemon?.name}</Box>
      <br />
      <Flex direction={"row"} wrap={"wrap"} justifyContent={'space-between'} className={styles.flexBox}>
        {extraEntries?.map(entry => <InfoEntry key={entry.name} entryInfo={entry}></InfoEntry>)}
      </Flex>
    </Container>
  )
}

type infoProp = {
  entryInfo: PokeExtraEntryDto
}

const InfoEntry: FC<infoProp> = (pokeEntry: infoProp) => {

  const { entryInfo } = pokeEntry

  return (
    <div className={styles.infoEntry}>
      <FormControl>
        <FormLabel>{entryInfo?.name}</FormLabel>
        <Input placeholder={entryInfo?.value} />
      </FormControl>
    </div>
  )
}

export default ShowCasePokemonInfo;
