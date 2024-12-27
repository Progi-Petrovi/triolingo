package com.dtoMapper;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.Collection;
import java.util.function.Function;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TypeMapping<E, D> {

    private final Function<D, E> toEntityFunction;
    private final Function<E, D> toDtoFunction;

    private final Type entityType;
    private final Type dtoType;

    private static final Logger logger = Logger.getLogger(FieldMapping.class.getName());

    public TypeMapping(Function<E, D> toDtoFunction, Function<D, E> toEntityFunction, Type entityType,
            Type dtoType) {
        this.toEntityFunction = toEntityFunction;
        this.toDtoFunction = toDtoFunction;
        this.dtoType = dtoType;
        this.entityType = entityType;
    }

    public E toEntity(D dtoValue) {
        return toEntityFunction.apply(dtoValue);
    }

    public D toDto(E entityValue) {
        return toDtoFunction.apply(entityValue);
    }

    public Type getEntityType() {
        return entityType;
    }

    public Type getDtoType() {
        return dtoType;
    }

    public static <T> TypeMapping<T, T> sameTypeMapping(Type type) {
        return new TypeMapping<T, T>((T t) -> t, (T t) -> t, type, type);
    }

    @SuppressWarnings("unchecked")
    public static <E, D> TypeMapping<E, D> generateDefaultTypeMapping(Type entityType, Type dtoType,
            Collection<TypeMapping<?, ?>> customTypeMappings) {
        // If there exists a custom TypeMapping between these two types, use it
        TypeMapping<E, D> typeMapping = (TypeMapping<E, D>) customTypeMappings.stream().filter(
                (mapping) -> checkTypes(mapping.getDtoType(), dtoType)
                        && checkTypes(mapping.getEntityType(), entityType))
                .findAny().orElse(null);

        if (typeMapping != null) {
            logger.log(Level.FINER,
                    String.format("Found custom TypeMapping that can be used on fields"));
            return typeMapping;
        }

        // If they are the same type, use the same type mapping
        if (entityType.equals(dtoType)) {
            logger.log(Level.FINER,
                    String.format("Getters are of same return type, using default TypeMapping"));
            return (TypeMapping<E, D>) TypeMapping.sameTypeMapping(entityType);
        }

        return null;
    }

    private static boolean checkTypes(Type target, Type received) {
        if (received instanceof ParameterizedType && target instanceof ParameterizedType) {
            ParameterizedType receivedType = (ParameterizedType) received, targetType = (ParameterizedType) target;
            return Arrays.equals(receivedType.getActualTypeArguments(),
                    targetType.getActualTypeArguments())
                    && ((Class<?>) targetType.getRawType()).isAssignableFrom(
                            (Class<?>) receivedType.getRawType());

        } else if (received instanceof Class && target instanceof Class) {
            Class<?> receivedClass = (Class<?>) received, targetClass = (Class<?>) target;
            return targetClass.isAssignableFrom(receivedClass);
        }
        return false;
    }
}
