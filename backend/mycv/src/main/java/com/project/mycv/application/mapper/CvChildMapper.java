package com.project.mycv.application.mapper;

import com.project.mycv.domain.dto.cv.bulk.CvActivityItemDTO;
import com.project.mycv.domain.dto.cv.bulk.CvCertificationItemDTO;
import com.project.mycv.domain.dto.cv.bulk.CvEducationItemDTO;
import com.project.mycv.domain.dto.cv.bulk.CvInterestItemDTO;
import com.project.mycv.domain.dto.cv.bulk.CvProjectItemDTO;
import com.project.mycv.domain.dto.cv.bulk.CvProjectTaskItemDTO;
import com.project.mycv.domain.dto.cv.bulk.CvSkillItemDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Handles bulk delete/insert operations on CV child entities
 * (skills, educations, projects + tasks, interests, certifications).
 */
@Mapper
public interface CvChildMapper {

    // ── Skills ────────────────────────────────────────────────────────────────
    void deleteSkillsByCvId(@Param("cvId") Long cvId);

    void insertSkills(@Param("cvId") Long cvId, @Param("list") List<CvSkillItemDTO> list);

    // ── Educations ────────────────────────────────────────────────────────────
    void deleteEducationsByCvId(@Param("cvId") Long cvId);

    void insertEducations(@Param("cvId") Long cvId, @Param("list") List<CvEducationItemDTO> list);

    // ── Projects ─────────────────────────────────────────────────────────────
    void deleteProjectsByCvId(@Param("cvId") Long cvId);

    /**
     * Insert a single project; auto-populates {@code item.id} via useGeneratedKeys
     * so that tasks can be inserted with the correct project_id.
     */
    boolean insertProject(@Param("cvId") Long cvId, @Param("item") CvProjectItemDTO item);

    void insertProjectTasks(@Param("projectId") Long projectId,
                            @Param("list") List<CvProjectTaskItemDTO> list);

    // ── Interests ─────────────────────────────────────────────────────────────
    void deleteInterestsByCvId(@Param("cvId") Long cvId);

    void insertInterests(@Param("cvId") Long cvId, @Param("list") List<CvInterestItemDTO> list);

    // ── Certifications ────────────────────────────────────────────────────────
    void deleteCertificationsByCvId(@Param("cvId") Long cvId);

    void insertCertifications(@Param("cvId") Long cvId,
                              @Param("list") List<CvCertificationItemDTO> list);

    // ── Activities ────────────────────────────────────────────────────────────
    void deleteActivitiesByCvId(@Param("cvId") Long cvId);

    void insertActivities(@Param("cvId") Long cvId,
                          @Param("list") List<CvActivityItemDTO> list);
}

