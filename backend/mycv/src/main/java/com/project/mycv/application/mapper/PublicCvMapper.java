package com.project.mycv.application.mapper;

import com.project.mycv.domain.dto.cv.CvProfileDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

/**
 * Mapper for public-facing CV queries.
 * References CvProfileMapper's resultMap to avoid duplication.
 */
@Mapper
public interface PublicCvMapper {

    /**
     * Find a published, public CV by the owner's username.
     * Conditions: status = 'PUBLISHED', is_public = true, deleted_at IS NULL.
     */
    Optional<CvProfileDetailDTO> findPublicDetailByUsername(@Param("username") String username);

    /**
     * Find the cv_id for the most recent non-deleted CV belonging to the given username.
     * Used by the access-log endpoint (no status restriction).
     */
    Optional<Long> findCvIdByUsername(@Param("username") String username);

    /**
     * Atomically increment view_count by 1. Safe under concurrent requests.
     */
    boolean incrementViewCount(@Param("cvId") Long cvId);
}

