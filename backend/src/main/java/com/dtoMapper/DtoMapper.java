package com.dtoMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class DtoMapper {
    private final List<DtoMapping<?, ?>> dtoMappings = new ArrayList<>();
    private final HashSet<TypeMapping<?, ?>> typeMappings = new HashSet<>();
    private final boolean createMappingIfMissing;

    public DtoMapper(boolean createMappingIfMissing) {
        this.createMappingIfMissing = createMappingIfMissing;
    }

    public DtoMapper() {
        this(true);
    }

    public void addTypeMapping(TypeMapping<?, ?> typeMapping) {
        typeMappings.add(typeMapping);
    }

    public void addMapping(DtoMapping<?, ?> dtoMapping) {
        dtoMappings.add(dtoMapping);
    }

    public <E, D> DtoMapping<E, D> addMapping(Class<E> entityClass, Class<D> dtoClass,
            FieldMapping<?, ?>... customFieldMappings) {
        DtoMapping<E, D> dtoMapping = DtoMapping.generateDefaultDtoMapping(entityClass, dtoClass, typeMappings,
                Arrays.asList(customFieldMappings));
        dtoMappings.add(dtoMapping);
        return dtoMapping;
    }

    public <E, D> D createDto(E entity, Class<D> dtoClass) {
        @SuppressWarnings("unchecked")
        DtoMapping<E, D> dtoMapping = (DtoMapping<E, D>) findDtoMapping(entity.getClass(), dtoClass,
                false, true);

        return dtoMapping.createDTO(entity);
    }

    public <E, D> E createEntity(D dto, Class<E> entityClass) {
        @SuppressWarnings("unchecked")
        DtoMapping<E, D> dtoMapping = (DtoMapping<E, D>) findDtoMapping(entityClass, dto.getClass(),
                true, false);

        return dtoMapping.createEntity(dto);
    }

    public <E, D> E updateEntity(E entity, D dto) {
        @SuppressWarnings("unchecked")
        DtoMapping<E, D> dtoMapping = (DtoMapping<E, D>) findDtoMapping(entity.getClass(), dto.getClass(),
                false, false);
        return dtoMapping.updateEntity(entity, dto);
    }

    @SuppressWarnings("unchecked")
    private <E, D> DtoMapping<E, D> findDtoMapping(Class<E> entityClass, Class<D> dtoClass, boolean entityExactMatch,
            boolean dtoExactMatch) {
        DtoMapping<E, D> dtoMapping = (DtoMapping<E, D>) dtoMappings.stream()
                .filter(mapping -> checkClass(mapping.getDtoClass(), dtoClass, false)
                        && checkClass(mapping.getEntityClass(), entityClass, false))
                .findAny().orElse(null);

        if (dtoMapping == null) {
            if (createMappingIfMissing)
                dtoMapping = addMapping(entityClass, dtoClass);
            else
                throw new IllegalArgumentException("Couldn't find DtoMapping matching the provided types");
        }

        return dtoMapping;
    }

    private boolean checkClass(Class<?> targetClass, Class<?> receivedClass, boolean exactMatch) {
        if (exactMatch)
            return targetClass.equals(receivedClass);
        else
            return targetClass.isAssignableFrom(receivedClass);
    }

}
