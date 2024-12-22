package com.triolingo.controller;

import com.triolingo.entity.language.Language;
import com.triolingo.repository.LanguageRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/language")
public class LanguageController {
    private final LanguageRepository languageRepository;

    public LanguageController(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    @GetMapping
    public List<String> getAllLanguages() {
        return languageRepository.findAll().stream().map(Language::getName).toList();
    }
}
