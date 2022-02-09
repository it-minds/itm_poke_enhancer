import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  useColorModeValue,
  useToken,
  VStack
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "@react-icons/all-files/md/MdKeyboardArrowDown";
import { MdKeyboardArrowUp } from "@react-icons/all-files/md/MdKeyboardArrowUp";
import { useColors } from "hooks/useColors";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type DropdownType from "types/SelectType";

import styles from "./styles.module.css";

type Props = {
  placeholder?: string;
  options: DropdownType[];
  onSelect?: (_selected: DropdownType) => void;
  isLoading?: boolean;
  value?: DropdownType;
};

const LIGHT = "blue.500";
const DARK = "blue.300";

const ComboSelect: FC<Props> = ({
  placeholder = "Click to enable combo box",
  options,
  onSelect = () => null,
  isLoading = false,
  value = null
}) => {
  const [active, setActive] = useState(false);
  const [activeItem, setActiveItem] = useState<DropdownType>(value);
  const [searchValue, setSeachValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<number>(-1);

  const { hoverBg } = useColors();
  const borderColorToken = useColorModeValue(LIGHT, DARK);
  const [lightColor, darkColor] = useToken("colors", [LIGHT, DARK]);
  const borderColor = useMemo(() => {
    if (borderColorToken === LIGHT) return lightColor;
    if (borderColorToken === DARK) return darkColor;
  }, [lightColor, darkColor, borderColorToken]);

  const filteredOptions = useMemo(
    () => options.filter(x => x.name.indexOf(searchValue) !== -1),
    [searchValue, options]
  );

  useEffect(() => {
    setActiveItem(value);
  }, [value]);

  const select = useCallback(
    (item: DropdownType) => {
      setSeachValue(item.name);
      setActiveItem(item);
      setActive(false);
      onSelect(item);
      inputRef.current.focus();
    },
    [onSelect]
  );

  const focusElement = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, item: DropdownType) => {
      if (active) {
        const keyValue = e.code;
        if (keyValue === "ArrowDown") {
          if (focusRef.current >= Math.min(filteredOptions.length - 1, 249)) focusRef.current = -1;
          const id = "#combobox" + ++focusRef.current;

          const element = stackRef.current.querySelector(id);

          (element as HTMLInputElement)?.focus();
        } else if (keyValue === "ArrowUp") {
          if (focusRef.current <= 0) {
            focusRef.current = Math.min(filteredOptions.length, 250);
          }
          const id = "#combobox" + --focusRef.current;

          const element = stackRef.current.querySelector(id);

          (element as HTMLInputElement)?.focus();
        } else if (keyValue === "Enter" || keyValue === "Space") {
          if (item !== null) select(item);
        }
        // else setSeachValue(str => str + e.key);
      }
    },
    [active, filteredOptions, select]
  );

  useEffect(() => {
    focusRef.current = -1;
  }, [active]);

  return (
    <Box className={styles.comboBox}>
      <Popover isOpen={active} placement="bottom" autoFocus={false} gutter={0}>
        <PopoverTrigger>
          <InputGroup>
            <Input
              isReadOnly={!active}
              placeholder={placeholder}
              value={active ? searchValue : activeItem?.name ?? ""}
              // TODO check value from props and see if the component displays a selected value BEFORE render.
              onChange={(e: any) => setSeachValue(e.target.value)}
              onKeyDown={(e: any) => focusElement(e, null)}
              ref={inputRef}
              onClick={() => setActive(true)}
              {...(active && {
                borderColor: borderColor,
                boxShadow: "0 0 0 1px " + borderColor
              })}
            />
            <InputRightElement>
              <IconButton
                size="xs"
                aria-label="dropdown-toggle"
                onClick={() => setActive(!active)}
                icon={active ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              />
            </InputRightElement>
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent
          data-display="static"
          mt={"-4px"}
          borderTop="none"
          borderTopLeftRadius="0"
          borderTopRightRadius="0"
          borderColor={borderColor}
          boxShadow={"0 1px 0 1px " + borderColor}>
          <PopoverBody>
            <VStack align="left" maxH={active ? 60 : 4} overflowY="auto" ref={stackRef} spacing={0}>
              {isLoading && <Skeleton h={2} />}
              {filteredOptions.length > 250 && (
                <Input
                  isReadOnly
                  color="orange.500"
                  variant="flushed"
                  userSelect="none"
                  value="Too many results, narrow your search."
                />
              )}
              {filteredOptions.slice(0, 250).map((x, i) => (
                <Input
                  islazy="true"
                  variant="flushed"
                  readOnly
                  id={"combobox" + i}
                  key={x.id}
                  onClick={() => select(x)}
                  tabIndex={-1}
                  cursor="pointer"
                  userSelect="none"
                  onKeyDown={(e: any) => focusElement(e, x)}
                  p={2}
                  _focus={{
                    background: hoverBg
                  }}
                  _hover={{
                    background: hoverBg
                  }}
                  value={x.name}
                />
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default ComboSelect;
