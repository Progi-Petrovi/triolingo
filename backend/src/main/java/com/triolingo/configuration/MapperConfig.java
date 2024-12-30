package com.triolingo.configuration;

import java.util.Collection;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dtoMapper.DtoMapper;
import com.dtoMapper.TypeGetter;
import com.dtoMapper.TypeMapping;
import com.triolingo.entity.language.Language;

@Configuration
public class MapperConfig {

    @Bean
    public DtoMapper getDtoMapper() {
        DtoMapper dtoMapper = new DtoMapper();

        TypeMapping<Collection<Language>, Collection<String>> typeMapping = new TypeMapping<Collection<Language>, Collection<String>>(
                MapperConfig::languagesToString,
                MapperConfig::stringToLanguages,
                new TypeGetter<Collection<Language>>() {
                }.getType(),
                new TypeGetter<Collection<String>>() {
                }.getType());
        dtoMapper.addTypeMapping(typeMapping);

        return dtoMapper;
    }

    private static Collection<String> languagesToString(Collection<Language> languages) {
        return languages.stream()
                .map(language -> language.getName())
                .toList();
    }

    private static Collection<Language> stringToLanguages(Collection<String> languages) {
        return languages.stream()
                .map(languageName -> new Language(0L, languageName))
                .toList();
    }

}
