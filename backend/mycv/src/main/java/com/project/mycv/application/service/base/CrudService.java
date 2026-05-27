package com.project.mycv.application.service.base;

public interface CrudService<E, T> {
    E insert(E entity);
    E update(E entity, T id);
    void delete(T id);
}
