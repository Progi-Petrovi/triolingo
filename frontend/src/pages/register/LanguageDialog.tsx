import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type LanguageDialogType = {
  addLanguage: (language: string, level?: string) => void;
  isStudent: boolean;
};

export default function LanguageDialog({
  addLanguage,
  isStudent,
}: LanguageDialogType) {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");

  //TODO: get list of languages from backend
  function renderAvailableLanguages() {
    const tempLanguages = ["English", "Spanish", "French", "Croatian"];
    return tempLanguages.map((val) => (
      <SelectItem key={val} value={val}>
        {val}
      </SelectItem>
    ));
  }

  function showKnowledgeLevelSelect() {
    if (!isStudent) return null;

    return (
      <Select onValueChange={setLevel}>
        <SelectTrigger>
          <SelectValue placeholder="Knowledge level" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Level</SelectLabel>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <Dialog>
        <div className="flex w-full justify-center">
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              + Add a language
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="p-2">
            <DialogTitle>Choose Your Language</DialogTitle>
            <DialogDescription>
              Select the language you'd like to learn and tell us about your
              knowledge level.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Select onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {renderAvailableLanguages()}
                </SelectGroup>
              </SelectContent>
            </Select>
            {showKnowledgeLevelSelect()}
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  addLanguage(language, isStudent ? level : undefined)
                }
              >
                Add
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
