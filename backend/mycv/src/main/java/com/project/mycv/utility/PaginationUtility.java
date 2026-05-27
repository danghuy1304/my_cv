package com.project.mycv.utility;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.mycv.domain.dto.paginate.Pagination;
import com.project.mycv.domain.dto.paginate.PaginationDTO;

import java.util.List;
import java.util.function.Supplier;

public final class PaginationUtility {
    private PaginationUtility() {
    }

    public static <E> PaginationDTO<E> paginate(Supplier<List<E>> selectQuery, Integer page, Integer perPage) {
        int currentPage = (page == null || page < 0) ? 1 : page + 1;
        int pageSize = (perPage == null || perPage <= 0) ? 10 : perPage;

        try (Page<E> pageHelperResult = PageHelper.startPage(currentPage, pageSize)) {

            List<E> resultList = selectQuery.get();

            long totalElements = pageHelperResult.getTotal();
            int totalPages = pageHelperResult.getPages();

            Pagination pagination = new Pagination(
                    page,
                    perPage,
                    totalPages - 1,
                    totalElements
            );

            return new PaginationDTO<>(resultList, pagination);
        }
    }

    public static <E> PaginationDTO<E> paginate(Integer page, Integer perPage, List<E> mybatisList) {
        page = page == null ? 0 : page;
        perPage = perPage == null ? 10 : perPage;

        PageInfo<E> pageData = new PageInfo<>(mybatisList);

        Pagination pagination = new Pagination(
                page,
                perPage,
                pageData.getPages() - 1,
                pageData.getTotal()
        );

        return new PaginationDTO<>(pageData.getList(), pagination);
    }
}
