package com.project.mycv.domain.dto.paginate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaginationDTO<E> {
    private List<E> data;

    private Pagination pagination;
}
