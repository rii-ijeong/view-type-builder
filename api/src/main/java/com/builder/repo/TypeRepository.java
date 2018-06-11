package com.builder.repo;

import java.util.List;

import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import com.builder.model.TypeObject;

@EnableScan
public interface TypeRepository extends CrudRepository<TypeObject, String> {

  List<TypeObject> findByJsonDefinition(String jsonDefinition);
}
