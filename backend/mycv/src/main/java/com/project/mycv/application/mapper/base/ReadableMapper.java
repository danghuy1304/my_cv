package com.project.mycv.application.mapper.base;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ReadableMapper<E, T> {
    List<E> findAll();

    Optional<E> findById(T id);
}
