package com.project.mycv.application.mapper.base;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CrudMapper<I, U, T> {
    boolean insert(I entity);

    boolean update(U entity, T id);

    boolean delete(T id);
}
