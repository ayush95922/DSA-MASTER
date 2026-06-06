package com.dsaverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration.class
})
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
public class DsaverseApplication {

    public static void main(String[] args) {
        SpringApplication.run(DsaverseApplication.class, args);
    }
}
