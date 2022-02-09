import { Text } from "@chakra-ui/react";
import { FC } from "react";

const ChildP: FC = ({ children }) => {
  return <Text as="b">{children}</Text>;
};

export default ChildP;
