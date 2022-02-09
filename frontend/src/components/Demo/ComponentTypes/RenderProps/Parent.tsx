import { FC, ReactElement, useState } from "react";

interface InjectedProps {
  count: number;
  incrementCount: () => void;
}

interface Props {
  startCount?: number;
  children(_data: InjectedProps): ReactElement;
}

const Parent: FC<Props> = ({ startCount = 0, children }) => {
  const [count, setCount] = useState(startCount);

  const incrementCount = () => setCount(x => x + 1);

  return children({ count, incrementCount });
};

export default Parent;
