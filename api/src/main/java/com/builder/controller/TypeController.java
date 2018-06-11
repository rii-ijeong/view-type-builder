package com.builder.controller;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

import com.builder.model.TypeObject;
import com.builder.repo.TypeRepository;

import com.builder.model.EnumList;
import com.builder.repo.EnumRepository;

@RestController
@RequestMapping("/api/type")
public class TypeController {

  @Autowired
  TypeRepository repository;
  
  @Autowired
  EnumRepository enumRepository;

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/save",
    method = RequestMethod.POST
  )
  public ResponseEntity<?> addType(
    @RequestBody TypeObject typeObject
  ){
    TypeObject existingType = repository.findOne(typeObject.getId());
    if(existingType != null){
      return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    repository.save(typeObject);
    return new ResponseEntity<>(typeObject, HttpStatus.OK);
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/get",
    method = RequestMethod.GET
  )
  public ResponseEntity<?> getType(
    @RequestParam("id") String id
  ){
    TypeObject existingType = repository.findOne(id);
    if(existingType == null){
      return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    return new ResponseEntity<>(existingType, HttpStatus.OK);
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/delete",
    method = RequestMethod.GET
  )
  public ResponseEntity<?> deleteType(
    @RequestParam("id") String id
  ){
    TypeObject existingType = repository.findOne(id);
    if(existingType == null){
      return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    repository.delete(existingType);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/get-all",
    method = RequestMethod.GET
  )
  public List<TypeObject> getAll(){
    Iterable<TypeObject> typeObjects = repository.findAll();
    List<TypeObject> typeList = new ArrayList<TypeObject>();
    for(TypeObject typeObject : typeObjects ){
      typeList.add(typeObject);
    }
    return typeList;
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value="/enum/save",
    method=RequestMethod.POST
  )
  public ResponseEntity<?> saveEnum(
    @RequestBody EnumList enumObject
  ){
    EnumList existingEnum = enumRepository.findOne(enumObject.getId());
    if(existingEnum != null){
      return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    enumRepository.save(enumObject);
    return new ResponseEntity<>(enumObject, HttpStatus.OK);
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value="/enum/all",
    method=RequestMethod.GET
  )
  public List<EnumList> getAllEnums(){
    Iterable<EnumList> enums = enumRepository.findAll();
    List<EnumList> enumList = new ArrayList<EnumList>();
    for(EnumList enumObject : enums){
      enumList.add(enumObject);
    }
    return enumList;
  }
}