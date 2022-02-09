import { Button } from "@chakra-ui/react";
import { FC, MouseEventHandler } from "react";

interface Props {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const ChildButton: FC<Props> = ({ children, onClick }) => {
  return (
    <Button p={1} onClick={onClick}>
      {children}
    </Button>
  );
};

export default ChildButton;
