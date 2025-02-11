import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { KnowledgeLevel } from "@/types/language-level";
import KnowledgeSelect from "./KnowledgeSelect";

type LanguageDialogType = {
    addLanguage: (language: string, level?: KnowledgeLevel) => void;
    isStudent: boolean;
    allLanguages: string[];
    pickedLanguages: string[];
};

export default function LanguageDialog({
    addLanguage,
    isStudent,
    allLanguages,
    pickedLanguages,
}: LanguageDialogType) {
    const [language, setLanguage] = useState("");
    const [level, setLevel] = useState(KnowledgeLevel.BEGINNER);
    const { toast } = useToast();

    function renderAvailableLanguages() {
        const leftover = allLanguages.filter(
            (lang) => !pickedLanguages.includes(lang)
        );

        return leftover.map((val) => (
            <SelectItem key={val} value={val}>
                {val}
            </SelectItem>
        ));
    }

    function showKnowledgeLevelSelect() {
        if (!isStudent) return null;

        return (
            <KnowledgeSelect
                onValueChange={(val: KnowledgeLevel) => setLevel(val)}
                placeholder="Knowledge level"
            />
        );
    }

    return (
        <>
            <Dialog>
                <div className="flex w-full justify-center">
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                                if (
                                    pickedLanguages.length ===
                                    allLanguages.length
                                ) {
                                    toast({
                                        title: "You already picked all available languages! Amazing!",
                                        description: "How are you human?",
                                    });
                                    e.preventDefault();
                                }
                            }}
                        >
                            + Add a language
                        </Button>
                    </DialogTrigger>
                </div>
                {pickedLanguages.length !== allLanguages.length ? (
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="p-2">
                            <DialogTitle>Choose Your Language</DialogTitle>
                            <DialogDescription>
                                {isStudent
                                    ? "Select the language you'd like to learn and tell us about your knowledge level."
                                    : "Select the languages you'd like to teach."}
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
                                    onClick={() => {
                                        if (language) {
                                            addLanguage(
                                                language,
                                                isStudent ? level : undefined
                                            );
                                            setLanguage("");
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                ) : null}
            </Dialog>
        </>
    );
}
