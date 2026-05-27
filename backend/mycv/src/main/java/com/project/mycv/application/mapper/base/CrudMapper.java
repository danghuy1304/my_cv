package com.project.mycv.application.mapper.base;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CrudMapper<E, T> {
    boolean insert(E entity);

    boolean update(E entity, T id);

    boolean delete(T id);
}
