package com.triolingo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

@SpringBootApplication
@PropertySources({
        @PropertySource("classpath:application.properties"),
        @PropertySource(value = "classpath:secret.properties", ignoreResourceNotFound = true)
})
public class TriolingoApplication {

    public static void main(String[] args) {
        SpringApplication.run(TriolingoApplication.class, args);
    }

}
