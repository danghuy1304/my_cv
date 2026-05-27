package com.project.mycv.application.service.base;

import com.project.mycv.domain.dto.paginate.PaginationDTO;

import java.util.Optional;

public interface ReadableService<E, T> {
    PaginationDTO<E> getAll(Integer page, Integer pageSize);

    Optional<E> findById(T id);

    E getById(T id);
}
