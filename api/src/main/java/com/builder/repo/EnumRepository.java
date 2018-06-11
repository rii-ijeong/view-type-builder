package com.builder.repo;

import java.util.List;

import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import com.builder.model.EnumList;

@EnableScan
public interface EnumRepository extends CrudRepository<EnumList, String> {

  List<String> findByValues(List<String> values);
}
