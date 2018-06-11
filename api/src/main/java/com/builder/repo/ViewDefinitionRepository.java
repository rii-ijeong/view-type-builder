package com.builder.repo;

import java.util.List;

import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import com.builder.model.ViewDefinition;

@EnableScan
public interface ViewDefinitionRepository extends CrudRepository<ViewDefinition, String> {

  List<ViewDefinition> findByJsonDefinition(String jsonDefinition);
}
