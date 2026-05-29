package com.project.mycv.application.service.public_;

import com.project.mycv.application.mapper.AccessLogMapper;
import com.project.mycv.application.mapper.PublicCvMapper;
import com.project.mycv.config.exception.NotFoundException;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.domain.dto.cv.AccessLogInsertDTO;
import com.project.mycv.domain.dto.cv.CvProfileDetailDTO;
import com.project.mycv.helper.UserAgentParser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicCvServiceImpl implements PublicCvService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PublicCvServiceImpl.class);

    private final PublicCvMapper publicCvMapper;
    private final AccessLogMapper accessLogMapper;

    @Override
    public CvProfileDetailDTO getPublicCv(String username) {
        LOGGER.info("PublicCvService.getPublicCv: username={}", username);

        CvProfileDetailDTO cv = publicCvMapper.findPublicDetailByUsername(username)
                .orElseThrow(() -> new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND));

        // Atomic view count increment — no read-modify-write race condition
        publicCvMapper.incrementViewCount(cv.getId());

        return cv;
    }

    @Override
    public void logCvView(String username, HttpServletRequest request) {
        LOGGER.info("PublicCvService.logCvView: username={}", username);

        Long cvId = publicCvMapper.findCvIdByUsername(username)
                .orElseThrow(() -> new NotFoundException(MessageKeys.CV_PROFILE_NOT_FOUND));

        String userAgent = request.getHeader("User-Agent");

        AccessLogInsertDTO logDTO = AccessLogInsertDTO.builder()
                .cvId(cvId)
                .ipAddress(UserAgentParser.extractIpAddress(request))
                .userAgent(userAgent)
                .browser(UserAgentParser.detectBrowser(userAgent))
                .operatingSystem(UserAgentParser.detectOS(userAgent))
                .deviceType(UserAgentParser.detectDeviceType(userAgent))
                .referer(request.getHeader("Referer"))
                .build();

        accessLogMapper.insert(logDTO);
    }
}

