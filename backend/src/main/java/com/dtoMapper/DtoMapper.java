package com.dtoMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class DtoMapper {
    private final List<DtoMapping<?, ?>> dtoMappings = new ArrayList<>();
    private final HashSet<TypeMapping<?, ?>> typeMappings = new HashSet<>();

    public void addTypeMapping(TypeMapping<?, ?> typeMapping) {
        typeMappings.add(typeMapping);
    }

    public void addMapping(DtoMapping<?, ?> dtoMapping) {
        dtoMappings.add(dtoMapping);
    }

    public <E, D> void addMapping(Class<E> entityClass, Class<D> dtoClass,
            FieldMapping<?, ?>... customFieldMappings) {
        dtoMappings.add(DtoMapping.generateDefaultDtoMapping(entityClass, dtoClass, typeMappings,
                Arrays.asList(customFieldMappings)));
    }

    public <E, D> D createDto(E entity, Class<D> dtoClass) {
        @SuppressWarnings("unchecked")
        DtoMapping<E, D> dtoMapping = (DtoMapping<E, D>) dtoMappings.stream()
                .filter(mapping -> mapping.getEntityClass().isAssignableFrom(entity.getClass())
                        && mapping.getDtoClass().equals(dtoClass))
                .findAny().get();

        return dtoMapping.createDTO(entity);
    }

    public <E, D> E createEntity(D dto, Class<E> entityClass) {
        @SuppressWarnings("unchecked")
        DtoMapping<E, D> dtoMapping = (DtoMapping<E, D>) dtoMappings.stream()
                .filter(mapping -> mapping.getDtoClass().isAssignableFrom(dto.getClass())
                        && mapping.getEntityClass().equals(entityClass))
                .findAny().get();

        return dtoMapping.createEntity(dto);
    }

    public <E, D> E updateEntity(E entity, D dto) {
        @SuppressWarnings("unchecked")
        DtoMapping<E, D> dtoMapping = (DtoMapping<E, D>) dtoMappings.stream()
                .filter(mapping -> mapping.getDtoClass().isAssignableFrom(dto.getClass())
                        && mapping.getEntityClass().isAssignableFrom(entity.getClass()))
                .findAny().get();

        return dtoMapping.updateEntity(entity, dto);
    }

}
