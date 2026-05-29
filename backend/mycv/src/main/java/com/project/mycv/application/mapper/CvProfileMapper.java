package com.project.mycv.application.mapper;

import com.project.mycv.application.mapper.base.CrudMapper;
import com.project.mycv.application.mapper.base.ReadableMapper;
import com.project.mycv.domain.dto.cv.CvProfileDTO;
import com.project.mycv.domain.dto.cv.CvProfileDetailDTO;
import com.project.mycv.domain.dto.cv.CvProfileInsertDTO;
import com.project.mycv.domain.dto.cv.CvProfileUpdateDTO;
import com.project.mycv.domain.dto.cv.CvStatusUpdateDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface CvProfileMapper
        extends ReadableMapper<CvProfileDTO, Long>,
                CrudMapper<CvProfileInsertDTO, CvProfileUpdateDTO, Long> {

    /**
     * Override from CrudMapper — expose @Param names for MyBatis XML binding.
     * Order: entity first, id second (matches CrudMapper contract).
     */
    @Override
    boolean update(@Param("dto") CvProfileUpdateDTO entity, @Param("id") Long id);

    /**
     * Retrieve full CV profile detail with nested collections
     * (skills, educations, projects → tasks, interests, certifications).
     */
    Optional<CvProfileDetailDTO> findDetailById(@Param("id") Long id);

    /**
     * Find the most recent non-deleted CV profile (basic fields) owned by the given user.
     */
    Optional<CvProfileDTO> findByUserId(@Param("userId") Long userId);

    /**
     * Find the most recent non-deleted CV profile (full detail) owned by the given user.
     */
    Optional<CvProfileDetailDTO> findDetailByUserId(@Param("userId") Long userId);

    /**
     * Update status and is_public flag of a CV profile.
     */
    boolean updateStatus(@Param("id") Long id, @Param("dto") CvStatusUpdateDTO dto);

    /** Update the avatar_url of a specific CV profile. */
    boolean updateAvatarUrl(@Param("cvId") Long cvId, @Param("avatarUrl") String avatarUrl);

    /** Read the current avatar_url (may be null) of a CV profile. */
    Optional<String> findAvatarUrl(@Param("cvId") Long cvId);
}
