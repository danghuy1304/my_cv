package com.project.mycv.application.service.base;

import java.util.List;

public interface BatchOperation<E, T> {
    List<E> insertBatch(List<E> entities);
    List<E> updateBatch(List<E> entities);
    int deleteBatch(List<T> ids);
}
