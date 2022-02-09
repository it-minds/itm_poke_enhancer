import { useToast } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useHub } from "services/signalR/useHub";

const SignalRReceive: FC = () => {
  const { hub } = useHub("exampleHub");
  const toast = useToast({});

  const [timeOfMsg, setTimeOfMsg] = useState<number>(null);

  useEffect(() => {
    hub.onEvent("receiveMessage", message => {
      setTimeOfMsg(Date.now);

      toast({
        title: "New message!",
        description: message,
        status: "info",
        duration: 6000,
        isClosable: true,
        variant: "top-accent"
      });
    });
  }, [hub, toast]);

  return (
    <div>
      <p>Last Message Received at: {timeOfMsg ? new Date(timeOfMsg).toLocaleString() : "never"}</p>
    </div>
  );
};

export default SignalRReceive;
