"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export type Region = {
  value: string;
};

const regions: Region[] = [{ value: "eune" }];

type RegionFilterProps = {
  region: Region | undefined;
  setRegion: (region: Region | undefined) => void;
};

export default function RegionFilter({ region, setRegion }: RegionFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-y-2">
        <Label>Bölge</Label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {region
              ? regions.find((reg) => reg.value === region.value)?.value
              : "Bölge seç..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Bölge ara..." className="h-9" />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              {regions.map((reg) => (
                <CommandItem
                  key={reg.value}
                  value={reg.value}
                  onSelect={(currentValue) => {
                    setRegion(
                      currentValue === region?.value
                        ? undefined
                        : { value: currentValue },
                    );
                    setOpen(false);
                  }}
                >
                  {reg.value}
                  <Check
                    className={cn(
                      "ml-auto",
                      reg.value === region?.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
