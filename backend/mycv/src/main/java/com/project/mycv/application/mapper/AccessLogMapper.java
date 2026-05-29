package com.project.mycv.application.mapper;

import com.project.mycv.domain.dto.cv.AccessLogDTO;
import com.project.mycv.domain.dto.cv.AccessLogInsertDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AccessLogMapper {
    boolean insert(AccessLogInsertDTO dto);

    List<AccessLogDTO> findByCvId(@Param("cvId") Long cvId, @Param("limit") int limit);

    long countByCvId(@Param("cvId") Long cvId);

    List<Map<String, Object>> countByDeviceType(@Param("cvId") Long cvId);

    List<Map<String, Object>> countByBrowser(@Param("cvId") Long cvId);
}

