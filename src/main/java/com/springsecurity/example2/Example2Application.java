package com.springsecurity.example2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class Example2Application {

	public static void main(String[] args) {
		SpringApplication.run(Example2Application.class, args);
	}

}
