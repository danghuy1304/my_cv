package com.project.mycv.application.service.cv;

import com.project.mycv.application.mapper.AccessLogMapper;
import com.project.mycv.application.mapper.CvChildMapper;
import com.project.mycv.application.mapper.CvProfileMapper;
import com.project.mycv.application.service.file.FileStorageService;
import com.project.mycv.config.exception.AuthorizedException;
import com.project.mycv.config.exception.NotFoundException;
import com.project.mycv.config.security.CustomUserDetails;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.constant.type.HTypeCvStatus;
import com.project.mycv.domain.dto.cv.CvProfileCreateDTO;
import com.project.mycv.domain.dto.cv.CvProfileDTO;
import com.project.mycv.domain.dto.cv.CvProfileDetailDTO;
import com.project.mycv.domain.dto.cv.CvProfileInsertDTO;
import com.project.mycv.domain.dto.cv.CvProfileUpdateDTO;
import com.project.mycv.domain.dto.cv.AccessLogDTO;
import com.project.mycv.domain.dto.cv.CvStatsDTO;
import com.project.mycv.domain.dto.cv.CvStatusUpdateDTO;
import com.project.mycv.domain.dto.cv.bulk.CvActivitiesBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvCertificationsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvEducationsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvInterestsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvProjectItemDTO;
import com.project.mycv.domain.dto.cv.bulk.CvProjectsBulkDTO;
import com.project.mycv.domain.dto.cv.bulk.CvSkillsBulkDTO;
import com.project.mycv.domain.dto.paginate.PaginationDTO;
import com.project.mycv.utility.PaginationUtility;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CvProfileServiceImpl implements CvProfileService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CvProfileServiceImpl.class);

    private final CvProfileMapper cvProfileMapper;
    private final CvChildMapper cvChildMapper;
    private final AccessLogMapper accessLogMapper;
    private final FileStorageService fileStorageService;

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: manage ANY CV by id
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public PaginationDTO<CvProfileDTO> getAll(Integer page, Integer pageSize) {
        LOGGER.info("CvProfileService.getAll: page={}, pageSize={}", page, pageSize);
        return PaginationUtility.paginate(cvProfileMapper::findAll, page, pageSize);
    }

    @Override
    public CvProfileDTO create(CvProfileCreateDTO dto) {
        Long userId = getCurrentUserId();
        LOGGER.info("CvProfileService.create: userId={}, fullName={}", userId, dto.getFullName());

        CvProfileInsertDTO insertDTO = CvProfileInsertDTO.builder()
                .userId(userId)
                .fullName(dto.getFullName())
                .title(dto.getTitle())
                .status(HTypeCvStatus.DRAFT.getValue())
                .isPublic(false)
                .viewCount(0L)
                .build();

        cvProfileMapper.insert(insertDTO);

        return cvProfileMapper.findById(insertDTO.getId())
                .orElseThrow(() -> new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND));
    }

    @Override
    public CvProfileDetailDTO getDetailById(Long id) {
        LOGGER.info("CvProfileService.getDetailById: id={}", id);
        return cvProfileMapper.findDetailById(id)
                .orElseThrow(() -> new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND));
    }

    @Override
    public void update(Long id, CvProfileUpdateDTO dto) {
        LOGGER.info("CvProfileService.update: id={}", id);
        assertExists(id);
        cvProfileMapper.update(dto, id);
    }

    @Override
    public void updateStatus(Long id, CvStatusUpdateDTO dto) {
        LOGGER.info("CvProfileService.updateStatus: id={}, status={}", id, dto.getStatus());
        assertExists(id);
        cvProfileMapper.updateStatus(id, dto);
    }

    @Override
    public void delete(Long id) {
        LOGGER.info("CvProfileService.delete: id={}", id);
        assertExists(id);
        cvProfileMapper.delete(id);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: self-CV (no id in URL)
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CvProfileDetailDTO getMyDetail() {
        Long userId = getCurrentUserId();
        LOGGER.info("CvProfileService.getMyDetail: userId={}", userId);
        return cvProfileMapper.findDetailByUserId(userId)
                .orElseThrow(() -> new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND));
    }

    @Override
    public void updateMy(CvProfileUpdateDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMy: cvId={}", cvId);
        cvProfileMapper.update(dto, cvId);
    }

    @Override
    public void updateMyStatus(CvStatusUpdateDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMyStatus: cvId={}, status={}", cvId, dto.getStatus());
        cvProfileMapper.updateStatus(cvId, dto);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: bulk update child sections
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void updateMySkills(CvSkillsBulkDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMySkills: cvId={}", cvId);
        cvChildMapper.deleteSkillsByCvId(cvId);
        List<?> skills = dto.getSkills();
        if (skills != null && !skills.isEmpty()) {
            cvChildMapper.insertSkills(cvId, dto.getSkills());
        }
    }

    @Override
    @Transactional
    public void updateMyEducations(CvEducationsBulkDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMyEducations: cvId={}", cvId);
        cvChildMapper.deleteEducationsByCvId(cvId);
        List<?> educations = dto.getEducations();
        if (educations != null && !educations.isEmpty()) {
            cvChildMapper.insertEducations(cvId, dto.getEducations());
        }
    }

    @Override
    @Transactional
    public void updateMyProjects(CvProjectsBulkDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMyProjects: cvId={}", cvId);
        // Cascade delete removes tasks automatically (DB FK ON DELETE CASCADE)
        cvChildMapper.deleteProjectsByCvId(cvId);
        List<CvProjectItemDTO> projects = dto.getProjects();
        if (projects != null && !projects.isEmpty()) {
            for (CvProjectItemDTO project : projects) {
                // useGeneratedKeys sets project.id after insert
                cvChildMapper.insertProject(cvId, project);
                if (project.getTasks() != null && !project.getTasks().isEmpty()) {
                    cvChildMapper.insertProjectTasks(project.getId(), project.getTasks());
                }
            }
        }
    }

    @Override
    @Transactional
    public void updateMyInterests(CvInterestsBulkDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMyInterests: cvId={}", cvId);
        cvChildMapper.deleteInterestsByCvId(cvId);
        List<?> interests = dto.getInterests();
        if (interests != null && !interests.isEmpty()) {
            cvChildMapper.insertInterests(cvId, dto.getInterests());
        }
    }

    @Override
    @Transactional
    public void updateMyCertifications(CvCertificationsBulkDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMyCertifications: cvId={}", cvId);
        cvChildMapper.deleteCertificationsByCvId(cvId);
        List<?> certs = dto.getCertifications();
        if (certs != null && !certs.isEmpty()) {
            cvChildMapper.insertCertifications(cvId, dto.getCertifications());
        }
    }

    @Override
    @Transactional
    public void updateMyActivities(CvActivitiesBulkDTO dto) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.updateMyActivities: cvId={}", cvId);
        cvChildMapper.deleteActivitiesByCvId(cvId);
        List<?> acts = dto.getActivities();
        if (acts != null && !acts.isEmpty()) {
            cvChildMapper.insertActivities(cvId, dto.getActivities());
        }
    }

    @Override
    @Transactional
    public String uploadMyAvatar(MultipartFile file) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.uploadMyAvatar: cvId={}", cvId);
        String oldAvatarUrl = cvProfileMapper.findAvatarUrl(cvId).orElse(null);
        if (oldAvatarUrl != null) {
            fileStorageService.deleteAvatar(oldAvatarUrl);
        }
        String newUrl = fileStorageService.storeAvatar(cvId, file);
        cvProfileMapper.updateAvatarUrl(cvId, newUrl);
        return newUrl;
    }

    @Override
    public List<AccessLogDTO> getMyAccessLogs(int limit) {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.getMyAccessLogs: cvId={}, limit={}", cvId, limit);
        return accessLogMapper.findByCvId(cvId, limit);
    }

    @Override
    public CvStatsDTO getMyStats() {
        Long cvId = getMyCurrentCvId();
        LOGGER.info("CvProfileService.getMyStats: cvId={}", cvId);
        long total = accessLogMapper.countByCvId(cvId);
        List<Map<String, Object>> deviceRows = accessLogMapper.countByDeviceType(cvId);
        List<Map<String, Object>> browserRows = accessLogMapper.countByBrowser(cvId);
        Map<String, Long> devices = new HashMap<>();
        for (Map<String, Object> row : deviceRows) {
            devices.put(String.valueOf(row.get("label")),
                    ((Number) row.get("count")).longValue());
        }
        Map<String, Long> browsers = new HashMap<>();
        for (Map<String, Object> row : browserRows) {
            browsers.put(String.valueOf(row.get("label")),
                    ((Number) row.get("count")).longValue());
        }
        List<AccessLogDTO> recent = accessLogMapper.findByCvId(cvId, 10);
        return CvStatsDTO.builder()
                .totalViews(total)
                .deviceBreakdown(devices)
                .browserBreakdown(browsers)
                .recentLogs(recent)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get the authenticated user's ID from the SecurityContext.
     * Throws {@link AuthorizedException} if the security context has no valid principal.
     */
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AuthorizedException(MessageKeys.AUTHORIZATION_FAIL);
        }
        Object principal = auth.getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new AuthorizedException(MessageKeys.AUTHORIZATION_FAIL);
        }
        Long userId = userDetails.getUserDto().getId();
        if (userId == null) {
            throw new AuthorizedException(MessageKeys.AUTHORIZATION_FAIL);
        }
        return userId;
    }

    /**
     * Resolve the current admin's CV id, throwing {@link NotFoundException} if none exists.
     */
    private Long getMyCurrentCvId() {
        Long userId = getCurrentUserId();
        return cvProfileMapper.findByUserId(userId)
                .map(CvProfileDTO::getId)
                .orElseThrow(() -> new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND));
    }

    /**
     * Throw {@link NotFoundException} when the CV profile does not exist or is soft-deleted.
     * Also guards against a null id to prevent passing null to the mapper.
     */
    private void assertExists(Long id) {
        if (id == null) {
            throw new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND);
        }
        cvProfileMapper.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND));
    }
}

