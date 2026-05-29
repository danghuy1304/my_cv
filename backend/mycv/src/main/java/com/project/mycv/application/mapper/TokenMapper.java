package com.project.mycv.application.mapper;

import com.project.mycv.application.mapper.base.CrudMapper;
import com.project.mycv.domain.model.Token;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface TokenMapper extends CrudMapper<Token, Token, String> {
    List<Token> findAll();

    Optional<Token> findByToken(@Param("refreshToken") String refreshToken);

    boolean revokeToken(@Param("refreshToken") String refreshToken);

    boolean expireToken(@Param("refreshToken") String refreshToken);
}
