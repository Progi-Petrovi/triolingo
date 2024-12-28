package com.dtoMapper;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Parameter;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DtoMapping<E, D> {

    private final Class<E> entityClass;
    private final Class<D> dtoClass;

    private final Collection<FieldMapping<?, ?>> fieldMappings;

    private static final Logger logger = Logger.getLogger(DtoMapping.class.getName());

    public DtoMapping(Class<E> entityClass, Class<D> dtoClass,
            FieldMapping<?, ?>... fieldMappings) {
        if (!dtoClass.isRecord())
            throw new IllegalArgumentException("DTO class must be a record");
        if (dtoClass.getConstructors().length > 1)
            throw new IllegalArgumentException("DTO class must have no custom constructors");
        try {
            entityClass.getConstructor();
        } catch (NoSuchMethodException | SecurityException e) {
            throw new IllegalArgumentException("Entity class must have visible a no args constructor");
        }

        this.dtoClass = dtoClass;
        this.entityClass = entityClass;
        this.fieldMappings = new HashSet<>(Arrays.asList(fieldMappings));
    }

    public DtoMapping(Class<E> entityClass, Class<D> dtoClass,
            Collection<FieldMapping<?, ?>> fieldMappings) {
        if (!dtoClass.isRecord())
            throw new IllegalArgumentException("DTO class must be a record");
        if (dtoClass.getConstructors().length != 1)
            throw new IllegalArgumentException("DTO record class must have no custom constructors");
        try {
            entityClass.getConstructor();
        } catch (NoSuchMethodException | SecurityException e) {
            throw new IllegalArgumentException("Entity class must have a visible no args constructor");
        }

        this.dtoClass = dtoClass;
        this.entityClass = entityClass;
        this.fieldMappings = fieldMappings;
    }

    public Class<E> getEntityClass() {
        return entityClass;
    }

    public Class<D> getDtoClass() {
        return dtoClass;
    }

    @SuppressWarnings("unchecked")
    public D createDTO(E entity) {
        Constructor<D> dtoConstructor = (Constructor<D>) (dtoClass.getConstructors()[0]);
        Parameter[] parameters = dtoConstructor.getParameters();
        Object[] parameterValues = new Object[parameters.length];

        logger.log(Level.FINER,
                String.format(
                        "Creating DTO '%s' from entity '%s'",
                        dtoClass.getName(), entityClass.getName()));

        for (int i = 0; i < parameters.length; i++) {

            Parameter parameter = parameters[i];
            FieldMapping<?, ?> fieldMapping = fieldMappings.stream().filter(
                    (mapping) -> mapping.getDtoGetter().getName().equals(parameter.getName())).findAny().orElse(null);

            logger.log(Level.FINER,
                    String.format(
                            "Finding FieldMapping for parameter '%s'",
                            parameter.getName()));

            if (fieldMapping == null) {
                parameterValues[i] = null;
                logger.log(Level.FINER,
                        String.format(
                                "Failed to find FieldMapping, setting parameter to null"));
                continue;
            }

            try {
                parameterValues[i] = fieldMapping
                        .toDto(fieldMapping.getEntityGetter().invoke(entity));
            } catch (IllegalArgumentException | SecurityException | IllegalAccessException
                    | InvocationTargetException e) {
                throw new RuntimeException(String.format(
                        "Failed to run getter '%s' of '%s' for constructor parameter '%s' of '%s'",
                        fieldMapping.getEntityGetter(),
                        entityClass.getName(), fieldMapping.getDtoGetter(), dtoClass.getName()), e);
            }
        }

        D dto;
        try {
            dto = dtoConstructor.newInstance(parameterValues);
        } catch (InstantiationException | IllegalAccessException | IllegalArgumentException
                | InvocationTargetException e) {
            throw new RuntimeException(String.format(
                    "Failed to run constructor of DTO '%s' for entity '%s'",
                    dtoClass.getName(), entityClass.getName()), e);
        }

        return dto;
    }

    public E createEntity(D dto) {
        // Create entity instance using no args constructor
        E entity;
        try {
            entity = entityClass.getConstructor().newInstance();
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException | SecurityException
                | InstantiationException | IllegalArgumentException e) {
            throw new RuntimeException(String.format(
                    "Failed to run no args constructor of entity '%s'",
                    entityClass.getName()), e);
        }

        return updateEntity(entity, dto);
    }

    public E updateEntity(E entity, D dto) {
        // Get field value from DTO, transform it using the mapping, apply it to the
        // entity using setter
        for (FieldMapping<?, ?> fieldMapping : fieldMappings) {

            Object dtoValue;
            try {
                dtoValue = fieldMapping.getDtoGetter().invoke(dto);
            } catch (IllegalAccessException | InvocationTargetException | SecurityException e) {
                throw new RuntimeException(String.format(
                        "Failed to invoke DTO record '%s' getter '%s'",
                        dtoClass.getName(), fieldMapping.getDtoGetter()), e);
            }

            if (dtoValue == null && fieldMapping.ignoreNull)
                continue;

            Object entityValue = fieldMapping.toEntity(dtoValue);

            try {
                fieldMapping.getEntitySetter().invoke(entity, entityValue);
            } catch (IllegalAccessException | InvocationTargetException e) {
                throw new RuntimeException(String.format(
                        "Failed to invoke entity '%s' setter '%s'",
                        dtoClass.getName(), fieldMapping.getDtoGetter()), e);
            }

        }

        return entity;
    }

    /**
     * Creates default dto mapping by mathing all DTO fields with getters and
     * setters in entity.
     * 
     * @param <E>                 Entity type
     * @param <D>                 DTO type
     * @param entityClass
     * @param dtoClass
     * @param customTypeMappings  Available custom type mappings, will be used if
     *                            there is a pair of fields with types assignable
     *                            from the types of the TypeMappings.
     * @param customFieldMappings Custom FieldMappings that will be used instead of
     *                            generated default FieldMappings.
     */
    public static <E, D> DtoMapping<E, D> generateDefaultDtoMapping(Class<E> entityClass, Class<D> dtoClass,
            Collection<TypeMapping<?, ?>> customTypeMappings, Collection<FieldMapping<?, ?>> customFieldMappings) {
        HashSet<FieldMapping<?, ?>> fieldMappings = new HashSet<>(customFieldMappings);

        // Go through each field of DTO, find a getter for that field and generate
        // mapping for that getter
        for (Field dtoField : dtoClass.getDeclaredFields()) {
            Method dtoGetter;
            try {
                dtoGetter = dtoClass.getMethod(dtoField.getName());
            } catch (NoSuchMethodException | SecurityException e) {
                throw new RuntimeException(String.format(
                        "Failed to find getter method of field '%s' in '%s'",
                        dtoField.getName(), dtoClass.getName()), e);
            }

            FieldMapping<?, ?> fieldMapping = FieldMapping.generateFieldMapping(entityClass, dtoGetter,
                    customTypeMappings, true);

            if (fieldMapping != null) {
                fieldMappings.add(fieldMapping);
                logger.log(Level.FINER,
                        String.format("Created and added FieldMapping"));
            }

        }
        return new DtoMapping<>(entityClass, dtoClass, fieldMappings);
    }
}
