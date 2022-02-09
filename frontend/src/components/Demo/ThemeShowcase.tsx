import {
  Button,
  Center,
  Container,
  DarkMode,
  HStack,
  LightMode,
  Progress,
  Stack,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useColors } from "hooks/useColors";
import { useToggle } from "hooks/useToggle";
import { FC } from "react";
import { Themes, useSwitchTheme } from "services/theme/useSwitchTheme";

const ThemeShowcase: FC = () => {
  const { changeTheme } = useSwitchTheme();

  const { menuBg } = useColors();
  const { toggleColorMode } = useColorMode();

  const [theme, toggleTheme] = useToggle([Themes.Normal, Themes.Martins]);

  return (
    <Container>
      <Center>
        <Stack mt={8} m={4} p={4} bg={menuBg} spacing={4}>
          <Text>Here is some random text!</Text>
          <Button
            onClick={() => {
              toggleTheme();
              changeTheme(theme);
            }}>
            Click to change theme!
          </Button>
          <Button onClick={toggleColorMode}>Click Here to change color mode (light|dark)</Button>

          {["red", "green"].map(c => (
            <HStack key={c}>
              <LightMode>
                <Button colorScheme={c}>This one is light</Button>
              </LightMode>
              <DarkMode>
                <Button bg={c + ".400"}>
                  <Text color="gray.50">This one is in the middle</Text>
                  <Text color="gray.800">This one is in the middle</Text>
                </Button>

                <Button colorScheme={c}>This one is dark</Button>
              </DarkMode>
            </HStack>
          ))}
          {["yellow", "purple", "pink", "orange", "blue"].map(c => (
            <Progress
              key={"x" + c}
              colorScheme={c}
              value={Math.random() * 60 + 20}
              size="lg"
              hasStripe
            />
          ))}
        </Stack>
      </Center>
    </Container>
  );
};

ThemeShowcase.displayName = "theme showcase component";

export default ThemeShowcase;
