"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

const ToggleMode = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); // helps to check if this component is mounted with help of useEffect below

  useEffect(() => {
    setMounted(true);
  }, []);

  // return a disable button as a placeholder, until the component is mounted and stops a page shift
  if (!mounted) {
    return <Button variant="outline" size="icon" disabled={true}></Button>;
  }

  const dark = theme === "dark"; // checks the theme mode

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(`${dark ? "light" : "dark"}`)}
    >
      {dark ? (
        <Sun className="hover:cursor-pointer hover:text-primary" />
      ) : (
        <Moon className="hover:cursor-pointer hover:text-primary" />
      )}
    </Button>
  );
};

export default ToggleMode;
