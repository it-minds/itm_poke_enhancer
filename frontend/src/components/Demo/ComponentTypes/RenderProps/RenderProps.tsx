import { FC } from "react";

import ChildButton from "./ChildButton";
import ChildP from "./ChildP";
import Parent from "./Parent";

const RenderProps: FC = () => {
  return (
    <Parent startCount={110}>
      {({ count, incrementCount }) => (
        <>
          <ChildP>The current count is {count}</ChildP>
          <ChildButton onClick={incrementCount}>Click to increase!</ChildButton>
        </>
      )}
    </Parent>
  );
};

export default RenderProps;

/**
 * This example showcases how a single component can "raise" state via "render props".
 * Here Parent raises its state to this component but only to the children composed below it. Similar to a context provider.
 *
 * The way this differs from using context is simple. It removed dependency on specific contexts from the children and allows a broader use case. (Open/Close principal)
 * This is the preferred approach when creating components that shares state but can also be used in different ways/contexts.
 * ! Very useful for style components!
 */
