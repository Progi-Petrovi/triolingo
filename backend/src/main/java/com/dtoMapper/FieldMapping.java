package com.dtoMapper;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang3.StringUtils;

public class FieldMapping<E, D> {

    private final Method entityGetter;
    private final Method entitySetter;
    private final Method dtoGetter;

    private final TypeMapping<E, D> typeMapping;

    public final boolean ignoreNull;

    private static final Logger logger = Logger.getLogger(FieldMapping.class.getName());

    public FieldMapping(Method entityGetter, Method entitySetter, Method dtoGetter, boolean ignoreNull,
            TypeMapping<E, D> typeMapping) {
        this.entityGetter = entityGetter;
        this.entitySetter = entitySetter;
        this.dtoGetter = dtoGetter;
        this.typeMapping = typeMapping;
        this.ignoreNull = ignoreNull;
    }

    @SuppressWarnings("unchecked")
    public E toEntity(Object dtoValue) {
        return typeMapping.toEntity((D) dtoValue);
    }

    @SuppressWarnings("unchecked")
    public D toDto(Object entityValue) {
        return typeMapping.toDto((E) entityValue);
    }

    @Override
    public int hashCode() {
        return dtoGetter.hashCode();
    }

    public Method getEntityGetter() {
        return entityGetter;
    }

    public Method getEntitySetter() {
        return entitySetter;
    }

    public Method getDtoGetter() {
        return dtoGetter;
    }

    public Type getEntityType() {
        return typeMapping.getEntityType();
    }

    public Type getDtoType() {
        return typeMapping.getDtoType();
    }

    public static <E, D> FieldMapping<E, D> generateFieldMapping(Class<?> entityClass, Class<?> dtoClass,
            String dtoFieldName, TypeMapping<E, D> typeMapping, Boolean ignoreNull) {
        Method dtoGetter = getMethodFromClass(dtoFieldName, dtoClass, 0);

        Method entityGetter = getMethodFromClass("get" + StringUtils.capitalize(dtoGetter.getName()), entityClass, 0);
        Method entitySetter = getMethodFromClass("set" + StringUtils.capitalize(dtoGetter.getName()), entityClass, 1);

        return new FieldMapping<E, D>(entityGetter, entitySetter, dtoGetter, ignoreNull, typeMapping);

    }

    public static FieldMapping<?, ?> generateFieldMapping(Class<?> entityClass, Method dtoGetter,
            Collection<TypeMapping<?, ?>> customTypeMappings, Boolean ignoreNull) {
        Class<?> dtoClass = dtoGetter.getDeclaringClass();

        logger.log(Level.FINER,
                String.format("Creating FieldMappings for dto field '%s' of type '%s'...",
                        dtoGetter.getName(), dtoGetter.getGenericReturnType().getTypeName()));

        Method entityGetter = getMethodFromClass("get" + StringUtils.capitalize(dtoGetter.getName()), entityClass, 0);
        Method entitySetter = getMethodFromClass("set" + StringUtils.capitalize(dtoGetter.getName()), entityClass, 1);
        if (entityGetter == null || entitySetter == null)
            return null;

        if (!entitySetter.getGenericParameterTypes()[0].equals(entityGetter.getGenericReturnType())) {
            logger.log(Level.FINE,
                    String.format(
                            "Failed, getter and setter methods are not of same type in entity '%s' for field '%s' of '%s'\nSetter type: '%s'\nGetter type: '%s'",
                            entityClass.getName(), dtoGetter.getName(), dtoClass.getName(),
                            entitySetter.getGenericParameterTypes()[0], entityGetter.getGenericReturnType()));
            return null;
        }

        TypeMapping<?, ?> typeMapping = TypeMapping.generateDefaultTypeMapping(entityGetter.getGenericReturnType(),
                dtoGetter.getGenericReturnType(), customTypeMappings);

        if (typeMapping == null) {
            logger.log(Level.FINE,
                    String.format(
                            "Failed to find type mapping between types '%s' for DTO field '%s' and '%s' for entity getter",
                            dtoGetter.getGenericReturnType().getTypeName(), dtoGetter.getName(),
                            entityGetter.getGenericReturnType().getTypeName()));
            return null;
        }

        return new FieldMapping<>(entityGetter, entitySetter,
                dtoGetter, ignoreNull, typeMapping);
    }

    private static Method getMethodFromClass(String methodName, Class<?> targetClass, int numberOfParameters) {
        Method method;
        if (numberOfParameters == 0) {
            try {
                method = targetClass.getMethod(methodName);
            } catch (NoSuchMethodException | SecurityException e) {
                method = null;
            }
        } else {
            method = Arrays.asList(targetClass.getMethods()).stream().filter(
                    (Method filterMethod) -> {
                        return filterMethod.getParameters().length == numberOfParameters
                                && filterMethod.getName().equals(methodName);
                    })
                    .findAny().orElse(null);
        }
        if (method == null) {
            logger.log(Level.FINE,
                    String.format(
                            "Failed, method with name '%s' does not exist in class '%s'",
                            methodName, targetClass.getName()));
            return null;
        }
        return method;
    }
}
