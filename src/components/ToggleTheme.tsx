import { useState, useRef, useEffect, useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useTheme } from "@/hooks/clientState/useTheme";

type IconProps = {
  size?: number;
  className?: string;
};

// Simple icon components
const SunIcon = ({size = 20, className}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({size = 20, className}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = ({size = 20, className}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight - 70,
  });
  const toggleRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 100),
        y: Math.min(prev.y, window.innerHeight - 70),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - startPos.current.x;
      const newY = e.clientY - startPos.current.y;

      // Boundaries
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 70;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={toggleRef}
      className={`fixed z-50 flex items-center justify-center p-1 rounded-xl shadow-lg bg-background border border-border transition-all duration-200 ${
        isDragging
          ? "cursor-grabbing opacity-90"
          : "cursor-grab hover:opacity-100"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(value: "light" | "dark" | "system") => {
          setTheme(value);
        }}
        variant="outline"
        size="sm"
        className="bg-background"
      >
        <ToggleGroupItem value="light" aria-label="Light theme">
          <SunIcon size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark theme">
          <MoonIcon size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="System theme">
          <MonitorIcon size={16} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ThemeToggle;
