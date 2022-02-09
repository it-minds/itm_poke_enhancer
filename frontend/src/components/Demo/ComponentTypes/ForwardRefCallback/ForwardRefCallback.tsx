import { Button, Stack } from "@chakra-ui/react";
import { FC, useCallback, useRef } from "react";

import UsernamePasswordLogin, { ClickHandler } from "./UsernamePasswordLogin";

const ForwardRefCallback: FC = () => {
  const childRef = useRef<ClickHandler>();

  const clickClientLogin = useCallback(async () => {
    const { username, password } = childRef.current.getState();
    console.log(username, password);
  }, []);

  return (
    <Stack>
      <UsernamePasswordLogin ref={childRef} />

      <Button onClick={clickClientLogin} colorScheme="green">
        Login
      </Button>
    </Stack>
  );
};

export default ForwardRefCallback;
