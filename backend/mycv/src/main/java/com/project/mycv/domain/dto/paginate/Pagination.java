package com.project.mycv.domain.dto.paginate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Pagination {
    private Integer page;

    private Integer perPage;

    private Integer lastPage;

    private Long total;
}
