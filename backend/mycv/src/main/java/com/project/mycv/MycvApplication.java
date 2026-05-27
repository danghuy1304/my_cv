package com.project.mycv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class MycvApplication {

    public static void main(String[] args) {
        SpringApplication.run(MycvApplication.class, args);
    }

}
