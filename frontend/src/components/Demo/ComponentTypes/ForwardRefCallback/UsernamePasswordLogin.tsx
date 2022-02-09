import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/react";
import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from "react";

export interface ClickHandler {
  getState: () => { username: string; password: string };
}

const UsernamePasswordLogin: ForwardRefRenderFunction<ClickHandler, unknown> = (_props, ref) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = React.useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        getState: () => ({ username: username.toLowerCase(), password })
      };
    },
    [username, password]
  );

  return (
    <Stack>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          placeholder="Enter Email"
          variant="flushed"
          value={username}
          onChange={x => setUsername(x.target.value)}
        />
      </InputGroup>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          variant="flushed"
          value={password}
          onChange={x => setPassword(x.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </Stack>
  );
};
UsernamePasswordLogin.displayName = "UsernamePasswordLogin";

export default forwardRef(UsernamePasswordLogin);
