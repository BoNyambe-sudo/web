import * as React from "react";

import { cn } from "@/lib/utils";
import { useLocation } from "react-router";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

interface DataListProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "list"
> {
  id: string;
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  inputClassName?: string;
  listClassName?: string;
}

const DataList = React.forwardRef<HTMLInputElement, DataListProps>(
  (
    {
      id,
      items,
      value,
      onChange,
      label,
      helpText,
      className,
      inputClassName,
      listClassName,
      onKeyDown,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const inputId = `${id}-input`;
    const helpId = `${id}-help`;
    const listboxId = `${id}-listbox`;
    const location = useLocation();
    const describedBy =
      [props["aria-describedby"], helpText ? helpId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const filteredItems = React.useMemo(() => {
      const query = value.trim().toLowerCase();

      if (!query) return items;

      return items.filter((item) => item.toLowerCase().includes(query));
    }, [items, value]);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (filteredItems.length === 0) {
        setActiveIndex(-1);
      }
    }, [filteredItems.length]);

    React.useEffect(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, [location.pathname]);

    React.useEffect(() => {
      return () => {
        setOpen(false);
        setActiveIndex(-1);
      };
    }, []);

    const selectItem = (item: string) => {
      onChange(item);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    };

    const moveActiveIndex = (direction: 1 | -1) => {
      if (!filteredItems.length) return;

      setOpen(true);
      setActiveIndex((currentIndex) => {
        if (currentIndex === -1) {
          return direction === 1 ? 0 : filteredItems.length - 1;
        }

        return (
          (currentIndex + direction + filteredItems.length) %
          filteredItems.length
        );
      });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      if (event.defaultPrevented) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActiveIndex(1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActiveIndex(-1);
        return;
      }

      if (event.key === "Enter" && open && activeIndex >= 0) {
        event.preventDefault();
        selectItem(filteredItems[activeIndex]);
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);

      if (!event.defaultPrevented) {
        setOpen(true);
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      onChange(newValue);
      setActiveIndex(-1);
      setOpen(true);
    };

    return (
      <div className={cn("relative w-full", className)} data-slot="data-list">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <input
              {...props}
              ref={inputRef}
              id={inputId}
              value={value}
              aria-describedby={describedBy}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              role="combobox"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded={open}
              aria-activedescendant={
                open && activeIndex >= 0
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
              autoComplete="off"
              className={cn(
                "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm",
                inputClassName,
              )}
            />
          </PopoverAnchor>
          {label ? (
            <label htmlFor={inputId} className="sr-only">
              {label}
            </label>
          ) : null}
          {helpText ? (
            <p id={helpId} className="sr-only">
              {helpText}
            </p>
          ) : null}
          <PopoverContent
            id={listboxId}
            role="listbox"
            align="start"
            sideOffset={8}
            className={cn(
              "w-[var(--radix-popover-trigger-width)] p-1",
              listClassName,
            )}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onPointerDownOutside={() => setOpen(false)}
            onEscapeKeyDown={() => setOpen(false)}
          >
            <div className="no-scrollbar max-h-60 overflow-y-auto outline-none">
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No suggestions
                </div>
              ) : (
                <div className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                  {filteredItems.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectItem(item)}
                      className={cn(
                        "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
                      )}
                      data-selected={index === activeIndex || undefined}
                      data-slot="data-list-item"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
DataList.displayName = "DataList";

export { DataList };
