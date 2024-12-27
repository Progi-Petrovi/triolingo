package com.dtoMapper;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

/**
 * 
 * Used to get parametrized types from a generic.
 * <p>
 * Example:
 * <p>
 *   To get List<String> as a type:
 * <pre>
 * {@code
 * Type t = new TypeGetter<List<String>>() {
 * }.getType();
 * </pre>
 * 
 */
public abstract class TypeGetter<T> {
    public Type getType() {
        Class<?> typeClass = this.getClass();
        ParameterizedType type = (ParameterizedType) typeClass.getGenericSuperclass();
        return type.getActualTypeArguments()[0];
    }
}
