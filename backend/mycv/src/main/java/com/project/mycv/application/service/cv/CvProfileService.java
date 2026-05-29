package com.project.mycv.application.service.cv;

import com.project.mycv.domain.dto.cv.AccessLogDTO;
import com.project.mycv.domain.dto.cv.CvProfileCreateDTO;
import com.project.mycv.domain.dto.cv.CvProfileDTO;
import com.project.mycv.domain.dto.cv.CvProfileDetailDTO;
import com.project.mycv.domain.dto.cv.CvProfileUpdateDTO;
import com.project.mycv.domain.dto.cv.CvStatsDTO;
import com.project.mycv.domain.dto.cv.CvStatusUpdateDTO;
import com.project.mycv.domain.dto.cv.bulk.CvActivitiesBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvCertificationsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvEducationsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvInterestsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvProjectsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvSkillsBulkDTO;
import com.project.mycv.domain.dto.paginate.PaginationDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CvProfileService {

    // ── Admin: manage ANY CV by id ────────────────────────────────────────────

    PaginationDTO<CvProfileDTO> getAll(Integer page, Integer pageSize);

    CvProfileDTO create(CvProfileCreateDTO dto);

    CvProfileDetailDTO getDetailById(Long id);

    void update(Long id, CvProfileUpdateDTO dto);

    void updateStatus(Long id, CvStatusUpdateDTO dto);

    void delete(Long id);

    // ── Admin: self-CV (no id in URL) ─────────────────────────────────────────

    /** Get the full detail of the currently authenticated admin's CV. */
    CvProfileDetailDTO getMyDetail();

    /** Update personal info / social links / summary of the current admin's CV. */
    void updateMy(CvProfileUpdateDTO dto);

    /** Update status + is_public of the current admin's CV. */
    void updateMyStatus(CvStatusUpdateDTO dto);

    // ── Admin: bulk update child sections ─────────────────────────────────────

    void updateMySkills(CvSkillsBulkDTO dto);

    void updateMyEducations(CvEducationsBulkDTO dto);

    void updateMyProjects(CvProjectsBulkDTO dto);

    void updateMyInterests(CvInterestsBulkDTO dto);

    void updateMyCertifications(CvCertificationsBulkDTO dto);

    void updateMyActivities(CvActivitiesBulkDTO dto);

    String uploadMyAvatar(MultipartFile file);

    List<AccessLogDTO> getMyAccessLogs(int limit);

    CvStatsDTO getMyStats();
}
